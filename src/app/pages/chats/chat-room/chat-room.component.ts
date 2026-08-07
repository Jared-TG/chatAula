import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonButtons, 
  IonIcon,
  IonFooter,
  IonInput,
  IonAvatar,
  ModalController,
  PopoverController,
  ActionSheetController,
  AlertController,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  ViewWillEnter
} from '@ionic/angular/standalone';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline, sendOutline, personAddOutline, ellipsisVertical, informationCircleOutline, personCircleOutline, peopleOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { InviteUserComponent } from '../invite-user/invite-user.component';
import { ManageMembersComponent } from '../manage-members/manage-members.component';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton, 
    IonButtons, 
    IonIcon,
    IonFooter,
    IonInput,
    IonAvatar,
    IonPopover,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class ChatRoomComponent implements ViewWillEnter, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private modalCtrl = inject(ModalController);
  private popoverCtrl = inject(PopoverController);
  private actionSheetCtrl = inject(ActionSheetController);
  private alertCtrl = inject(AlertController);
  private firestore = inject(Firestore);

  groupId: string = '';
  groupName: string = 'General';
  messages: any[] = [];
  newMessage: string = '';
  currentUserId: string = '';
  currentUser: any = null;
  isGoogleUser: boolean = false;
  currentMemberIds: string[] = [];
  userRole: 'student' | 'professor' = 'student';

  private msgSub!: Subscription;

  constructor() {
    addIcons({ arrowBackOutline, sendOutline, personAddOutline, ellipsisVertical, informationCircleOutline, personCircleOutline, peopleOutline });
  }

  ionViewWillEnter() {
    this.currentUser = this.authService.currentUser;
    this.currentUserId = this.currentUser?.uid || '';
    if (this.currentUser) {
      if (this.currentUser.providerData) {
        this.isGoogleUser = this.currentUser.providerData.some((p: any) => p.providerId === 'google.com');
      }
      
      // Cargar rol cada vez que se entra a la vista
      getDoc(doc(this.firestore, `users/${this.currentUserId}`)).then(snap => {
        if (snap.exists()) {
          this.userRole = snap.data()['role'] || 'student';
        }
      });
    }
    
    this.route.paramMap.subscribe(params => {
      this.groupId = params.get('id') || '';
      if (this.groupId) {
        this.loadMessages();
        
        // Limpiar contador de mensajes no leídos al entrar
        if (this.currentUserId) {
          this.chatService.resetUnreadCount(this.groupId, this.currentUserId);
        }

        // Obtener detalles del grupo para el nombre y miembros actuales
        this.chatService.getGroups().subscribe(groups => {
          const group = groups.find(g => g._id === this.groupId);
          if (group) {
            this.groupName = group.name;
            this.currentMemberIds = group.memberIds || [];
          }
        });
      }
    });
  }

  loadMessages() {
    this.msgSub = this.chatService.getMessages(this.groupId).subscribe((msgs: any[]) => {
      this.messages = msgs;
    });
  }

  async openInviteModal() {
    const modal = await this.modalCtrl.create({
      component: InviteUserComponent,
      componentProps: {
        groupId: this.groupId,
        currentMemberIds: this.currentMemberIds
      },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    });
    
    await modal.present();
  }

  async openGroupInfo() {
    this.popoverCtrl.dismiss();
    this.router.navigate(['/group-info', this.groupId]);
  }

  async openManageMembers() {
    this.popoverCtrl.dismiss();
    const modal = await this.modalCtrl.create({
      component: ManageMembersComponent,
      componentProps: {
        groupId: this.groupId,
        currentMemberIds: this.currentMemberIds
      },
      breakpoints: [0, 0.5, 0.9],
      initialBreakpoint: 0.9
    });
    await modal.present();
  }

  async onMessageContextMenu(event: Event, msg: any) {
    event.preventDefault(); // Prevenir menu nativo
    const isMine = msg.sent_by._id === this.currentUserId;
    const isProfessor = this.userRole === 'professor';

    const buttons = [];

    // Editar (solo si es mio)
    if (isMine) {
      buttons.push({
        text: 'Editar',
        icon: 'pencil',
        handler: () => {
          this.promptEditMessage(msg);
        }
      });
    }

    // Eliminar (si es mio o si soy profesor)
    if (isMine || isProfessor) {
      buttons.push({
        text: 'Eliminar',
        icon: 'trash',
        role: 'destructive',
        handler: () => {
          this.chatService.deleteMessage(this.groupId, msg._id);
        }
      });
    }

    if (buttons.length === 0) return; // No hay acciones permitidas

    buttons.push({
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones de mensaje',
      buttons: buttons,
      cssClass: 'custom-action-sheet'
    });

    await actionSheet.present();
  }

  async promptEditMessage(msg: any) {
    const alert = await this.alertCtrl.create({
      header: 'Editar mensaje',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'newText',
          type: 'text',
          value: msg.description,
          placeholder: 'Escribe tu nuevo mensaje...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.newText && data.newText.trim() !== '') {
              this.chatService.editMessage(this.groupId, msg._id, data.newText.trim());
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async sendMessage() {
    if (!this.newMessage.trim() || !this.groupId) return;
    
    try {
      await this.chatService.sendMessage(this.groupId, this.newMessage);
      this.newMessage = '';
      // Scroll bottom automatically handled by simple CSS or view child
    } catch (error) {
      console.error('Error enviando mensaje', error);
    }
  }

  goBack() {
    this.router.navigate(['/tabs/chats']);
  }

  ngOnDestroy() {
    if (this.msgSub) this.msgSub.unsubscribe();
  }
}
