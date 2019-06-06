import { Injectable } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { Medico } from '../register/medico.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: Paziente | Medico;


  constructor(
    private http: HttpClient
  ) { }

  getUser() {
    return this.user;
  }

  setUser(user: Paziente | Medico){
      this.user = user;
    }
    
}
