/**
 * This is the main class of the application.
 */
import { Component, OnInit } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AuthenticationService, Person } from './services/authentication/authentication.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { FunFactService } from './services/funfact.service';

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
    private facts: FunFactService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menu: MenuController,
  ) {
    this.initializeApp();
  }

  /**
   * This method initialize the user thanks to AuthenticationService
   */
  ngOnInit() {
    this.facts.init();
    this.authService.user.subscribe(person => {
      this.identity = person;
    });
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
  /**
   * ######################### EVENTS ON THE SIDE MENU ITEMS #########################
   * These methods allow to navigate among different pages of the App thanks to the Router.
    */
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

  onClickDiaryPatient() {
    this.router.navigateByUrl('/homedoc/lista-diario-pazienti');
  }
  //###########################################################################

}
