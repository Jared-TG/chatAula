import { Component } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chatbubbles,
  chatbubblesOutline,
  people,
  peopleOutline,
  person,
  personOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="chats">
          <ion-icon name="chatbubbles"></ion-icon>
          <ion-label>Chats</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="groups">
          <ion-icon name="people"></ion-icon>
          <ion-label>Groups</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile">
          <ion-icon name="person"></ion-icon>
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styleUrl: './tabs.page.scss',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  constructor() {
    addIcons({
      chatbubbles,
      chatbubblesOutline,
      people,
      peopleOutline,
      person,
      personOutline,
    });
  }
}
