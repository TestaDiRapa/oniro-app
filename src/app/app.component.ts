import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication/authentication.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnDestroy, OnInit {
  public isUser: boolean;

  constructor(
    private auth: AuthenticationService,
    private background: BackgroundMode,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menu: MenuController,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.auth.type.subscribe(type => {
      this.isUser = type;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.background.enable();
    });
  }

  onLogout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
    this.menu.enable(false);
  }

  onClickSettings() {
    this.router.navigateByUrl('/home/settings');
  }

  onClickRequests() {
    this.router.navigateByUrl('/homedoc/richieste-pazienti');
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

  ngOnDestroy() {
    console.log(this, 'onDestroy');
  }
}
