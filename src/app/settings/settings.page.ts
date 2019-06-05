import { Component, OnInit } from '@angular/core';
import { PazienteService } from '../services/pazienteService.service';
import { Paziente } from '../register/paziente.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  private paziente:Paziente;
  constructor(private pazienteService:PazienteService) {}

  ngOnInit() {
this.paziente = this.pazienteService.getPaziente();
  }

}
