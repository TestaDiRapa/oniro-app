import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-lista-diario-pazienti',
  templateUrl: './lista-diario-pazienti.page.html',
  styleUrls: ['./lista-diario-pazienti.page.scss'],
})
export class ListaDiarioPazientiPage implements OnInit {
patients: any [];
  constructor(private userService: UserService, private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.toggle();
  this.findPatients();
  }
private findPatients() {
this.userService.getMyPatients().then(res =>{
this.patients = res['payload'];
console.log(res);
});
}
}
