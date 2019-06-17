import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication/authentication.service';
import { Abitudini } from '../home/add-abitudini/abitudini.model';
import { Bevanda } from '../home/add-abitudini/bevanda.model';
import { Router } from '@angular/router';

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
  habit: Abitudini;
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
export interface Chart{
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
}
@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  private currentId: string;
  private currentCf: string = null;

  // tslint:disable-next-line: variable-name
  private _aggregate: Aggregate;
  // tslint:disable-next-line: variable-name
  _caffe: Bevanda;
  // tslint:disable-next-line: variable-name
  _drink: Bevanda;
  // tslint:disable-next-line: variable-name
  _cena: string;
  // tslint:disable-next-line: variable-name
  _sport: string;
  private currentDateToPrint: string;
  aggregateData: Array<Array<string | number | {}>> = [];
// tslint:disable-next-line: variable-name
  _charts: Chart[] = [];

  constructor(
    private auth: AuthenticationService,
    private http: HttpClient,
    private router: Router
  ) {}

  set cf(cf: string) {
    this.currentCf = cf;
  }

  get aggregate() {
    return this._aggregate;
  }
  set dataId(id: string) {
    console.log('SET');
    console.log(id);
    this.currentId = id;
    console.log(this.currentId);
  }

  get dataId() {
    return this.currentId;
  }
  get caffe() {
    return this._caffe;
  }
  get sport() {
    return this._sport;
  }
  get drink() {
    return this._drink;
  }
  get cena() {
    return this._cena;
  }
  set currentDate(date: string) {
    this.currentDateToPrint = date;
  }

  get currentDate() {
    return this.currentDateToPrint;
  }

  get data() {
    let url: string;
    if (this.currentCf) {
      url = `http://${environment.serverIp}/user/my_recordings?id=${
        this.currentId
      }&cf=${this.currentCf}`;
    } else {
      url = `http://${environment.serverIp}/user/my_recordings?id=${
        this.currentId
      }`;
    }

    return this.auth.token.then(token => {
      return this.http
        .get(url, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`
          })
        })
        .toPromise();
    });
  }

  get charts() {
  return this.data.then(response => {
      if (response['status'] === 'ok') {
        console.log('Response ', response);
        this._aggregate = {
          habit: response['payload']['habit'],
          apnea_events: response['payload']['apnea_events'],
          avg_duration: response['payload']['avg_duration'],
          sleep_duration: response['payload']['sleep_duration'],
          avg_hr: response['payload']['avg_hr'],
          avg_spo2: response['payload']['avg_spo2'],
          hr_spectra: {
            frequencies: response['payload']['hr_spectra']['frequencies'],
            spectral_density:
              response['payload']['hr_spectra']['spectral_density']
          },
          plot_apnea_events: response['payload']['plot_apnea_events'],
          plot_hr: response['payload']['plot_hr'],
          plot_movements: response['payload']['plot_movements'],
          plot_spo2: response['payload']['plot_spo2'],
          spo2_spectra: {
            frequencies: response['payload']['spo2_spectra']['frequencies'],
            spectral_density:
              response['payload']['spo2_spectra']['spectral_density']
          },
          total_movements: response['payload']['total_movements']
        };
        this.prepareHabits(this.aggregate.habit);
        this.prepareLineChart('hr_spectra');
        this._charts.push({
          title: 'Densità spettrale di potenza del segnale Heart Rate',
          type: 'LineChart',
          data: this.aggregateData,
          roles: [],
          options: {
            legend: 'none',
            pieHole: 0.55,
            width: 'auto',
            height: 'auto'
          }
        });

        this.prepareLineChart('spo2_spectra');
        this._charts.push({
          title: 'Densità spettrale di potenza del segnale SPO2',
          type: 'LineChart',
          data: this.aggregateData,
          roles: [],
          options: {
            legend: 'none',
            pieHole: 0.55,
            width: 'auto',
            height: 'auto'
          }
        });
        this.prepareLineChartPlot('plot_spo2');
        this._charts.push({
          title: 'Plot SPO2',
          type: 'LineChart',
          data: this.aggregateData,
          roles: [],
          options: {
            legend: 'none',
            pieHole: 0.55,
            width: 'auto',
            height: 'auto'
          }
        });
        this.prepareLineChartMovements('plot_movements');
        this._charts.push({
          title: 'Movimenti',
          type: 'LineChart',
          data: this.aggregateData,
          columnNames: ['Ora', 'Movimenti'],
          roles: [],
          options: {
            legend: 'none',
            pieHole: 0.55,
            width: 'auto',
            height: 'auto'
          }
        });
        return this._charts;
      }
    });
  }

  private prepareHabits(habit: Abitudini) {
    this._caffe = new Bevanda(habit['coffee']['type'], habit['coffee']['qty']);
    this._drink = new Bevanda(habit['drink']['type'], habit['drink']['qty']);
    if (habit['dinner']) {
      this._cena = 'Pesante';
    } else {
      this._cena = 'Leggero';
    }
    if (habit['sport']) {
      this._sport = 'Si';
    } else {
      this._sport = 'No';
    }
  }

  prepareLineChart(spectra: string) {
    this.aggregateData = [];
    for (let x = 0; x < this.aggregate[spectra]['frequencies'].length; x++) {
      this.aggregateData.push([
        this.aggregate[spectra]['frequencies'][x],
        this.aggregate[spectra]['spectral_density'][x]
      ]);
    }
  }

  prepareLineChartPlot(spectra: string) {
    this.aggregateData = [];
    for (let x = 0; x < this.aggregate[spectra].length; x++) {
      this.aggregateData.push([x, this.aggregate[spectra][x]]);
    }
  }

  prepareLineChartMovements(lineChart: string) {
    this.aggregateData = [];
    for (let x = 1; x <= this.aggregate[lineChart].length; x++) {
      this.aggregateData.push([x, this.aggregate[lineChart][x]]);
    }
  }
}
