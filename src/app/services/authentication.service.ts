import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { Medico } from '../register/medico.model';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';

export interface Respons {
    status: string;
    access_token: string;
    message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    isAuthenticated = true;
    private isUser: boolean;
    private accessToken: string;

    constructor(
        private http: HttpClient,
        private storage: Storage
    ) { }

    login(username: string, password: string, isUser: boolean) {
        let params = new HttpParams();
        let path = 'http://' + environment.serverIp + '/login/';
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
        let path = 'http://' + environment.serverIp + '/register/';
        if (isUser) {
            path += 'user';
        } else {
            path += 'doctor';
        }
        this.isUser = isUser;
        return this.http.put<Respons>(
            path,
            user,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            });
    }

    getAuthentication() {
        return this.isAuthenticated;
    }

    get token() {
        if (!this.accessToken) {
            return this.storage.get('auth_token');
        }
        return new Promise((resolve, reject) => {
            resolve(this.accessToken);
        });
    }

    setToken(token: string) {
        this.accessToken = token;
        this.storage.set('auth_token', token);
    }

    getUserType() {
        return this.isUser;
    }


    // controllare la guarda dell'user
}
