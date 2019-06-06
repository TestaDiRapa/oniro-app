import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Paziente } from './paziente.model';
import { AuthenticationService } from '../services/authentication.service';
import { Medico } from './medico.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public isUser = true;
  private paziente: Paziente;
  private medico: Medico;

  constructor(private router: Router, private auth: AuthenticationService, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  presentAlert(mex: string) {
    const alert = this.alertCtrl.create({
      //message: 'Submit Form',
      subHeader: mex,
      buttons: ['Ok']
    }).then(alert => alert.present());
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.isUser) {
        this.paziente = new Paziente(form.value.nome, form.value.cognome,
                                    form.value.password, form.value.telefono,
                                    form.value.email, form.value.cf, form.value.eta.toString());
        this.auth.register(this.paziente, this.isUser).subscribe(resData => {
          if (resData.status === 'ok') {
            this.presentAlert('Registrazione effettuata con successo!');
            this.router.navigateByUrl('/home');
          } else {
            this.presentAlert(resData.status);
          }
        });
      } else {
        const address = form.value.via + ' ' + form.value.civico.toString() + ' ' + form.value.citta + ' ' + form.value.provincia;
        this.medico = new Medico(form.value.nome, form.value.cognome,
                                form.value.password, form.value.telefono,
                                form.value.email, form.value.idalbo, address);
        this.auth.register(this.medico, this.isUser).subscribe(resData => {
          if (resData.status === 'ok') {
            this.presentAlert('Registrazione effettuata con successo!');
            this.router.navigateByUrl('/home');
          } else {
            this.presentAlert(resData.status);
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
