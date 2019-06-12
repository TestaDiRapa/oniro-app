import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/userService.service';
import { Paziente } from '../register/paziente.model';
import { Medico } from '../register/medico.model';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { MenuController } from '@ionic/angular';
import { LoaderService } from '../services/loader-service.service';
import { environment } from 'src/environments/environment';

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


  constructor(private router: Router,
              private authService: AuthenticationService,
              private userService: UserService,
              private http: HttpClient,
              private menuCtrl: MenuController,
              public loadingController: LoaderService,
              private alertCtrl: AlertController) { }


  ngOnInit() {
  }

  presentAlert(mex: string) {
    const alert = this.alertCtrl.create({
      subHeader: mex,
      buttons: [{ cssClass: 'ion-alert', text: 'OK' }],
    }).then( (alert) => alert.present());
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
    this.loadingController.onCreate();
    this.authService.login(this.username, this.password, this.isUser).subscribe(res => {
      if (res.status === 'ok') {
        const token = res.access_token;
        this.authService.setToken(token);
        this.http.get<any>(`http://${environment.serverIp}/me`, {
          headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
        }).subscribe(resu => {
          this.authService.isAuthenticated = true;
          if (this.isUser) {
            this.userService.setUser(new Paziente(resu.message['name'], resu.message['surname'], null,
              resu.message['phone_number'], resu.message['email'], resu.message['_id'],
              resu.message['age'], ''));

            this.path = 'home';
          } else {
            this.userService.setUser(new Medico(resu.message['name'], resu.message['surname'], null,
              resu.message['phone_number'], resu.message['email'], resu.message['_id'], 
              resu.message['address'], ''));

            this.path = 'homedoc';
          }
          this.loadingController.onDismiss();
          this.router.navigateByUrl('/' + this.path);
        });

      } else {
        this.loadingController.onDismiss();
        this.presentAlert(res.message);
      }

    });

  }

}
