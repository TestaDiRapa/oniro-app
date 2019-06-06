import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { Medico } from '../register/medico.model';

export interface ResponseGet {
    status: string;
    access_token: string;
    message: string;
}
@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    constructor(private http: HttpClient) { }

    login(username: string, password: string, isUser: boolean) {
        let params = new HttpParams();
        let path = 'http://45.76.47.94:8080/login/';
        if (isUser) {
            path += 'user';
        } else {
            path += 'doc';
        }
        params = params.append('cf', username);
        params = params.append('password', password);
        return this.http.get<ResponseGet>(path, { params });
    }

    register(user: Medico | Paziente, isUser: boolean){
        console.log("sono nel servizio auth di register");
        let path = 'http://45.76.47.94:8080/register/';
        if (isUser) {
            console.log("STO REGISTRANDO UN USER");
            path += 'user';
        } else {
            path += 'doctor';
            console.log("STO REGISTRANDO UN DOTTORE");
        }
        return this.http.put<ResponseGet>(path, user, {headers: new HttpHeaders({'Content-Type' : 'application/json'})})
    }

}
