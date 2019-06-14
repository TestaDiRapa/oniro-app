import { Component, OnInit, OnDestroy } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { UserService } from '../services/userService.service';
import { Medico } from '../register/medico.model';
import { ModalController, AlertController } from '@ionic/angular';
import { AddAbitudiniComponent } from './add-abitudini/add-abitudini.component';
import { Bevanda } from './add-abitudini/bevanda.model';
import { Abitudini } from './add-abitudini/abitudini.model';
import { Router } from '@angular/router';

import { LoaderService } from '../services/loader-service.service';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { DataStoringService } from '../services/bluetooth/data-storage/data-storing.service';
import { UselessService } from '../services/useless.service';


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
  public fact = "";

  constructor(
    private alertCtrl: AlertController,
    private dataMngr: DataStoringService,
    private facts: UselessService,
    private loadingController: LoaderService,
    private modalCtrl: ModalController,
    private network: Network,
    private router: Router,
    private storage: Storage,
    private user: UserService
  ) {
  }

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

  ngOnDestroy() {
    console.log('onDestroy');
  }

  ionViewWillEnter() {
    this.facts.newFact();
    this.currentDate = new Date();
  }

  ionViewDidEnter() {
    this.currentDate = new Date();
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
      componentProps: { bevanda: this.bevanda }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resData => {
      if (selectedBevanda === 'drink') {
        this.drink.setTipo(selectedBevanda);
        this.drink.setTotale(resData.data);
      } else {
        this.caffe.setTipo(selectedBevanda);
        this.caffe.setTotale(resData.data);
      }
    });
  }

  onStartMonitoring() {
    const abitudine = new Abitudini(this.caffe, this.drink, this.isSport, this.isCena);
    this.loadingController.onCreate();
    this.user.putMyHabits(abitudine).then(observable => {
      observable.subscribe(
        response => {
          if (response.status === 'ok') {
            this.loadingController.onDismiss();
            this.router.navigate(['/home/record']);
          } else {
            this.loadingController.onDismiss();
            this.alertCtrl.create({
              header: 'Si è verificato un errore!',
              message: response.message,
              buttons: [
                {
                  text: 'Ok'
                }
              ]
            }).then(alertEl => {
              alertEl.present();
            });
          }
        },
        error => {
          this.loadingController.onDismiss();
          this.alertCtrl.create({
            header: 'Si è verificato un errore!',
            message: error.message,
            buttons: [
              {
                text: 'Ok!'
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });
        });
    });
  }

}
