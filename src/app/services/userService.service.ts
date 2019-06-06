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

  setUser(user: Paziente | Medico, type: 'login'| 'register'){
    if(type  === 'register') {
      this.user = user;
      return;
    }
    let path = 'http://45.76.47.94:8080/me/';
      // da implementare la get /me e ottenere le informazioni;
    //this.user = this.http.get<Response>()
  }

}
