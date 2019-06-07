import { Injectable } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { Medico } from '../register/medico.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService, Response } from './authentication.service';
import { Abitudini } from '../home/add-abitudini/abitudini.model';

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

  putMyHabits(abitudine: Abitudini) {
    const path = 'http://45.76.47.94:8080/user/habits';
    const token = this.auth.getToken();
    console.log(JSON.stringify(abitudine));
// tslint:disable-next-line: max-line-length
    return this.http.put<Response>(path, JSON.stringify(abitudine), {headers: new HttpHeaders({'Content-Type' : 'application/json', Authorization: 'Bearer ' + token   }) });

  }
getTypeUser() {
  return typeof(this.user) === typeof(Medico);
}
}
