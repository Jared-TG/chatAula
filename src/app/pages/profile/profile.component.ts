import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonAvatar,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import {
  powerOutline,
  mail,
  shieldCheckmark,
  cubeOutline,
  personCircleOutline,
  logOutOutline
} from 'ionicons/icons';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonAvatar,
    IonSpinner,
  ],
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user: User | null = null;
  isGoogleUser = false;
  isLoggingOut = false;

  constructor() {
    addIcons({
      powerOutline,
      mail,
      shieldCheckmark,
      cubeOutline,
      personCircleOutline,
      logOutOutline
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      if (user) {
        // Check provider
        const googleProvider = user.providerData.find(
          (p) => p.providerId === 'google.com'
        );
        this.isGoogleUser = !!googleProvider;
      }
    });
  }

  async logout() {
    this.isLoggingOut = true;
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
