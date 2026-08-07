import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonButton, 
  IonIcon,
  IonAvatar,
  IonButtons,
  ModalController,
  AlertController,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, personRemoveOutline } from 'ionicons/icons';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-manage-members',
  templateUrl: './manage-members.component.html',
  styleUrls: ['./manage-members.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonAvatar,
    IonButtons,
    IonSpinner
  ]
})
export class ManageMembersComponent implements OnInit {
  @Input() groupId!: string;
  @Input() currentMemberIds: string[] = [];

  private firestore = inject(Firestore);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);

  currentUserId: string = '';
  members: any[] = [];
  isLoading = false;

  constructor() {
    addIcons({ closeOutline, personRemoveOutline });
  }

  ngOnInit() {
    this.currentUserId = this.authService.currentUser?.uid || '';
    this.loadMembers();
  }

  async loadMembers() {
    this.isLoading = true;
    try {
      const usersRef = collection(this.firestore, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const allUsers = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }));

      // Solo los usuarios que están en currentMemberIds
      this.members = allUsers.filter(user => this.currentMemberIds.includes(user.uid));
    } catch (error) {
      console.error('Error al cargar miembros', error);
    } finally {
      this.isLoading = false;
    }
  }

  async confirmKick(member: any) {
    const alert = await this.alertCtrl.create({
      header: 'Expulsar usuario',
      cssClass: 'custom-alert',
      message: `¿Estás seguro de que deseas expulsar a ${member.username || member.email} de la sala?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Expulsar',
          role: 'destructive',
          handler: () => {
            this.kickUser(member.uid);
          }
        }
      ]
    });
    await alert.present();
  }

  async kickUser(userId: string) {
    try {
      await this.chatService.kickUser(this.groupId, userId);
      // Actualizar vista
      this.members = this.members.filter(m => m.uid !== userId);
    } catch (error) {
      console.error('Error al expulsar usuario', error);
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
