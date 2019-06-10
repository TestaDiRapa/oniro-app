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
        this.filterRequests(resData['results']);
        this.n_req = this.pazienti.length;
        //this.pazienti = resData['results'];
        //this.n_req = this.pazienti.length;
        //this.filterRequests(this.pazienti);
      });
    });
  }

  private filterRequests(lista: any){
    console.log(lista);
    for (let i = 0; i < lista.length; i++) {
      if (lista[i]['type'] === 'request') {
        //this.pazienti.push(lista[i]);
      }
    }
  }




}
