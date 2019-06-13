import { Component, OnInit } from '@angular/core';
import { ChartsService } from 'src/app/services/charts.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { AlertController } from '@ionic/angular';
import { LoaderService } from 'src/app/services/loader-service.service';

export interface Aggregate {
  apnea_events: number;
  avg_duration: number;
  sleep_duration: number;
  avg_hr: number;
  avg_spo2: number;
  hr_spectra: Spectra;
  plot_apnea_events: ApneaEvent[];
  plot_hr: number [];
  plot_movements: number [];
  plot_spo2: number [];
  spo2_spectra: Spectra;
  total_movements: number;
}

export interface Spectra {
  frequencies: number [];
  spectral_density: number [];
}

export interface ApneaEvent {
  time: string;
  duration: number;
  type: string;
}

@Component({
  selector: 'app-diary-detail',
  templateUrl: './diary-detail.page.html',
  styleUrls: ['./diary-detail.page.scss'],
})
export class DiaryDetailPage implements OnInit {

  aggregate: Aggregate;
  isLoaded = false;
  
  aggregateData: Array<Array<string | number | {}>> = [];
  charts: Array<{
    title: string;
    type: string;
    data: Array<Array<string | number | {}>>;
    roles: Array<{
      type: string;
      role: string;
      index?: number
    }>;
    columnNames?: Array<string>;
    options?: {};
  }> = [];

  constructor(
    private alertCtrl: AlertController,
    private auth: AuthenticationService,
    private chartsService: ChartsService,
    private loader: LoaderService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.loader.onCreate();
    this.chartsService.data.then(response => {
      console.log(response);
      if (response['status'] == 'ok') {
        this.aggregate = {
          apnea_events: response['payload']['apnea_events'],
          avg_duration: response['payload']['avg_duration'],
          sleep_duration: response['payload']['sleep_duration'],
          avg_hr: response['payload']['avg_hr'],
          avg_spo2: response['payload']['avg_spo2'],
          hr_spectra: {
            frequencies: response['payload']['hr_spectra']['frequencies'],
            spectral_density: response['payload']['hr_spectra']['spectral_density']
          },
          plot_apnea_events: response['payload']['plot_apnea_events'],
          plot_hr: response['payload']['plot_hr'],
          plot_movements: response['payload']['plot_movements'],
          plot_spo2: response['payload']['plot_spo2'],
          spo2_spectra: {
            frequencies: response['payload']['spo2_spectra']['frequencies'],
            spectral_density: response['payload']['spo2_spectra']['spectral_density']
          },
          total_movements: response['payload']['total_movements']
        };

        // ATTENZIONE
        // CONTINUA A LAVORARE DA QUI

        //QUESTA ISTRUZIONE DEVE RIMANERE ALLA FINE
        this.loader.onDismiss();
        this.isLoaded = true;
      } else {
        this.auth.getUserType().then(isUser => {
          if (isUser) {
            this.alertCtrl.create({
              header: 'Error',
              message: response['message'],
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.router.navigate(['/home/diary']);
                  }
                }
              ]
            }).then(alert => { alert.present() });
          } else {
            this.alertCtrl.create({
              header: 'Error',
              message: response['message'],
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.router.navigate(['/home']);
                  }
                }
              ]
            }).then(alert => { alert.present() });
          }
        })
      }
    });
  }

  ngOnInit() {
  }

}
