import { Component, OnInit } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { UserService } from '../services/userService.service';
import { Medico } from '../register/medico.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public currentDate = '';
  public currentTime = '';

  constructor() {
  }

  ngOnInit() {
    this.formatDate();
  }

  formatDate() {
    const date = new Date();
    const year = date.getFullYear().toString();
    const day = date.getDay().toString();
    const month = date.getMonth().toString();
    this.currentDate = month + ' ' + day + ', ' + year;

    const hour = date.getHours().toString();
    const minute = date.getMinutes().toString();
    this.currentTime = hour + ' : ' + minute;
  }



}
