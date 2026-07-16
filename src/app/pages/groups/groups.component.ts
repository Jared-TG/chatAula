import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar],
})
export class GroupsComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
