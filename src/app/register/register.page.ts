import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Paziente } from './paziente.model';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Medico } from './medico.model';
import { AlertController, MenuController } from '@ionic/angular';
import { LoaderService } from '../services/loader-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public isUser = true;
  private paziente: Paziente;
  private medico: Medico;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
    public loadingController: LoaderService
  ) { }

  ngOnInit() {
  }

  presentAlert(mex: string) {
    const alert = this.alertCtrl.create({
      subHeader: mex,
      buttons: [{ cssClass: 'ion-alert', text: 'OK' }],
    }).then(alert => alert.present());
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.menuCtrl.enable(true);
      if (this.isUser) {
        this.paziente = new Paziente(form.value['nome'], form.value['cognome'],
          form.value['password'], form.value['telefono'],
          form.value['email'], form.value['cf'], form.value['eta'], '');
        this.loadingController.onCreate();
        this.authService.register(this.paziente, this.isUser).subscribe(resData => {
          if (resData.status === 'ok') {
            this.authService.isAuthenticated = true;

            const authToken = resData.access_token;
            const authExp = resData.access_token_exp;
            this.authService.setAuthToken(authToken, authExp);

            const refToken = resData.refresh_token;
            const refExp = resData.refresh_token_exp;
            this.authService.setRefreshToken(refToken, refExp);

            this.authService.setUser(this.paziente);

            this.presentAlert('Registrazione effettuata con successo!');
            this.router.navigateByUrl('/home');
          } else {
            this.presentAlert(resData.status);
          }
        });
      } else {
        const address = form.value['via'] + ' ' + form.value['civico'] + ' ' + form.value['citta'] + ' ' + form.value['provincia'];
        this.medico = new Medico(form.value['nome'], form.value['cognome'],
          form.value['password'], form.value['telefono'],
          form.value['email'], form.value['idalbo'], address, '');

        this.authService.register(this.medico, this.isUser).subscribe(resData => {
          if (resData.status === 'ok') {
            this.loadingController.onDismiss();

            const authToken = resData.access_token;
            const authExp = resData.access_token_exp;
            this.authService.setAuthToken(authToken, authExp);

            const refToken = resData.refresh_token;
            const refExp = resData.refresh_token_exp;
            this.authService.setRefreshToken(refToken, refExp);

            this.authService.setUser(this.medico);

            this.presentAlert('Registrazione effettuata con successo!');
            this.router.navigateByUrl('/homedoc');
          } else {
            this.loadingController.onDismiss();
            this.presentAlert(resData.message);
          }
        });


      }
    } else {
      this.presentAlert('Form non valido. Riprova');
    }
  }

  onChange(event: CustomEvent<SegmentChangeEventDetail>, form: NgForm) {
    if (event.detail.value === 'user') {
      this.isUser = true;
      form.reset();
    } else {
      this.isUser = false;
      form.reset();
    }
  }

}
