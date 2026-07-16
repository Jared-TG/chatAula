import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar],
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
