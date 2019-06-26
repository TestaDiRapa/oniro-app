/**
 * This component manage the homepage of the patient
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/userService.service';
import { ModalController, AlertController } from '@ionic/angular';
import { AddAbitudiniComponent } from './add-abitudini/add-abitudini.component';
import { Bevanda } from './add-abitudini/bevanda.model';
import { Abitudini } from './add-abitudini/abitudini.model';
import { Router } from '@angular/router';

import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { DataStoringService } from '../services/bluetooth/data-storage/data-storing.service';
import { UselessService } from '../services/useless.service';
import { ControllerService } from '../services/controllerService.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public currentDate: Date;
  public isValid = false;
  private bevanda: string;
  private isCena = false;
  private isSport = false;
  public caffe = new Bevanda('', 0);
  public drink = new Bevanda('', 0);
  public fact = '';

  constructor(
    private dataMngr: DataStoringService,
    private facts: UselessService,
    private controllerService: ControllerService,
    private modalCtrl: ModalController,
    private network: Network,
    private router: Router,
    private storage: Storage,
    private user: UserService
  ) {
  }
//at the beginning this method shows a fun fact, set the right date and send data, if they are stored
  ngOnInit() {
    this.facts.facts.subscribe(text => {
      this.fact = text;
    });
    this.currentDate = new Date();
    this.network.onConnect().subscribe(() => {
      this.storage.get('sleep_data').then(data => {
        if (data) {
          this.dataMngr.recoverAndSend();
        }
      });
    });
  }
/**
 * Update the fun fact and the date
 */
  ionViewWillEnter() {
    this.facts.newFact();
    this.currentDate = new Date();
  }

/**This method set a button to indicate that the patient has had dinner late in night.
 * 
 * @param togValue {boolean} the value of the toggle button.
 */
  onToggleCena(togValue: boolean) {
    this.isCena = togValue;
  }
/** This method set a button to indicate that the patient has done sport.
 * 
 * @param togValue {boolean} the value of the toggle button.
 */
  onToggleSport(togValue: boolean) {
    this.isSport = togValue;
  }
/**This method open the modal to indicate what kind of drink the patient has drunk
 * 
 */
  openModal(selectedBevanda: string) {
    this.bevanda = selectedBevanda;
    this.modalCtrl.create({
      component: AddAbitudiniComponent,
      componentProps: { bevanda: this.bevanda }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resData => {
      if (selectedBevanda === 'drink') {
        this.drink = resData.data;
      } else {
        this.caffe = resData.data;
      }
    });
  }
/**
 * This method send habits to the server and start monitoring the patient's sleep.
 */
  onStartMonitoring() {
    const abitudine = new Abitudini(this.caffe, this.drink, this.isSport, this.isCena);
    this.controllerService.onCreateLoadingCtrl();
    this.user.putMyHabits(abitudine).then(observable => {
      observable.subscribe(
        response => {
          if (response.status === 'ok') {
            this.controllerService.onDismissLoaderCtrl();
            this.router.navigate(['/home/record']);
          } else {
            this.controllerService.onDismissLoaderCtrl();
            this.controllerService.createAlertCtrl('Error', response.message);
          }
        },
        error => {
          this.controllerService.onDismissLoaderCtrl();
          this.controllerService.createAlertCtrl('Error', error.message);
        });
    });
  }

}
