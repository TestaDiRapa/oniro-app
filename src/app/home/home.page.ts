import { Component, OnInit } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { PazienteService } from '../services/pazienteService.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
paziente: Paziente;

  constructor(
    public pazienteService:PazienteService
  ) {}

  ngOnInit() {
    this.paziente = this.pazienteService.getPaziente();
  }
}
