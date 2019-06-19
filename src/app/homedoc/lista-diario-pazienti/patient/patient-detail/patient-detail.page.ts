import { Component, OnInit } from '@angular/core';
import { ChartsService, Aggregate, ApneaEvent } from 'src/app/services/charts.service';
import { Bevanda } from 'src/app/home/add-abitudini/bevanda.model';
import { ControllerService } from 'src/app/services/controllerService.service';
import { AlertController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

import 'hammerjs';
import { ApneaPopoverComponent } from './apnea-popover/apnea-popover.component';


@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.page.html',
  styleUrls: ['./patient-detail.page.scss'],
})
export class PatientDetailPage implements OnInit {
  cf: string;
  date: string;

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
    private popoverCtrl: PopoverController,
    private router: Router
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    if(!this.chartsService.dataId) {
      this.router.navigate(['/homedoc']);
    }
    this.cf = this.chartsService.cf;
    this.date = this.chartsService.dataId.toString().substr(0, 10);
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
                  this.router.navigate(['/home']);
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

  onPress(events: ApneaEvent[]) {
    this.popoverCtrl.create({
      component: ApneaPopoverComponent,
      componentProps: {
        events: events
      }
    }).then(popover => {
      popover.present();
    })
  }

  onRelease() {
    this.popoverCtrl.dismiss();
  }
}
