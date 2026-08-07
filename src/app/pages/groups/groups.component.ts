import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  ReactiveFormsModule, 
  FormGroup, 
  FormControl, 
  Validators 
} from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonContent, 
  IonButton, 
  IonButtons, 
  IonIcon
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
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
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
export class GroupsComponent implements OnInit {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private router = inject(Router);

  groupForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required]),
    tag: new FormControl('Académicas', [Validators.required])
  });

  selectedType: 'colaborativo' | 'organizado' = 'colaborativo';
  isSubmitting = false;
  
  user: User | null = null;
  isGoogleUser = false;
  
  availableTags = ['Académicas', 'Social', 'Urgente', 'Tareas', 'Reunión', 'Salidas'];

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
  
  selectTag(tag: string) {
    this.groupForm.controls.tag.setValue(tag);
  }

  dismiss() {
    this.router.navigate(['/tabs/chats']);
  }

  async createGroup() {
    if (this.groupForm.valid) {
      this.isSubmitting = true;
      try {
        const { name, description, tag } = this.groupForm.value;
        await this.chatService.createGroup(name!, description!, tag!);
        this.router.navigate(['/tabs/chats']);
      } catch (error) {
        console.error('Error al crear sala:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
