import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { Medico } from '../register/medico.model';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';


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
    private userType = new BehaviorSubject<boolean>(true);

    constructor(
        private http: HttpClient,
        private storage: Storage
    ) { }

    login(username: string, password: string, isUser: boolean) {
        let params = new HttpParams();
        let path = 'http://' + environment.serverIp + '/login/';
        this.isUser = isUser;
        this.userType.next(isUser);
        this.storage.set('is_user', isUser);
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
        this.storage.set('is_user', isUser);
        if (isUser) {
            path += 'user';
        } else {
            path += 'doctor';
        }
        this.isUser = isUser;
        this.userType.next(isUser);
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

    get type() {
        return this.userType.asObservable();
    }

    get token() {
        if (!this.accessToken) {
            return this.storage.get('auth_token').then(token => {
                this.accessToken = token;
                return token;
            });
        }
        return new Promise((resolve) => {
            resolve(this.accessToken);
        });
    }

    setToken(token: string) {
        this.accessToken = token;
        this.storage.set('auth_token', token);
    }

    getUserType() {
        if (!this.isUser) {
            return this.storage.get('is_user').then<boolean>(isUser => {
                this.isUser = isUser;
                this.userType.next(isUser);
                return isUser;
            });
        }
        return new Promise<boolean>((resolve) => {
            resolve(this.isUser);
        });
    }

    getDocType() {
        if (!this.isUser) {
            return this.storage.get('is_user').then<boolean>(isUser => {
                this.isUser = isUser;
                this.userType.next(isUser);
                return !isUser;
            });
        }
        return new Promise<boolean>((resolve) => {
            resolve(!this.isUser);
        });
    }

}
