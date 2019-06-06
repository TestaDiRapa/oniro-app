import { Injectable } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { Medico } from '../register/medico.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: Paziente | Medico;

  constructor() { }

  getUser() {
    return this.user;
  }

  setUser(user: Paziente | Medico){
    this.user = user;
  }

  requestUser(cf: string){

  }

}
