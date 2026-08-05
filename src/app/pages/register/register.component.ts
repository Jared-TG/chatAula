import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
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
  personOutline,
  eyeOutline,
  eyeOffOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
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
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  isGoogleLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  
  toastMessage = '';
  isToastOpen = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    addIcons({
      chatbubbleEllipsesOutline,
      logoGoogle,
      mailOutline,
      lockClosedOutline,
      personOutline,
      eyeOutline,
      eyeOffOutline,
      shieldCheckmarkOutline
    });
  }

  // Validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') this.showPassword = !this.showPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, password, username } = this.registerForm.value;

    try {
      await this.authService.registerWithEmail(email, password, username);
      this.router.navigate(['/tabs/chats']);
    } catch (error: any) {
      console.error('Error registering:', error);
      this.showError(this.getFirebaseErrorMessage(error.code));
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

  private getFirebaseErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado.';
      case 'auth/invalid-email':
        return 'El formato del correo es inválido.';
      case 'auth/weak-password':
        return 'La contraseña es muy débil.';
      default:
        return 'Ocurrió un error al crear la cuenta.';
    }
  }
}
