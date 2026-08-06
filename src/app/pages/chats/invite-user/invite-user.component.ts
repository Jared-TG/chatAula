import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonButton, 
  IonIcon,
  IonSearchbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonBadge,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, personAddOutline, checkmarkCircle } from 'ionicons/icons';
import { AuthService } from '../../../services/auth.service';
import { ChatService } from '../../../services/chat.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrl: './invite-user.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButtons, 
    IonButton, 
    IonIcon,
    IonSearchbar,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonBadge
  ]
})
export class InviteUserComponent implements OnInit {
  @Input() groupId!: string;
  @Input() currentMemberIds: string[] = [];

  private modalCtrl = inject(ModalController);
  private authService = inject(AuthService);
  private chatService = inject(ChatService);

  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm = '';
  currentUserId: string = '';
  isInviting: { [key: string]: boolean } = {};

  constructor() {
    addIcons({ closeOutline, personAddOutline, checkmarkCircle });
  }

  ngOnInit() {
    const user = this.authService.currentUser;
    if (user) {
      this.currentUserId = user.uid;
    }

    this.authService.getAllUsers().subscribe(allUsers => {
      // Excluir al usuario actual de la lista
      this.users = allUsers.filter(u => u.uid !== this.currentUserId);
      this.filteredUsers = [...this.users];
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  searchUsers(event: any) {
    const term = event.target.value.toLowerCase();
    this.searchTerm = term;
    
    if (!term) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(user => 
      (user.username && user.username.toLowerCase().includes(term)) || 
      (user.email && user.email.toLowerCase().includes(term))
    );
  }

  isMember(userId: string): boolean {
    return this.currentMemberIds.includes(userId);
  }

  async invite(userId: string) {
    if (this.isMember(userId)) return;

    this.isInviting[userId] = true;
    try {
      await this.chatService.inviteUser(this.groupId, userId);
      // Añadir localmente para actualizar la UI rápido
      this.currentMemberIds.push(userId);
    } catch (error) {
      console.error('Error al invitar usuario:', error);
    } finally {
      this.isInviting[userId] = false;
    }
  }
}
