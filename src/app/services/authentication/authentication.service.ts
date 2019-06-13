import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paziente } from '../../register/paziente.model';
import { Medico } from '../../register/medico.model';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { LoggedUser, Token } from './logged-user.model';
import { Router } from '@angular/router';


export interface Respons {
    status: string;
    access_token: string;
    access_token_exp: number;
    refresh_token: string;
    refresh_token_exp: number;
    message: string;
}

export interface Person {
    name: string;
    surname: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    isAuthenticated = true;
    private loggedUser: LoggedUser;
    private userType = new BehaviorSubject<boolean>(true);
    private userIdentity = new BehaviorSubject<Person>({
        name: '',
        surname: ''
    });

    constructor(
        private http: HttpClient,
        private router: Router,
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
                    this.setUserIdentity(this.loggedUser.user.name, this.loggedUser.user.surname);
                    return true;
                }
                else {
                    this.loggedUser = new LoggedUser();
                    return false;
                }
            });
        }
        this.setUserIdentity(this.loggedUser.user.name, this.loggedUser.user.surname);
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

    setUserIdentity(name: string, surname: string) {
        this.userIdentity.next(
            {
                name: name,
                surname: surname
            }
        );
    }

    get user() {
        return this.userIdentity.asObservable();
    }

    get type() {
        return this.userType.asObservable();
    }

    get token() {
        return this.retrieveAuthToken().then(token => {
            if (token === null) {
                console.log("AUTH NULL");
                this.logout();
                this.router.navigate(['/']);
            }
            if (token.expirationDate <= new Date()) {
                console.log("AUTH EXPIRED");
                return this.retrieveRefToken().then(refToken => {
                    if (refToken === null) {
                        console.log("REF NULL");
                        this.logout();
                        this.router.navigate(['/']);
                    }
                    if (refToken.expirationDate <= new Date()) {
                        console.log("REF EXPIRED");
                        this.logout();
                        this.router.navigate(['/']);
                    } else {
                        console.log("REF OK")
                        return this.http.get<Respons>(
                            `http://${environment.serverIp}/refresh`,
                            {
                                headers: new HttpHeaders({
                                    Authorization: `Bearer ${refToken.token}`
                                })
                            }
                        ).toPromise().then(response => {
                            console.log(response);
                            this.setAuthToken(response.access_token, response.access_token_exp);
                            console.log("OLD TOKEN", token);
                            console.log("NEW TOKEN", response.access_token);
                            return response.access_token;
                        })
                    }

                });
            }
            else {
                console.log("AUTH OK");
                return token.token;
            }
        });
    }

    private retrieveRefToken() {
        if (!this.loggedUser) {
            return this.storage.get('logged_user').then<Token>(user => {
                if (user) {
                    this.loggedUser = this.loadUser(user);
                    return this.loggedUser.refreshToken;
                }
            });
        }
        return new Promise<Token>((resolve) => {
            resolve(this.loggedUser.refreshToken);
        });
    }

    private retrieveAuthToken() {
        if (!this.loggedUser) {
            return this.storage.get('logged_user').then<Token>(user => {
                if (user) {
                    this.loggedUser = this.loadUser(user);
                    return this.loggedUser.accessToken;
                }
            });
        }
        return new Promise<Token>((resolve) => {
            resolve(this.loggedUser.accessToken);
        });
    }

    setAuthToken(token: string, interval: number) {

        this.loggedUser.accessToken = new Token(token, new Date(interval * 1000));
        this.serialize();
    }

    setRefreshToken(token: string, interval: number) {
        this.loggedUser.refreshToken = new Token(token, new Date(interval * 1000));
        this.serialize();
    }

    getUserType() {
        if (!this.loggedUser) {
            return this.storage.get('logged_user').then<boolean>(user => {
                this.loggedUser = this.loadUser(user);
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
                if (user) {
                    this.loggedUser = this.loadUser(user);
                    this.userType.next(!this.loggedUser.isUser);
                    return this.loggedUser.isUser;
                }
            });
        }
        return new Promise<boolean>((resolve) => {
            resolve(!this.loggedUser.isUser);
        });
    }

    getUser() {
        if (!this.loggedUser) {
            return this.storage.get('logged_user').then(user => {
                if (user) {
                    this.loggedUser = this.loadUser(user);
                    return this.loggedUser.user;
                }
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

    getTypeUser() {
        return typeof (this.loggedUser.user) === typeof (Medico);
    }

    private loadUser(JSONstring: string) {
        const tmp = JSON.parse(JSONstring);

        let tmpUser;

        if (tmp.isUser) {
            tmpUser = new Paziente(
                tmp.user.name,
                tmp.user.surname,
                '',
                tmp.user.phone_number,
                tmp.user.email,
                tmp.user.cf,
                tmp.user.age,
                tmp.user.pathUrl
            )
        } else {
            tmpUser = new Medico(
                tmp.user.name,
                tmp.user.surname,
                '',
                tmp.user.phone_number,
                tmp.user.email,
                tmp.user.id,
                tmp.user.address,
                tmp.user.pathUrl
            )
        }

        const loggedUser = new LoggedUser();
        loggedUser.isUser = tmp.isUser;
        loggedUser.accessToken = new Token(tmp.accessToken.token, new Date(tmp.accessToken.expirationDate));
        loggedUser.refreshToken = new Token(tmp.refreshToken.token, new Date(tmp.refreshToken.expirationDate));
        loggedUser.user = tmpUser;
        return loggedUser;
    }
}
