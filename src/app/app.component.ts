import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnDestroy, OnInit {
  public isUser: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menu: MenuController ,
    private authService: AuthenticationService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.isUser = this.authService.getUserType();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  onLogout() {
        this.router.navigateByUrl('/authentication');
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

  ngOnDestroy(){
    console.log(this,'onDestroy');
  }
}
