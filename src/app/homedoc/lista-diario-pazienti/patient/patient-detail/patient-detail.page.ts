import { Component, OnInit } from '@angular/core';
import { ChartsService, Aggregate } from 'src/app/services/charts.service';
import { Bevanda } from 'src/app/home/add-abitudini/bevanda.model';
import { ControllerService } from 'src/app/services/controllerService.service';
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit() {  }

  ionViewWillEnter() {
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
}
