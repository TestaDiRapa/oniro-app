import { Component, OnInit } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AuthenticationService, Person } from './services/authentication/authentication.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { UselessService } from './services/useless.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public isUser: boolean;
  public identity: Person;

  constructor(
    private authService: AuthenticationService,
    private background: BackgroundMode,
    private facts: UselessService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menu: MenuController,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.facts.init();
    this.authService.user.subscribe(person => {
      this.identity = person;
    })
    this.authService.type.subscribe(type => {
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
    this.authService.logout();
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

}
