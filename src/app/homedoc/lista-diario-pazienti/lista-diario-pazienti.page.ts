import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService.service';
import { MenuController } from '@ionic/angular';
import { observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-diario-pazienti',
  templateUrl: './lista-diario-pazienti.page.html',
  styleUrls: ['./lista-diario-pazienti.page.scss']
})
export class ListaDiarioPazientiPage implements OnInit {
  allPatients: Array<{
    name: string;
    surname: string;
    patient: string;
    type: string;
  }>;
  registeredPatients: Array<{
    name: string;
    surname: string;
    patient: string;
    type: string;
  }> = [];
  constructor(
    private userService: UserService,
    private menuCtrl: MenuController,
    private router: Router
  ) {}

  ngOnInit() {
    this.menuCtrl.close();
    this.findPatients();
  }
  private findPatients() {
    this.userService.getMyPatients().then(observable => {
      observable.subscribe(res => {
        if (res['status'] === 'ok') {
          console.log('pre', res['results']);
          this.allPatients = res['results'];
          for (let patient of this.allPatients) {
            if (patient.type === 'registered') {
              this.registeredPatients.push(patient);
            }
          }
        }
      });
    });
  }
  showPatientDiary(cf: string) {
    console.log('cliccato');
    this.router.navigate(['/homedoc/lista-diario-pazienti/pazienti/', cf]);
    console.log('dopo il salto');
  }
}
