import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { Medico } from '../register/medico.model';

export interface Respons {
    status: string;
    access_token: string;
    message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    isAuthenticated = true;
    private isUser: boolean;
    private accessToken: string ;

    constructor(private http: HttpClient) { }

    login(username: string, password: string, isUser: boolean) {
        let params = new HttpParams();
        let path = 'http://45.76.47.94:8080/login/';
        this.isUser = isUser;
        if (isUser) {
            path += 'user';
            params = params.append('cf', username);
            params = params.append('password', password);
        } else {
            path += 'doctor';
            params = params.append('id', username);
            params = params.append('password', password);
        }
        return this.http.get<Respons>(path, { params });
    }

    register(user: Medico | Paziente, isUser: boolean) {
        let path = 'http://45.76.47.94:8080/register/';
        if (isUser) {
            path += 'user';
        } else {
            path += 'doctor';
        }
        this.isUser = isUser;
        return this.http.put<Respons>(path, user, {headers: new HttpHeaders({'Content-Type' : 'application/json'})});
    }

    getAuthentication() {
        return this.isAuthenticated;
    }

    getToken() {
        return this.accessToken;
    }

    setToken(token: string) {
        this.accessToken = token;
    }

    getUserType() {
        return this.isUser;
    }

}
