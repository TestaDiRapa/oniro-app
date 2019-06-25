/**
 * This is the page associated to the daily information of the patient about his sleep.
 * It contains all the information recorded during the night.
 */
import { Component, OnInit } from '@angular/core';
import { ChartsService, Aggregate } from 'src/app/services/charts.service';
import { Router } from '@angular/router';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { UserService } from 'src/app/services/userService.service';
import { ControllerService } from 'src/app/services/controllerService.service';
import { SendModalPage } from './send-modal/send-modal.page';
import { Bevanda } from '../../add-abitudini/bevanda.model';

import 'hammerjs';
import { ApneaEvent } from 'src/app/services/bluetooth/data-storage/apnea-event.model';
import { ApneaPopoverComponent } from './apnea-popover/apnea-popover.component';

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
    private popoverCtrl: PopoverController,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() { }

  /**
   * This method is called every time the page is shown. 
   * It allows to retrieve all the information about the data recorded during the night.
   * It also allows to plot some charts to better evaluate the events occured in the night.
   */
  ionViewWillEnter() {
    if (!this.chartsService.dataId) {
      this.router.navigate(['/home/diary']);
    }
    this.controllerService.onCreateLoadingCtrl();
    this.currentDate = this.chartsService.currentDate;
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

  /**
   * This method is called every time the patient clicks on the "Avvida il medico" button.
   * It allows to show a model in order to chose the doctor to send the request to.
   */
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

  /**
   * This method allows to send an alert to the doctor with all the information recorded in
   * the current Date.
   * 
   * @param doctorId The id of the doctor we want to alert.
   * @param recordId The id of the date we want to send to the doctor.
   */
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

  /**
   * This method is called when the patient keeps pressed the apnoea event.
   * It allows to show the PopOver with all the information of the event.
   * @param events The information about the apnoea event: duration and time.
   */
  onPress(events: ApneaEvent[]) {
    this.popoverCtrl.create({
      component: ApneaPopoverComponent,
      componentProps: {
        'events': events
      }
    }).then(popover => {
      popover.present();
    });
  }

  /**
   * This method allows to close the PopOver once it is released.
   */
  onRelease() {
    this.popoverCtrl.dismiss();
  }

}
