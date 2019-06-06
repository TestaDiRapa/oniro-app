import { Component, OnInit } from '@angular/core';
import { PazienteService } from '../services/pazienteService.service';
import { Paziente } from '../register/paziente.model';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public paziente: Paziente;
  constructor(private pazienteService: PazienteService,
              private menuCtrl: MenuController
    ) {}

  ngOnInit() {
  this.paziente = this.pazienteService.getPaziente();
  this.menuCtrl.toggle();
  }

}
