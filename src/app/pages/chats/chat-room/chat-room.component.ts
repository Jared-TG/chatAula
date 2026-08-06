import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
  IonAvatar
} from '@ionic/angular/standalone';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline, sendOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';

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
    IonAvatar
  ]
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);

  groupId: string = '';
  groupName: string = 'General';
  messages: any[] = [];
  newMessage: string = '';
  currentUserId: string = '';

  private msgSub!: Subscription;

  constructor() {
    addIcons({ arrowBackOutline, sendOutline });
  }

  ngOnInit() {
    this.currentUserId = this.authService.currentUser?.uid || '';
    
    this.route.paramMap.subscribe(params => {
      this.groupId = params.get('id') || '';
      if (this.groupId) {
        // En una app real, también podríamos obtener los detalles de la sala
        // para poner el título correcto en vez de 'General'
        this.loadMessages();
      }
    });
  }

  loadMessages() {
    this.msgSub = this.chatService.getMessages(this.groupId).subscribe((msgs: any[]) => {
      this.messages = msgs;
    });
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
