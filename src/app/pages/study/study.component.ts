import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrl: './study.component.scss',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar],
})
export class StudyComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
