import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon],
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    addIcons({ logOutOutline });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
