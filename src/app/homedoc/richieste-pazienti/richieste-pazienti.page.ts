import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DoctorService } from 'src/app/services/doctorService.service';
import { ControllerService } from 'src/app/services/controllerService.service';


@Component({
  selector: 'app-richieste-pazienti',
  templateUrl: './richieste-pazienti.page.html',
  styleUrls: ['./richieste-pazienti.page.scss'],
})
export class RichiestePazientiPage implements OnInit {
  public pazienti: any[];
  public n_req: number;

  constructor(
    private menuCtrl: MenuController,
    private docService: DoctorService,
    private controllerService: ControllerService
  ) { }

  ngOnInit() {
    this.menuCtrl.toggle();
  }

  ionViewWillEnter() {
    this.controllerService.onCreateLoadingCtrl();
    this.docService.getPatientRequests().then(succes => {
      succes.subscribe(resData => {
        console.log(resData);
        for (let i = 0; i < resData['results'].length; i++) {
          if (resData['results'][i].type === 'registered') {
            resData['results'].splice(i, 1);
            i = i - 1;
          }
        }
        this.pazienti = resData['results'];
        this.n_req = this.pazienti.length;
      });
    });
    this.controllerService.onDismissLoaderCtrl();
  }

  accept(cf: string) {
    const params = '{"user_cf":' + '"' + cf + '"' + '}';
    this.controllerService.onCreateLoadingCtrl();
    this.docService.acceptPatient(params).then(success => {
      success.subscribe(resData => {
        if (resData.status !== 'ok') {
          this.controllerService.createAlertCtrl('Error', resData.message);
        } else {
          this.controllerService.createAlertCtrl('Success', 'Paziente accettato');
          this.ionViewWillEnter();
        }
      });
    });
  }

  reject(cf: string) {
    this.controllerService.onCreateLoadingCtrl();
    this.docService.rejectPatient(cf).then(success => {
      success.subscribe(resData => {
        if (resData.status !== 'ok') {
          this.controllerService.createAlertCtrl('Error', resData.message);
        } else {
          this.controllerService.createAlertCtrl('Success', 'Paziente rifiutato');
          this.ionViewWillEnter();
        }
      });
    });
  }


}
