import { Injectable } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { Medico } from '../register/medico.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: Paziente | Medico;


  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) { }

  getUser() {
    return this.user;
  }

  setUser(user: Paziente | Medico) {
      this.user = user;
      return;
      }

  getMyDoctor() {
    const path = 'http://45.76.47.94:8080/user/my_doctors';
    return this.http.get<Response>(path, {headers: new HttpHeaders( {Authorization: 'Bearer ' + this.auth.getToken()  })});
  }

}
