import { Component, OnInit } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { UserService } from '../services/userService.service';
import { Medico } from '../register/medico.model';
import { ModalController } from '@ionic/angular';
import { AddAbitudiniComponent } from './add-abitudini/add-abitudini.component';
import { Bevanda } from './add-abitudini/bevanda.model';
import { Abitudini } from './add-abitudini/abitudini.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public currentDate = '';
  public currentTime = '';
  private bevanda: string;
  private isCena: boolean;
  private isSport: boolean;
  private caffe = new Bevanda('', 0);
  private drink = new Bevanda('', 0);

  constructor(private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.formatDate();
  }

  ionViewWillEnter() {
    this.formatDate();
  }

  ionViewDidEnter() {
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

  onToggleCena(togValue: boolean) {
    this.isCena = togValue;
  }

  onToggleSport(togValue: boolean) {
    this.isSport = togValue;
  }

  openModal(selectedBevanda: string) {
    this.bevanda = selectedBevanda;
    this.modalCtrl.create({
      component: AddAbitudiniComponent,
      componentProps: {bevanda: this.bevanda}
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resData => {
      if (selectedBevanda === 'drink') {
      this.drink.setTipo(selectedBevanda);
      this.drink.setTotale(resData.data);
    } else {
      this.caffe.setTipo(selectedBevanda);
      this.drink.setTotale(resData.data);
    }
    });
  }

  onStartMonitoring() {
    const abitudine = new Abitudini(this.caffe, this.drink, this.isSport, this.isCena);
  }



}
