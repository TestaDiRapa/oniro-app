/**
 * This is the main page of the doctor application. In this view the doctor can see all the alerts
 * sent by the linked patients. The doctor can also navigate thanks to the side menu bar.
 */
import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctorService.service';
import { ControllerService } from '../services/controllerService.service';
import { Router } from '@angular/router';
import { ChartsService } from '../services/charts.service';

@Component({
  selector: 'app-homedoc',
  templateUrl: './homedoc.page.html',
  styleUrls: ['./homedoc.page.scss'],
})
export class HomedocPage implements OnInit {
  public alerts: any[];
  public n_req: number;

  constructor(
    private charts: ChartsService,
    private controllerService: ControllerService,
    private docService: DoctorService,
    private router: Router
  ) { }

  ngOnInit() { }

  /**
   * This method is called every time the doctor enters in this page.
   * It allows to retrieve from the server all the alerts sent by the patients thanks to DoctorService.
   */
  ionViewWillEnter() {
    this.controllerService.onCreateLoadingCtrl();
    this.docService.getMessagePatient().then(succes => {
      succes.subscribe(resData => {
        this.alerts = resData['signals'];
        this.n_req = this.alerts.length;
      });
    });
    this.controllerService.onDismissLoaderCtrl();
  }

  /**
   * This method allows the doctor to see the details about the alert message of the patient.
   * He can navigate to the "lista-diario-pazienti/pazienti" view thanks to the Router. In this view
   * there are all the information recorder during the night that date.
   * 
   * @param cf The cf of the patient that sent the request.
   * @param date The date corresponding to the request.
   */
  onClickAlert(cf: string, date: string) {
    this.controllerService.onCreateLoadingCtrl();
    this.docService.deleteMessagePatient(date, cf).then(success => {
      success.subscribe(resData => {
        if (resData.status !== 'ok') {
          this.controllerService.createAlertCtrl('Error!', resData.message);;
        } else {
          this.charts.cf = cf;
          this.charts.dataId = date;
          this.router.navigate(['/homedoc/lista-diario-pazienti/pazienti/', cf, date]);
        }
      });
    });
  }

}

