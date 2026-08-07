import { Component, HostListener, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private alertCtrl = inject(AlertController);
  private deferredPrompt: any;

  constructor() {
    this.checkIOS();
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: Event) {
    // Prevenir que aparezca el prompt nativo inmediatamente
    e.preventDefault();
    // Guardar el evento para dispararlo después
    this.deferredPrompt = e;
    
    // Mostrar nuestro modal personalizado
    this.showInstallAlert();
  }

  async showInstallAlert() {
    const hasSeenPrompt = localStorage.getItem('pwa-prompt-seen');
    if (hasSeenPrompt) return;

    const alert = await this.alertCtrl.create({
      header: '¡Instala Chat Aula!',
      message: 'Añade la aplicación a tu pantalla de inicio para una experiencia más rápida, a pantalla completa y como una app nativa.',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Más tarde',
          role: 'cancel',
          handler: () => {
            localStorage.setItem('pwa-prompt-seen', 'true');
          }
        },
        {
          text: 'Instalar',
          handler: async () => {
            if (this.deferredPrompt) {
              this.deferredPrompt.prompt();
              const { outcome } = await this.deferredPrompt.userChoice;
              console.log(`Respuesta del usuario: ${outcome}`);
              this.deferredPrompt = null;
              localStorage.setItem('pwa-prompt-seen', 'true');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Detección manual para dispositivos iOS (Safari no lanza el evento beforeinstallprompt)
  checkIOS() {
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    // Comprueba si ya está instalada en iOS
    const isInStandaloneMode = () => ('standalone' in window.navigator) && ((window.navigator as any).standalone);

    if (isIos() && !isInStandaloneMode()) {
      const hasSeenPrompt = localStorage.getItem('pwa-prompt-seen-ios');
      if (!hasSeenPrompt) {
        // Le damos un par de segundos para no asustar al usuario al entrar de golpe
        setTimeout(() => {
          this.showIosInstallAlert();
        }, 3000);
      }
    }
  }

  async showIosInstallAlert() {
    const alert = await this.alertCtrl.create({
      header: '¡Instala Chat Aula!',
      message: 'Para instalar esta aplicación en tu iPhone o iPad, pulsa el botón de <strong>Compartir</strong> en Safari y luego selecciona <strong>"Añadir a la pantalla de inicio"</strong>.',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Entendido',
          handler: () => {
            localStorage.setItem('pwa-prompt-seen-ios', 'true');
          }
        }
      ]
    });

    await alert.present();
  }
}
