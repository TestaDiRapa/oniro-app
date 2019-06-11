import { Injectable } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { Medico } from '../register/medico.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService, Respons } from './authentication.service';
import { Abitudini } from '../home/add-abitudini/abitudini.model';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs/internal/observable/from';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: Paziente | Medico;


  constructor(
    private authService: AuthenticationService,
    private http: HttpClient,
    private storage: Storage
  ) { }

  getUser() {
    if (!this.user) {
      return this.storage.get('user').then(user => {
        this.user = JSON.parse(user);
        return this.user;
      });
    }
    return new Promise<Paziente | Medico>((resolve) => {
      resolve(this.user);
    });
  }

  setUser(user: Paziente | Medico) {
    this.user = user;
    this.storage.set('user', JSON.stringify(user));
    return;
  }

  getMyDoctor() {
    const path = 'http://' + environment.serverIp + '/user/my_doctors';
    return this.authService.token.then(token => {
      return this.http.get<Respons>(
        path,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token
          })
        });
    });
  }

  putMyHabits(abitudine: Abitudini) {
    const path = 'http://' + environment.serverIp + '/user/habits';
    return from(this.authService.token.then(token => {
      return this.http.put<Respons>(
        path,
        JSON.stringify(abitudine),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          })
        });
    }));
  }

  changeProfile(formData: FormData) {
    const path = 'http://' + environment.serverIp + '/me';
    return from(this.authService.token.then(token => {
      return this.http.post<Respons>(
        path,
        formData,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token
          })
        });
    }));
  }

  getRequests() {
    const path = 'http://' + environment.serverIp + '/doctor/my_patients';
    return this.authService.token.then(token => {
      return this.http.get<Respons>(
        path,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token
          })
        });
    });
  }

  acceptPatient(cf: string) {
    const path = 'http://' + environment.serverIp + '/doctor/my_patients';
    const body = cf;
    return this.authService.token.then(token => {
      return this.http.post<Respons>(
        path,
        body,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          })
        });
    });
  }

  deletePatient(cf: string) {
    const path = 'http://' + environment.serverIp + '/doctor/my_patients';
    let params = new HttpParams();
    params = params.append('patient_cf', cf);
    return this.authService.token.then(token => {
      return this.http.delete<Respons>(
        path,
        {
        headers: new HttpHeaders({'Content-Type': 'application/json', Authorization: 'Bearer ' + token}),
        params
        }
        );
    });
  }

  getTypeUser() {
    return typeof (this.user) === typeof (Medico);
  }
}
