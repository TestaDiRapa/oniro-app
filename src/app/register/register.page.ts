/**
 * This is the view associated to the sign up behaviour. Here the user can choose between patient or
 * doctor, in order to sign up correctly. The doctor has more information, like the address, while the
 * patient can also set his age.
 */
import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Paziente } from './paziente.model';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Medico } from './medico.model';
import { MenuController } from '@ionic/angular';
import { ControllerService } from '../services/controllerService.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  public isUser = true;
  private paziente: Paziente;
  private medico: Medico;
  email: RegExp = new RegExp(
// tslint:disable-next-line: max-line-length
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  cf: RegExp = new RegExp(
// tslint:disable-next-line: max-line-length
    /^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i
  );
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private menuCtrl: MenuController,
    public controllerService: ControllerService
  ) {}

  ngOnInit() {}

  /**
   * This method is called when the form is submitted.
   * It allows the user to set all his credentials and personal details. This method distinguishes
   * between doctor or patient user, in order to register the correct information according to the
   * user type. The user is registered on the server thanks to AuthenticationService.
   * The method set also a new token for the user and its refresh token.
   *
   * @param form The submitted form on the page.
   */
  onSubmit(form: NgForm) {
    if (form.valid) {
      this.menuCtrl.enable(true);
      if (this.isUser) {
        if (this.email.test(form.value['email'])) {
          if (this.cf.test(form.value['cf'])) {
          this.paziente = new Paziente(
            form.value['nome'],
            form.value['cognome'],
            form.value['password'],
            form.value['telefono'],
            form.value['email'],
            form.value['cf'],
            form.value['eta'],
            ''
          );
          this.controllerService.onCreateLoadingCtrl();
          this.authService
            .register(this.paziente, this.isUser)
            .subscribe(resData => {
              if (resData.status === 'ok') {
                this.authService.isAuthenticated = true;

                const authToken = resData.access_token;
                const authExp = resData.access_token_exp;
                this.authService.setAuthToken(authToken, authExp);

                const refToken = resData.refresh_token;
                const refExp = resData.refresh_token_exp;
                this.authService.setRefreshToken(refToken, refExp);

                this.authService.setUser(this.paziente);

                this.controllerService.createAlertCtrl(
                  'Success',
                  'Registrazione effettuata con successo!'
                );
                this.router.navigateByUrl('/home');
              } else {
                this.controllerService.createAlertCtrl(
                  'Error',
                  resData.message
                );
              }
            });
          } else {
            this.controllerService.createAlertCtrl('Errore', 'Codice Fiscale non corretto!');
          }
        } else {
          this.controllerService.createAlertCtrl('Errore', 'E-mail non corretta!');
        }
      } else {
        if (this.email.test(form.value['email'])) {
        const address =
          form.value['via'] +
          ' ' +
          form.value['civico'] +
          ' ' +
          form.value['citta'] +
          ' ' +
          form.value['provincia'];
        this.medico = new Medico(
          form.value['nome'],
          form.value['cognome'],
          form.value['password'],
          form.value['telefono'],
          form.value['email'],
          form.value['idalbo'],
          address,
          ''
        );

        this.authService
          .register(this.medico, this.isUser)
          .subscribe(resData => {
            if (resData.status === 'ok') {
              this.controllerService.onDismissLoaderCtrl();

              const authToken = resData.access_token;
              const authExp = resData.access_token_exp;
              this.authService.setAuthToken(authToken, authExp);

              const refToken = resData.refresh_token;
              const refExp = resData.refresh_token_exp;
              this.authService.setRefreshToken(refToken, refExp);

              this.authService.setUser(this.medico);

              this.controllerService.createAlertCtrl(
                'Success',
                'Registrazione effettuata con successo!'
              );
              this.router.navigateByUrl('/homedoc');
            } else {
              this.controllerService.onDismissLoaderCtrl();
              this.controllerService.createAlertCtrl('Error', resData.message);
            }
          });
      } else {
        this.controllerService.createAlertCtrl('Errore', 'E-mail non valida!');
      }
    }
    } else {
      this.controllerService.createAlertCtrl('Error', 'Form non valido!');
    }
  }

  /**
   * This method is called every time he ion-segment value changes.
   * It allows to reset the form every time the selected value is changed.
   *
   * @param event The event linked to the ion-segment tag.
   * @param form The current form of the page.
   */
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
