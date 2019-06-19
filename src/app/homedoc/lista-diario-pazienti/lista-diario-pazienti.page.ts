import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctorService.service';

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
    private doctorService: DoctorService,
    private menuCtrl: MenuController,
    private router: Router
  ) { }

  ngOnInit() {
    this.menuCtrl.close();
    this.findPatients();
  }

  private findPatients() {
    this.doctorService.getPatientRequests().then(observable => {
      observable.subscribe(res => {
        if (res['status'] === 'ok') {
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
    this.router.navigate(['/homedoc/lista-diario-pazienti/pazienti/', cf]);
  }

}
