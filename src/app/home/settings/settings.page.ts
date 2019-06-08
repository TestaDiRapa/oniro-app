import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userService.service';
import { Paziente } from '../../register/paziente.model';
import { MenuController } from '@ionic/angular';
import { Medico } from '../../register/medico.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public user: Paziente | Medico;
  public isUser: boolean;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    this.user = this.userService.getUser();
    this.isUser = this.authService.getUserType();
    this.menuCtrl.toggle();
  }

  onLabelModify(type: string) {

  }

}
