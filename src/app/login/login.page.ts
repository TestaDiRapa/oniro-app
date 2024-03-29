/**
 * This page represents the login. Here the user can choose between doctor and patient and he can
 * insert his credentials (cf or id, and password) to navigate in the home.
 */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Paziente } from '../register/paziente.model';
import { Medico } from '../register/medico.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MenuController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ControllerService } from '../services/controllerService.service';
import { Network } from '@ionic-native/network/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isUser = true;
  private username: string;
  private password: string;
  private path: string;


  constructor(
    private alertCtrl: AlertController,
    private authService: AuthenticationService,
    public controllerService: ControllerService,
    private http: HttpClient,
    private menuCtrl: MenuController,
    private network: Network,
    private router: Router
  ) { }


  ngOnInit() { }

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

  /**
   * This method is called when the form is submitted.
   * It allows to create a new token for the user or to refresh an existing one.
   * Thanks to AuthenticationService, all the user information are retrieved and stored in
   * the Paziente (or Medico) model.
   *
   * @param form The current form of the page.
   */
  onSubmit(form: NgForm) {
    if (this.network.type === this.network.Connection.NONE) {
      this.alertCtrl.create({
        header: 'Error',
        message: 'Nessuna connessione a internet, riprova più tardi',
        buttons: [{
          text: 'Ok'
        }]
      }).then(alert => { alert.present(); });
    } else {
      if (!form.valid) {
        return;
      }
      this.menuCtrl.enable(true);
      if (this.isUser) {
        this.username = form.value.cf;
      } else {
        this.username = form.value.albo;
      }
      this.password = form.value.password;
      this.controllerService.onCreateLoadingCtrl();
      this.authService.login(this.username, this.password, this.isUser).subscribe(res => {
        if (res.status === 'ok') {
          const authToken = res.access_token;
          const authExp = res.access_token_exp;
          this.authService.setAuthToken(authToken, authExp);

          const refToken = res.refresh_token;
          const refExp = res.refresh_token_exp;
          this.authService.setRefreshToken(refToken, refExp);

          this.http.get<any>(`http://${environment.serverIp}/me`, {
            headers: new HttpHeaders({ Authorization: `Bearer ${authToken}` })
          }).subscribe(response => {
            if (response.status === 'ok') {
              let imagePath = '';
              if (response.message.hasOwnProperty('profile_picture') && response.message['profile_picture']) {
                imagePath = response.message['profile_picture'];
              }
              this.authService.isAuthenticated = true;
              if (this.isUser) {
                this.authService.setUser(new Paziente(response.message['name'], response.message['surname'], null,
                  response.message['phone_number'], response.message['email'], response.message['_id'],
                  response.message['age'], imagePath));
                this.path = 'home';
              } else {
                this.authService.setUser(new Medico(response.message['name'], response.message['surname'], null,
                  response.message['phone_number'], response.message['email'], response.message['_id'],
                  response.message['address'], imagePath));
                this.path = 'homedoc';
              }
              this.controllerService.onDismissLoaderCtrl();
              this.router.navigateByUrl('/' + this.path);
            }
          });
        } else {
          this.controllerService.onDismissLoaderCtrl();
          this.controllerService.createAlertCtrl('', res.message);
        }
      });
    }
  }
}
