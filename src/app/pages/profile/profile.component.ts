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
  logOutOutline,
  schoolOutline,
  
} from 'ionicons/icons';
import { User } from '@angular/fire/auth';
import { doc, getDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';

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
  private firestore = inject(Firestore);

  user: User | null = null;
  userRole: string = 'student';
  isGoogleUser = false;
  isLoggingOut = false;
  isChangingRole = false;

  constructor() {
    addIcons({
      powerOutline,
      mail,
      shieldCheckmark,
      cubeOutline,
      personCircleOutline,
      logOutOutline,
      schoolOutline,
      
    });
  }

  async ngOnInit(): Promise<void> {
    this.authService.currentUser$.subscribe(async (user) => {
      this.user = user;
      if (user) {
        // Check provider
        const googleProvider = user.providerData.find(
          (p) => p.providerId === 'google.com'
        );
        this.isGoogleUser = !!googleProvider;

        // Fetch current role from Firestore
        try {
          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            this.userRole = data['role'] || 'student';
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    });
  }

  async changeRoleToProfessor() {
    if (!this.user) return;

    this.isChangingRole = true;
    
    // Artificial delay of 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
      await this.authService.updateUserRole(this.user.uid, 'professor');
      this.userRole = 'professor';
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      this.isChangingRole = false;
    }
  }

  async logout() {
    this.isLoggingOut = true;
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
