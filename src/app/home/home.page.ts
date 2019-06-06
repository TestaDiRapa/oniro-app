import { Component, OnInit } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { UserService } from '../services/userService.service';
import { Medico } from '../register/medico.model';
import { ModalController } from '@ionic/angular';
import { AddAbitudiniComponent } from './add-abitudini/add-abitudini.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public currentDate = '';
  public currentTime = '';
  private bevanda: string;

  constructor(private modalCtrl: ModalController) {
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

  openModal(bevanda: string){
    this.bevanda = bevanda;
    this.modalCtrl.create({component: AddAbitudiniComponent}).then(modalEl => {
      modalEl.present();
    });

  }



}
