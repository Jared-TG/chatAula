import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonFab, 
  IonFabButton, 
  IonIcon,
  ModalController,
  IonList,
  IonItem,
  IonLabel,
  IonNote
} from '@ionic/angular/standalone';
import { CreateGroupComponent } from './create-group/create-group.component';
import { ChatService } from '../../services/chat.service';
import { addIcons } from 'ionicons';
import { add, chatbubblesOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
  standalone: true,
  imports: [
    CommonModule, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonFab, 
    IonFabButton, 
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonNote
  ],
})
export class GroupsComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  private chatService = inject(ChatService);
  private router = inject(Router);

  groups$!: Observable<any[]>;

  constructor() {
    addIcons({ add, chatbubblesOutline });
  }

  ngOnInit() {
    this.groups$ = this.chatService.getGroups();
  }

  async openCreateGroup() {
    const modal = await this.modalCtrl.create({
      component: CreateGroupComponent
    });
    
    await modal.present();
    
    const { data } = await modal.onWillDismiss();
    if (data?.created) {
      console.log('Sala creada con éxito');
    }
  }

  openChatRoom(groupId: string) {
    this.router.navigate(['/chat-room', groupId]);
  }
}
