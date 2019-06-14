import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { LoaderService } from '../services/loader-service.service';
import { Router } from '@angular/router';
import { UselessService } from '../services/useless.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {

  constructor(
    private auth: AuthenticationService,
    private loader: LoaderService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log("AUTOLOGIN");
    this.loader.onCreate();
    this.auth.autologin().then(response => {
      this.loader.onDismiss();
      if(response) {
        this.auth.getUserType().then(isUser => {
          if(isUser) {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/homedoc']);
          }
        });
      }
    });
  }

}
