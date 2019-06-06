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
    private isAuthenticated = false;

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
        this.isAuthenticated = true;
        return this.http.get<ResponseGet>(path, { params });
    }

    register(user: Medico | Paziente, isUser: boolean){
        let path = 'http://45.76.47.94:8080/register/';
        if (isUser) {
            path += 'user';
        } else {
            path += 'doctor';
        }
        return this.http.put<ResponseGet>(path, user, {headers: new HttpHeaders({'Content-Type' : 'application/json'})})
    }

    getAuthentication() {
        return this.isAuthenticated;
    }

}
