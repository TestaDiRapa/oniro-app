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
  private caffe = new Bevanda('', 0);
  private drink = new Bevanda('', 0);

  constructor(
    private modalCtrl: ModalController,
    private user: UserService,
    private alertCtrl: AlertController,
    private loadingController: LoaderService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.formatDate();
  }

  ngOnDestroy() {
    console.log('onDestroy');
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
    this.user.putMyHabits(abitudine).subscribe(
      success => {
        console.log(success);
        this.loadingController.onDismiss();
        this.router.navigate(['/home/record']);
    },
      error => {
        console.log(error);
        this.loadingController.onDismiss();
        this.alertCtrl.create({
          header: 'An error occurred!',
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
  }



}
