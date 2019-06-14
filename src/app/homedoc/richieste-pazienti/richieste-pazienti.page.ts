import { MenuController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { DoctorService } from 'src/app/services/doctorService.service';


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
    private alertCtrl: AlertController,
    private loadingController: LoaderService

  ) { }

  ngOnInit() {
    this.menuCtrl.toggle();
  }

  ionViewWillEnter() {
    this.loadingController.onCreate();
    this.docService.getRequests().then(succes => {
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
    this.loadingController.onDismiss();
  }

  accept(cf: string) {
    const params = '{"user_cf":' + '"' + cf + '"' + '}';
    this.loadingController.onCreate();
    this.docService.acceptPatient(params).then(success => {
      success.subscribe(resData => {
        if (resData.status !== 'ok') {
          this.alertCtrl.create({
            subHeader: resData.message,
            buttons: ['OK']
          }).then(alert => alert.present());
        } else {
          this.alertCtrl.create({
            subHeader: 'Paziente accettato',
            buttons: ['OK']
          }).then(alert => alert.present());
          this.ionViewWillEnter();
        }
      });
    });
  }

  reject(cf: string) {
    this.loadingController.onCreate();
    this.docService.rejectPatient(cf).then(success => {
      success.subscribe(resData => {
        if (resData.status !== 'ok') {
          this.alertCtrl.create({
            subHeader: resData.message,
            buttons: ['OK']
          }).then(alert => alert.present());
        } else {
          this.alertCtrl.create({
            subHeader: 'Paziente rifiutato',
            buttons: ['OK']
          }).then(alert => alert.present());
          this.ionViewWillEnter();
        }
      });
    });
  }


}
