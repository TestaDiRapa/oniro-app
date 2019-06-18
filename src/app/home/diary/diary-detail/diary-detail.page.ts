import { Component, OnInit } from '@angular/core';
import { ChartsService, Aggregate } from 'src/app/services/charts.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/userService.service';
import { ControllerService } from 'src/app/services/controllerService.service';
import { SendModalPage } from './send-modal/send-modal.page';
import { Bevanda } from '../../add-abitudini/bevanda.model';


@Component({
  selector: 'app-diary-detail',
  templateUrl: './diary-detail.page.html',
  styleUrls: ['./diary-detail.page.scss'],
})
export class DiaryDetailPage implements OnInit {

  isLoaded = false;
  currentDate: string;
  aggregate: Aggregate;
  caffe: Bevanda;
  drink: Bevanda;
  cena: string;
  sport: string;

  charts: Array<{
    title: string;
    type: string;
    data: Array<Array<string | number | {}>>;
    roles: Array<{
      type: string;
      role: string;
      index?: number;
    }>;
    columnNames?: Array<string>;
    options?: {};
  }> = [];

  constructor(
    private alertCtrl: AlertController,
    private chartsService: ChartsService,
    private controllerService: ControllerService,
    private modalCtrl: ModalController,
    private router: Router,
    private userService: UserService
  ) { }

  ionViewWillEnter() {
    if(!this.chartsService.dataId) {
      this.router.navigate(['/home/diary']);
    }
    this.currentDate = this.chartsService.currentDate;
    this.controllerService.onCreateLoadingCtrl();
    this.chartsService.aggregate.subscribe(data => { this.aggregate = data });
    this.chartsService.caffe.subscribe(data => { this.caffe = data });
    this.chartsService.cena.subscribe(data => { this.cena = data });
    this.chartsService.drink.subscribe(data => { this.drink = data });
    this.chartsService.sport.subscribe(data => { this.sport = data });
    this.chartsService.charts.then(charts => {
      this.charts = charts;
      this.controllerService.onDismissLoaderCtrl();
      if (this.charts.length === 0) {
        this.alertCtrl
          .create({
            header: 'Error',
            message: 'Si è verificato un errore',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.router.navigate(['/home/diary']);
                }
              }
            ]
          })
          .then(alert => {
            alert.present();
          });
      }
    });
    this.isLoaded = true;
  }

  ngOnInit() {
  }

  onChooseDoctor() {
    this.modalCtrl.create({
      component: SendModalPage
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(result => {
        if (result.data && result.data.hasOwnProperty('_id')) {
          this.sendRecToDoctor(result.data._id, this.chartsService.dataId);
        }
      });
    });
  }

  private sendRecToDoctor(doctorId: string, recordId: string) {
    this.userService.sendRecordings(doctorId, recordId).then(success => {
      success.subscribe(resData => {
        if (resData.message === 'ok') {
          this.alertCtrl.create({
            header: 'Success',
            message: 'Parametri inviati con successo!',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.router.navigate(['/home/diary']);
                }
              }
            ]
          }).then(alert => {
            alert.present();
          });
        } else {
          this.alertCtrl.create({
            header: 'Error',
            message: resData.message,
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.router.navigate(['/home/diary']);
                }
              }
            ]
          }).then(alert => {
            alert.present();
          });
        }
      });
    });
  }

}
