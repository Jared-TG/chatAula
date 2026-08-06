import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
  IonPopover,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline, sendOutline, personAddOutline, ellipsisVertical, informationCircleOutline, personCircleOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { InviteUserComponent } from '../invite-user/invite-user.component';

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
export class ChatRoomComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private modalCtrl = inject(ModalController);
  private popoverCtrl = inject(PopoverController);

  groupId: string = '';
  groupName: string = 'General';
  messages: any[] = [];
  newMessage: string = '';
  currentUserId: string = '';
  currentUser: any = null;
  isGoogleUser: boolean = false;
  currentMemberIds: string[] = [];

  private msgSub!: Subscription;

  constructor() {
    addIcons({ arrowBackOutline, sendOutline, personAddOutline, ellipsisVertical, informationCircleOutline, personCircleOutline });
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.currentUserId = this.currentUser?.uid || '';
    if (this.currentUser && this.currentUser.providerData) {
      this.isGoogleUser = this.currentUser.providerData.some((p: any) => p.providerId === 'google.com');
    }
    
    this.route.paramMap.subscribe(params => {
      this.groupId = params.get('id') || '';
      if (this.groupId) {
        this.loadMessages();
        
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
    this.router.navigate(['/tabs/groups']);
  }

  ngOnDestroy() {
    if (this.msgSub) this.msgSub.unsubscribe();
  }
}
