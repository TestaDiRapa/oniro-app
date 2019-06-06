import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/userService.service';
import { Paziente } from '../register/paziente.model';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Medico } from '../register/medico.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public paziente: Paziente | Medico;
  constructor(private userService: UserService,
              private menuCtrl: MenuController
    ) {}

  ngOnInit() {
  this.paziente = this.userService.getUser();
  this.menuCtrl.toggle();
  }

}
