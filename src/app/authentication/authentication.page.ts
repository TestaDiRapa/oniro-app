import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { UselessService } from '../services/useless.service';
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

  ngOnInit() {
    console.log('AUTOLOGIN');
    this.controllerService.onCreateLoadingCtrl();
    this.auth.autologin().then(response => {
      this.controllerService.onDismissLoaderCtrl();
      if (response) {
        this.auth.getUserType().then(isUser => {
          if (isUser) {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/homedoc']);
          }
        });
      }
    });
  }

  ionViewWillEnter() {
    console.log('LOGIN');
    this.controllerService.onCreateLoadingCtrl();
    this.auth.autologin().then(response => {
      this.controllerService.onDismissLoaderCtrl();
    });
  }

}
