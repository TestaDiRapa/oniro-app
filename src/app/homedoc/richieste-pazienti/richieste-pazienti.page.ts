import { MenuController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService.service';


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
    private userService: UserService,
    private alertCtrl: AlertController,


  ) { }

  ngOnInit() {
    this.menuCtrl.toggle();
  }

  ionViewWillEnter() {
    this.userService.getRequests().then(succes => {
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
  }

  accept(cf: string) {
    const params = '{"user_cf":' + '"' + cf + '"' + '}';
    this.userService.acceptPatient(params).then(success => {
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
    this.userService.deletePatient(cf).then(success => {
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
