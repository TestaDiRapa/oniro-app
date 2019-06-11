import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService.service';

@Component({
  selector: 'app-richieste-pazienti',
  templateUrl: './richieste-pazienti.page.html',
  styleUrls: ['./richieste-pazienti.page.scss'],
})
export class RichiestePazientiPage implements OnInit {

  public pazienti: any[];
// tslint:disable-next-line: variable-name
  public n_req: number;

  constructor(
    private menuCtrl: MenuController,
    private userService: UserService) { }

  ngOnInit() {
    this.menuCtrl.toggle();
  }

  ionViewWillEnter() {
    this.userService.getRequests().then(succes => {
      succes.subscribe(resData => {
// tslint:disable-next-line: prefer-for-of
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

  accept() {
    console.log('accettato');
  }

  reject() {
    console.log('rifiutato');
  }







}
