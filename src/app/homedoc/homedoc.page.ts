import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctorService.service';
import { LoaderService } from '../services/loader-service.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-homedoc',
  templateUrl: './homedoc.page.html',
  styleUrls: ['./homedoc.page.scss'],
})
export class HomedocPage implements OnInit {
  public alerts: any[];
  public n_req: number;

  constructor(
    private docService: DoctorService,
    private loadingController: LoaderService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadingController.onCreate();
    this.docService.getMessagePatient().then(succes => {
      succes.subscribe(resData => {
        console.log(resData);
        this.alerts = resData['signals'];
        this.n_req = this.alerts.length;
      });
    });
    this.loadingController.onDismiss();
  }

  onClickAlert(cf: string, date: string) {
    this.loadingController.onCreate();
    this.docService.deleteMessagePatient(date, cf).then(success => {
      success.subscribe(resData => {
        if (resData.status !== 'ok') {
          this.alertCtrl.create({
            header: resData.message,
            buttons: ['OK']
          }).then(alert => alert.present());
        }
      });
    });
  }

}

