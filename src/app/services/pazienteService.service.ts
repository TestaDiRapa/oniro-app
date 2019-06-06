import { Injectable } from '@angular/core';
import { Paziente } from '../register/paziente.model';

@Injectable({
  providedIn: 'root'
})
export class PazienteService {

  private paziente = new Paziente('Alessandro', 'Montefusco', '123456789', '123', 'a@m', 'mnt', '24');

  constructor() { }

  getPaziente() {
    return this.paziente;
  }
}
