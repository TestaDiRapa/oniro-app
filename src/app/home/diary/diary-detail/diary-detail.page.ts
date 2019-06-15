import { Component, OnInit } from '@angular/core';
import { ChartsService } from 'src/app/services/charts.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/userService.service';
import { ControllerService } from 'src/app/services/controllerService.service';

export interface Aggregate {
  apnea_events: number;
  avg_duration: number;
  sleep_duration: number;
  avg_hr: number;
  avg_spo2: number;
  hr_spectra: Spectra;
  plot_apnea_events: ApneaEvent[];
  plot_hr: number[];
  plot_movements: number[];
  plot_spo2: number[];
  spo2_spectra: Spectra;
  total_movements: number;
}

export interface Spectra {
  frequencies: number[];
  spectral_density: number[];
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
  currentDate: string;

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
    private authService: AuthenticationService,
    private chartsService: ChartsService,
    private controllerService: ControllerService,
    private userService: UserService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.currentDate = this.chartsService.currentDate;
    console.log('data evento: ' + this.currentDate);
    this.controllerService.onCreateLoadingCtrl();
    this.chartsService.data.then(response => {
      console.log(response);
      if (response['status'] === 'ok') {
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
        this.prepareLineChart('hr_spectra');
        this.charts.push({
          title: 'Densità spettrale di potenza del segnale Heart Rate',
          type: 'LineChart',
          data: this.aggregateData,
          roles: [],
          options: {
            legend: 'none',
            pieHole: 0.55,
            width: 'auto',
            height: 'auto',
           },
        });

        this.prepareLineChart('spo2_spectra');
        this.charts.push({
          title: 'Densità spettrale di potenza del segnale SPO2',
          type: 'LineChart',
          data: this.aggregateData,
          roles: [],
          options: {
            legend: 'none',
            pieHole: 0.55,
            width: 'auto',
            height: 'auto',
           },
        });

        this.prepareLineChartPlot('plot_spo2');
        this.charts.push({
          title: 'Plot SPO2',
          type: 'LineChart',
          data: this.aggregateData,
          roles: [],
          options: {
            legend: 'none',
            pieHole: 0.55,
            width: 'auto',
            height: 'auto',
           },
        });
        this.prepareHistogram('plot_movements');
        this.charts.push({
          title: 'Movimenti',
          type: 'Histogram',
          data: this.aggregateData,
          columnNames: ['Movimenti', 'Ora'],
          roles: [],
          options: {
            legend: 'none',
            pieHole: 0.55,
            width: 'auto',
            height: 'auto',
           },
        });


        // QUESTA ISTRUZIONE DEVE RIMANERE ALLA FINE
        this.controllerService.onDismissLoaderCtrl();
        this.isLoaded = true;
      } else {
        this.authService.getUserType().then(isUser => {
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
            }).then(alert => { alert.present(); });
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
            }).then(alert => { alert.present(); });
          }
        });
      }
    });
  }

  prepareLineChart(spectra: string) {
    this.aggregateData = [];
    for (let x = 0; x < this.aggregate[spectra]['frequencies'].length; x++) {
      this.aggregateData.push([this.aggregate[spectra]['frequencies'][x],
      this.aggregate[spectra]['spectral_density'][x]]);
    }
  }

  prepareLineChartPlot(spectra: string) {
    this.aggregateData = [];
    for (let x = 0; x < this.aggregate[spectra].length; x++) {
      this.aggregateData.push([x, this.aggregate[spectra][x]]);
    }
  }

  prepareHistogram(histogram: string) {
    this.aggregateData = [];
    for (let x = 0; x < this.aggregate[histogram].length; x++) {
      this.aggregateData.push([x, this.aggregate[histogram][x]]);
    }
    console.log("YOOOOO",this.aggregateData);
  }


  ngOnInit() {
  }

  // DA FINIRE
  onSendRecToDoctor() {
    this.userService.sendRecordings('', '').then(success => {
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
