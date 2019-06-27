/**
 * This is the page that represents all the requests of the patients. Here the doctor can see all the
 * subscription requests of the patients. He can choose if accept or reject the requests.
 */
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

  /**
   * This method is called every time the page is loaded. Thanks to DoctorService it is possible
   * to retrieve all the subscription requests from the server
   */
  ionViewWillEnter() {
    this.controllerService.onCreateLoadingCtrl();
    this.docService.getPatientRequests().then(succes => {
      succes.subscribe(resData => {
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

  /**
   * This method allows to the doctor to accept a subscription, thanks to DoctorService.
   * 
   * @param cf The cf of the patient that asks for a subscription
   */
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

  /** 
   * This method allows to the doctor to rejcet a subscription, thanks to DoctorService.
   * 
   * @param cf The cf of the patient that asks for a subscription
   */
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
