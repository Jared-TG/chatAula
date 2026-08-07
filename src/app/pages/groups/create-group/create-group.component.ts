import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormGroup, 
  FormControl, 
  Validators 
} from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonButtons, 
  IonIcon,
  IonItem,
  IonInput,
  IonTextarea,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  people, 
  checkmarkCircle,
  schoolOutline,
  logOutOutline,
  personCircleOutline,
  addCircleOutline
} from 'ionicons/icons';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '@angular/fire/auth';

import { Router } from '@angular/router';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    IonHeader, 
    IonToolbar, 
    IonContent, 
    IonButton, 
    IonButtons, 
    IonIcon,
  ]
})
export class CreateGroupComponent implements OnInit {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private modalCtrl = inject(ModalController);
  private router = inject(Router);

  groupForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required])
  });

  selectedType: 'colaborativo' | 'organizado' = 'colaborativo';
  isSubmitting = false;
  
  user: User | null = null;
  isGoogleUser = false;

  constructor() {
    addIcons({ 
      arrowBackOutline, 
      people, 
      checkmarkCircle,
      schoolOutline,
      logOutOutline,
      personCircleOutline,
      addCircleOutline
    });
  }

  ngOnInit() {
    this.user = this.authService.currentUser;
    this.isGoogleUser = this.user?.providerData.some(p => p.providerId === 'google.com') ?? false;
  }

  selectType(type: 'colaborativo' | 'organizado') {
    this.selectedType = type;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async createGroup() {
    if (this.groupForm.valid) {
      this.isSubmitting = true;
      try {
        const { name, description } = this.groupForm.value;
        await this.chatService.createGroup(name!, description!);
        this.modalCtrl.dismiss({ created: true });
      } catch (error) {
        console.error('Error al crear sala:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  async logout() {
    await this.authService.logout();
    this.modalCtrl.dismiss(); // Dismiss the modal first
    this.router.navigate(['/login']);
  }
}
