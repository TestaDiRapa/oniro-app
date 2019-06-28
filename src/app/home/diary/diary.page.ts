/**
 * This page represents a summary of all the nights monitored.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController, PopoverController } from '@ionic/angular';
import { GoogleChartComponent } from 'angular-google-charts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService, Respons } from 'src/app/services/authentication/authentication.service';
import { ChartsService } from 'src/app/services/charts.service';
import { Router } from '@angular/router';
import { SendPopoverComponent } from './send-popover/send-popover.component';

import 'hammerjs';

export interface Data {
  _id: Date;
  preview: Preview;
}

export interface Preview {
  apnea_events: number;
  avg_hr: number;
  avg_spo2: number;
  type: string;
}

@Component({
  selector: 'app-diary',
  templateUrl: './diary.page.html',
  styleUrls: ['./diary.page.scss'],
})

export class DiaryPage implements OnInit {
  private url = 'http://' + environment.serverIp + '/user/my_recordings';
  preview: Data[] = [];

  @ViewChild('chart')
  chart: GoogleChartComponent;

  constructor(
    private authService: AuthenticationService,
    private charts: ChartsService,
    private http: HttpClient,
    private menuCtrl: MenuController,
    private popoverCtrl: PopoverController,
    private router: Router
  ) { }

  ngOnInit() { }

  /**
   * This method is called every time the page is shown. 
   * It allows to initialize the page with a summary of all the recorded nights.
   * The information are sorted according to the Date and retrieved thanks to HttpClientModule.
   */
  ionViewWillEnter() {
    this.menuCtrl.close();
    this.authService.token.then(token => {
      this.http.get<Respons>(
        this.url,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token
          })
        }
      ).subscribe(res => {
        this.preview = res['payload'];
        this.preview.sort((a: Data, b: Data) => {
          if (a._id < b._id) {
          return 1;
          }
          if (a._id === b._id) {
          return 0;
          }
          return -1;
        });
      });
    });
  }

  /**
   * This method allows the patient to view more details about the night.
   * It allows to go on diary-detail page thanks to the Router.
   * @param id The Date the patient wants to view
   */
  onclick(id: string) {
    const date = id.toString().substr(0, 10);
    this.charts.dataId = id;
    this.charts.currentDate = date;
    this.router.navigate(['/home/diary/diary-detail']);
  }

  /**
   * This method is called when the patient keeps pressed on the Date.
   * It allows the patient to see who the alert request was sent to. 
   * @param doctors The doctors who was notified by the patient.
   */
  onPress(doctors: string[]) {
    this.popoverCtrl.create({
      component: SendPopoverComponent,
      componentProps: {
        doctors: doctors
      }
    }).then(popover => {
      popover.present();
    });
  }

  /**
   * This method closes the PopOver once the Date item was released.
   */
  onRelease() {
    this.popoverCtrl.dismiss();
  }

}
