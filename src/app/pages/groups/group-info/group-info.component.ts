import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonBackButton, 
  IonButtons,
  IonAvatar,
  IonCard,
  IonCardContent
} from '@ionic/angular/standalone';
import { ChatService } from '../../../services/chat.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline, informationCircleOutline, calendarOutline, barChartOutline, chatbubbleOutline, mailOutline, chatbubblesOutline, statsChartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrl: './group-info.component.scss',
  standalone: true,
  imports: [
    CommonModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton, 
    IonIcon, 
    IonBackButton, 
    IonButtons,

    IonAvatar,
    IonCard,
    IonCardContent,
    DatePipe
  ]
})
export class GroupInfoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chatService = inject(ChatService);

  groupId: string = '';
  group: any = null;
  totalMessages: number = 0;
  popularity: string = 'Baja';
  
  // Imagen del banner (fondo estático según requerimiento)
  bannerImage: string = 'assets/icon/fondo.jpg';

  // Fecha convertida
  creationDate: Date | null = null;

  constructor() {
    addIcons({ arrowBackOutline, informationCircleOutline, calendarOutline, barChartOutline, chatbubbleOutline, mailOutline, chatbubblesOutline, statsChartOutline });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.groupId = params.get('id') || '';
      if (this.groupId) {
        this.loadGroupInfo();
      }
    });
  }

  loadGroupInfo() {
    // Suscribirse a los datos del grupo (esto asume que los tenemos cacheados o se carga rápido)
    this.chatService.getGroups().subscribe(groups => {
      this.group = groups.find(g => g._id === this.groupId);
      if (this.group) {
        // Manejar fecha de Firestore a Date de Javascript
        if (this.group.created_at && typeof this.group.created_at.toDate === 'function') {
          this.creationDate = this.group.created_at.toDate();
        } else if (this.group.created_at) {
          this.creationDate = new Date(this.group.created_at);
        }

        // Obtener mensajes y calcular métricas
        this.chatService.getMessages(this.groupId).subscribe(msgs => {
          this.totalMessages = msgs.length;
          
          if (this.totalMessages > 100) this.popularity = 'Alta';
          else if (this.totalMessages > 20) this.popularity = 'Media';
          else this.popularity = 'Baja';
        });
      }
    });
  }

  goBackToChat() {
    this.router.navigate(['/chat-room', this.groupId]);
  }
}
