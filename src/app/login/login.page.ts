import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Paziente } from '../register/paziente.model';
import { Medico } from '../register/medico.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MenuController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ControllerService } from '../services/controllerService.service';


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
    private router: Router,
    private authService: AuthenticationService,
    private http: HttpClient,
    private menuCtrl: MenuController,
    public controllerService: ControllerService,
    private alertCtrl: AlertController,
  ) { }


  ngOnInit() {
  }

  presentAlert(mex: string) {
    const alert = this.alertCtrl.create({
      subHeader: mex,
      buttons: [{ cssClass: 'ion-alert', text: 'OK' }],
    }).then((alert) => alert.present());
  }



  // check if the ion-segment value is changed or not
  onChange(event: CustomEvent<SegmentChangeEventDetail>, form: NgForm) {
    if (event.detail.value === 'user') {
      this.isUser = true;
      form.reset();
    } else {
      this.isUser = false;
      form.reset();
    }
  }

  // the event called on form submission
  onSubmit(form: NgForm) {
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
        this.presentAlert(res.message);
      }
    });
  }

}
