/**
 * This page represents the list of all the patients registered to the doctor. Thanks to this view
 * it is possible to see the diary page of all the patients.
 */
import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctorService.service';
import { Network } from '@ionic-native/network/ngx';

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
    private alertCtrl: AlertController,
    private doctorService: DoctorService,
    private menuCtrl: MenuController,
    private network: Network,
    private router: Router
  ) { }

  /**
   * This method is called when the page is created.
   * It allows to visualize all the subscribed patients.
   */
  ngOnInit() {
    this.menuCtrl.close();
    this.findPatients();
  }

  /**
   * Checks the internet connection
   */
  ionViewWillEnter() {
    if (this.network.type === this.network.Connection.NONE) {
      this.alertCtrl.create({
        header: 'Error',
        message: 'È necessaria una connessione a internet per accedere a questa funzione',
        buttons: [{
          text: 'Ok',
          handler: () => { this.router.navigate(['/homedoc']); }
        }]
      }).then(alert => { alert.present(); });
    }
  }

  /**
   * This method allows to find all the subscripted patients, thanks to DoctorService.
   * All the patients are retrieved, but only the registered patients are shown.
   */
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

  /**
   * This method allows to the doctor to see the diary page of the patient.
   * @param cf The cf of the patient used to show his information.
   */
  showPatientDiary(cf: string) {
    this.router.navigate(['/homedoc/lista-diario-pazienti/pazienti/', cf]);
  }

}
