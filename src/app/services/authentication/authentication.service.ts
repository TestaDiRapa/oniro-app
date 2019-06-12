import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paziente } from '../../register/paziente.model';
import { Medico } from '../../register/medico.model';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { LoggedUser } from './logged-user.model';


export interface Respons {
    status: string;
    access_token: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    isAuthenticated = true;
    private loggedUser: LoggedUser;
    private userType = new BehaviorSubject<boolean>(true);

    constructor(
        private http: HttpClient,
        private storage: Storage
    ) { }

    logout() {
        this.loggedUser = null;
        this.storage.remove('logged_user');
    }

    autologin() {
        if (!this.loggedUser) {
            return this.storage.get('logged_user').then<boolean>(user => {
                if (user) {
                    this.loggedUser = JSON.parse(user);
                    console.log("1", user, this.loggedUser);
                    return true;
                }
                else {
                    this.loggedUser = new LoggedUser();
                    console.log("2", this.loggedUser)
                    return false;
                }
            });
        }
        console.log("3", this.loggedUser);
        return new Promise<boolean>((resolve) => {
            resolve(true);
        })
    }

    login(username: string, password: string, isUser: boolean) {
        let params = new HttpParams();
        let path = 'http://' + environment.serverIp + '/login/';
        this.loggedUser.isUser = isUser;
        this.userType.next(isUser);
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
        this.loggedUser.isUser = isUser;
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

    private serialize() {
        this.storage.set('logged_user', JSON.stringify(this.loggedUser));
    }

    getAuthentication() {
        return this.isAuthenticated;
    }

    get type() {
        return this.userType.asObservable();
    }

    get token() {
        if (!this.loggedUser) {
            return this.storage.get('logged_user').then(user => {
                this.loggedUser = JSON.parse(user);
                return this.loggedUser.accessToken;
            });
        }
        return new Promise((resolve) => {
            resolve(this.loggedUser.accessToken);
        });
    }

    setToken(token: string) {
        this.loggedUser.accessToken = token;
        this.serialize();
    }

    getUserType() {
        if (!this.loggedUser) {
            return this.storage.get('logged_user').then<boolean>(user => {
                this.loggedUser = JSON.parse(user);
                this.userType.next(this.loggedUser.isUser);
                return this.loggedUser.isUser;
            });
        }
        return new Promise<boolean>((resolve) => {
            resolve(this.loggedUser.isUser);
        });
    }

    getDocType() {
        if (!this.loggedUser) {
            return this.storage.get('logged_user').then<boolean>(user => {
                this.loggedUser = JSON.parse(user);
                this.userType.next(!this.loggedUser.isUser);
                return this.loggedUser.isUser;
            });
        }
        return new Promise<boolean>((resolve) => {
            resolve(!this.loggedUser.isUser);
        });
    }

    getUser() {
        if (!this.loggedUser) {
            return this.storage.get('logged_user').then(user => {
                this.loggedUser = JSON.parse(user);
                return this.loggedUser.user;
            });
        }
        return new Promise<Paziente | Medico>((resolve) => {
            resolve(this.loggedUser.user);
        });
    }

    setUser(user: Paziente | Medico) {
        this.loggedUser.user = user;
        this.serialize();
    }

    saveUser() {
        this.serialize();
    }

    getTypeUser() {
        return typeof (this.loggedUser.user) === typeof (Medico);
    }
}