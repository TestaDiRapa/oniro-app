/** This module represent the business logic behind the authentication page.
 * This component can check if the user has made the login to the app in order to
 * allow the user to not put again login credentials.
 *
 */
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { ControllerService } from '../services/controllerService.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {

  constructor(
    private auth: AuthenticationService,
    private controllerService: ControllerService,
    private router: Router
  ) { }
/**
 * This method checks if the login has been made in order to navigate to the correct page.
 */
  ngOnInit() {
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
