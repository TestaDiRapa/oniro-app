import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService, Respons } from './authentication/authentication.service';
import { Abitudini } from '../home/add-abitudini/abitudini.model';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs/internal/observable/from';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient,
  ) { }

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
    return this.authService.token.then(token => {
      return this.http.put<Respons>(
        path,
        JSON.stringify(abitudine),
        {
          headers: new HttpHeaders({
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + token
          })
        });
    });
  }

  changeProfile(formData: FormData) {
    const path = 'http://' + environment.serverIp + '/me';
    return from(this.authService.token.then(token => {
      return this.http.post<Respons>(
        path,
        formData,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          })
        });
    }));
  }

  sendRequestToDoc(idDoc: string) {
    const path = 'http://' + environment.serverIp + '/user/my_doctors';
    //let body = '{"doctor_id":' + '"' + idDoc + '"' + '}';
    let body = new HttpParams();
    body = body.append('doctor_id', idDoc);
    console.log("BODY - " + body);
    return this.authService.token.then(token => {
      return this.http.post<Respons>(
        path,
        JSON.stringify(body),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }),
        });
    });
  }

  sendRecordings(doctorId: string, dateID: string) {
    const path = 'http://' + environment.serverIp + '/user/my_recordings/send';
    let body = new HttpParams();
    body = body.append('id', dateID);
    body = body.append('doctor', doctorId);
    return this.authService.token.then(token => {
      return this.http.post<Respons>(
        path,
        body,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }),
        });
    });
  }

}
