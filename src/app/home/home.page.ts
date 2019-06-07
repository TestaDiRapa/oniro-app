import { Component, OnInit, OnDestroy } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { UserService } from '../services/userService.service';
import { Medico } from '../register/medico.model';
import { ModalController } from '@ionic/angular';
import { AddAbitudiniComponent } from './add-abitudini/add-abitudini.component';
import { Bevanda } from './add-abitudini/bevanda.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public currentDate = '';
  public currentTime = '';
  private bevanda: string;
  private isCena: boolean;
  private caffe = new Bevanda('', 0);
  private drink = new Bevanda('', 0);

  constructor(private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.formatDate();
  }
  ngOnDestroy(){
    console.log('onDestroy');
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

  onToggleChange(togValue: boolean) {
    this.isCena = togValue;
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
      if(selectedBevanda === 'drink'){
      this.drink.setTipo(selectedBevanda);
      this.drink.setTotale(resData.data);
    } else {
      this.caffe.setTipo(selectedBevanda);
      this.drink.setTotale(resData.data);
    }
    });
  }



}
