import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { 
  IonContent, 
  IonInput, 
  IonButton, 
  IonIcon,
  IonSpinner,
  IonItem,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chatbubbleEllipsesOutline,
  logoGoogle,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterLink,
    IonContent, 
    IonInput, 
    IonButton, 
    IonIcon,
    IonSpinner,
    IonItem,
    IonToast
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  isGoogleLoading = false;
  showPassword = false;
  
  toastMessage = '';
  isToastOpen = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    addIcons({
      chatbubbleEllipsesOutline,
      logoGoogle,
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.loginWithEmail(email, password);
      this.router.navigate(['/tabs/chats']);
    } catch (error: any) {
      console.error('Error logging in:', error);
      this.showError('Correo o contraseña incorrectos.');
    } finally {
      this.isLoading = false;
    }
  }

  async onGoogleLogin() {
    this.isGoogleLoading = true;
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/tabs/chats']);
    } catch (error: any) {
      console.error('Error with Google Sign-In:', error);
      this.showError('Error al iniciar sesión con Google.');
    } finally {
      this.isGoogleLoading = false;
    }
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  private showError(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
  }
}
