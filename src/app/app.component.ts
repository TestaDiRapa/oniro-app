import { Component, OnDestroy } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Paziente } from './register/paziente.model';
import { UserService } from './services/userService.service';
import { Medico } from './register/medico.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnDestroy {
  private user: Paziente | Medico;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menu: MenuController ,
    private userService: UserService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    console.log(this.user);
  }

  onLogout() {
        this.router.navigateByUrl('/authentication');
        this.menu.enable(false);
  }
  onClickSettings() {
    this.router.navigateByUrl('/home/settings');
  }
  onClickDiary() {
    this.router.navigateByUrl('/home/diary');
  }
  onClickMaps() {
    this.router.navigateByUrl('/home/gmaps');
  }
  onClickInfo() {
    this.router.navigateByUrl('/home/info');
  }
  onClickContacts() {
    this.router.navigateByUrl('/home/contacts');
  }
  ngOnDestroy(){
    console.log(this,'onDestroy');
  }
}
