import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Paziente } from './paziente.model';
import { AuthenticationService } from '../services/authentication.service';
import { Medico } from './medico.model';
import { AlertController, MenuController } from '@ionic/angular';
import { UserService } from '../services/userService.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public isUser = true;
  private paziente: Paziente;
  private medico: Medico;

  constructor(private router: Router,
              private auth: AuthenticationService,
              private alertCtrl: AlertController,
              private userService: UserService,
              private menuCtrl: MenuController
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
// tslint:disable-next-line: no-string-literal
        this.paziente = new Paziente(form.value['nome'], form.value['cognome'],
// tslint:disable-next-line: no-string-literal
          form.value['password'], form.value['telefono'],
// tslint:disable-next-line: no-string-literal
          form.value['email'], form.value['cf'], form.value['eta']);
        this.auth.register(this.paziente, this.isUser).subscribe(resData => {
          if (resData.status === 'ok') {
            this.presentAlert('Registrazione effettuata con successo!');
            this.auth.isAuthenticated = true;
            this.router.navigateByUrl('/home');
          } else {
            this.presentAlert(resData.status);
          }
        });
        this.userService.setUser(this.paziente);
      } else {
// tslint:disable-next-line: no-string-literal
        const address = form.value['via'] + ' ' + form.value['civico'] + ' ' + form.value['citta'] + ' ' + form.value['provincia'];
// tslint:disable-next-line: no-string-literal
        this.medico = new Medico(form.value['nome'], form.value['cognome'],
// tslint:disable-next-line: no-string-literal
          form.value['password'], form.value['telefono'],
// tslint:disable-next-line: no-string-literal
          form.value['email'], form.value['idalbo'], address);
        this.auth.register(this.medico, this.isUser).subscribe(resData => {
          if (resData.status === 'ok') {
            this.presentAlert('Registrazione effettuata con successo!');
            this.router.navigateByUrl('/home');
          } else {
            this.presentAlert(resData.message);
          }
        });

        this.userService.setUser(this.medico);
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
