/** This module represent the business logic behind the authentication page.
 * This component can check if the user has made the login to the app in order to
 * allow the user to not put again login credentials.
 *
 */
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { ControllerService } from '../services/controllerService.service';
import { Network } from '@ionic-native/network/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {
  private buttonsDisabled = false;

  constructor(
    private alertCtrl: AlertController,
    private auth: AuthenticationService,
    private controllerService: ControllerService,
    private network: Network,
    private router: Router
  ) { }
  /**
   * This method checks if the login has been made in order to navigate to the correct page.
   */
  ngOnInit() {
    this.network.onConnect().subscribe(() => {
      this.buttonsDisabled = false;
    });
    this.network.onDisconnect().subscribe(() => {
      this.buttonsDisabled = true;
    })
    this.controllerService.onCreateLoadingCtrl();
    this.auth.autologin().then(response => {
      this.controllerService.onDismissLoaderCtrl();
      if (response) { //check if the login has been made
        this.auth.getUserType().then(isUser => {
          if (isUser) { //check if the user is a patient or a doctor
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/homedoc']);
          }
        });
      } else {
        if (this.network.type === this.network.Connection.NONE) {
          this.alertCtrl.create({
            header: 'Errore',
            message: 'Non sei connesso a internet! Riprova più tardi',
            buttons: [{
              text: 'Ok'
            }]
          }).then(alert => { alert.present(); });
          this.buttonsDisabled = true;
        } else {
          this.buttonsDisabled = false;
        }
      }
    });
  }
  /**
   * This method is used to make a personalised animation while the user waits
   */
  ionViewWillEnter() {
    this.controllerService.onCreateLoadingCtrl();
    this.auth.autologin().then(() => {
      this.controllerService.onDismissLoaderCtrl();
    });
  }

}
