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
// tslint:disable-next-line: no-unused-expression
        console.log(resData['results']);
        this.pazienti = resData['results'];
        //this.filterRequests(resData['results']);
// tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.pazienti.length; i++) {
          if (resData['results'][i].type === 'registered') {
            this.pazienti.splice(i, 1);
          }
        }
        this.n_req = this.pazienti.length;

      });
    });
  }







}
