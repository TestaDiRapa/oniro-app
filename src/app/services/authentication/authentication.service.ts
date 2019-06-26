/**
 * This service allows to take all the information related to the user,
 * including token and to carry out the autologin if the user has been saved in the storage,
 * moreover it allows to login and register an user.
 */

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

    // Set the loggedUser a null to avoid the autologin
    logout() {
        this.loggedUser = null;
        this.storage.remove('logged_user');
    }

    // This method allows to perform the autologin if the loggedUser is set
    autologin() {
        if (!this.loggedUser) {
            return this.loadUser().then<boolean>(user => {
                if (user) {
                    return true;
                } else {
                    return false;
                }
            });
        }
        console.log('EXISTS', this.loggedUser);
        return new Promise<boolean>((resolve) => {
            resolve(true);
        });
    }

    /**Get the response by the server for login relating to the data entered
     * 
     * @param username the username used for login
     * @param password the password used for login
     * @param isUser true=patient, false=doctor
     * @returns {Promise<Observable<Respons>>} The message from the server with the information, or a message error.
     */
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

    /**Register a patient or a doctor
     *
     * @param user the user could be a 'Medico' or a 'Paziente 
     * @param isUser true=patient, false=doctor
     * @returns {Promise<Observable<Respons>>} The message from the server with the information, or a message error.
     */
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

    // Save the loggeduser value in the storage
    private serialize() {
        this.storage.set('logged_user', JSON.stringify(this.loggedUser));
    }

    /** Get the isAuthenticated value
     * @returns {boolean} 
     */
    getAuthentication() {
        return this.isAuthenticated;
    }

    /** Set the name and surname of user
     *
     * @param name the name of user
     * @param surname the surname of user
     */

    private setUserIdentity(name: string, surname: string) {
        this.userIdentity.next(
            {
                name: name,
                surname: surname
            }
        );
    }

    /** Get the user name and surname
     * @returns {Observable<Person>} return the user
     */
    get user() {
        return this.userIdentity.asObservable();
    }

    /** Get the user type
     * @returns {Observable<boolean>} return the type of user
     */
    get type() {
        return this.userType.asObservable();
    }

    /** Get the token of user, if the token is not set then you logout otherwise check if the token still has validity,
     *  if it is false you logout otherwise you set a new token
     * @returns {Promise<Token>} 
     */
    get token() {
        return this.retrieveAuthToken().then(token => {
            if (token === null) {
                console.log('AUTH NULL');
                this.logout();
                this.router.navigate(['/']);
            }
            if (token.expirationDate <= new Date()) {
                console.log('AUTH EXPIRED');
                return this.retrieveRefToken().then(refToken => {
                    if (refToken === null) {
                        console.log('REF NULL');
                        this.logout();
                        this.router.navigate(['/']);
                    }
                    if (refToken.expirationDate <= new Date()) {
                        console.log('REF EXPIRED');
                        this.logout();
                        this.router.navigate(['/']);
                    } else {
                        console.log('REF OK');
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
                            console.log('OLD TOKEN', token);
                            console.log('NEW TOKEN', response.access_token);
                            return response.access_token;
                        });
                    }

                });
            } else {
                console.log('AUTH OK');
                return token.token;
            }
        });
    }

    // If loggedUser is true, refresh the token of user
    private retrieveRefToken() {
        if (!this.loggedUser) {
            return this.loadUser().then<Token>(user => {
                if (user) {
                    return user.refreshToken;
                }
            });
        }
        return new Promise<Token>((resolve) => {
            resolve(this.loggedUser.refreshToken);
        });
    }

    // If loggedUser is true, retrieve the token
    private retrieveAuthToken() {
        if (!this.loggedUser) {
            return this.loadUser().then<Token>(user => {
                if (user) {
                    return user.accessToken;
                }
            });
        }
        return new Promise<Token>((resolve) => {
            resolve(this.loggedUser.accessToken);
        });
    }

    /** Set the validation iterval of token
     * 
     * @param token the new token
     * @param interval the interval of validation
     */
    setAuthToken(token: string, interval: number) {

        this.loggedUser.accessToken = new Token(token, new Date(interval * 1000));
        this.serialize();
    }

    /**Refresh the token and set a new validation iterval
     * 
     * @param token the token thah is refreshed
     * @param interval the interval of validation
     */
    setRefreshToken(token: string, interval: number) {
        this.loggedUser.refreshToken = new Token(token, new Date(interval * 1000));
        this.serialize();
    }

    /** Get the user type
     * @returns {boolean} the type of user
     */
    getUserType() {
        if (!this.loggedUser) {
            return this.loadUser().then(user => {
                if (user) {
                    return user.isUser;
                }
            });
        }
        return new Promise<boolean>((resolve) => {
            resolve(this.loggedUser.isUser);
        });
    }

    /** Get the doc type
     * @returns {boolean} the type of doctor
     * 
     */

    getDocType() {
        if (!this.loggedUser) {
            return this.loadUser().then(user => {
                if (user) {
                    return !user.isUser;
                }
            });
        }
        return new Promise<boolean>((resolve) => {
            resolve(!this.loggedUser.isUser);
        });
    }

     /** Get the user 
     * @returns {Medico | Paziente} all information about the user
     * 
     */

    getUser() {
        if (!this.loggedUser) {
            return this.loadUser().then(user => {
                if (user) {
                    return user.user;
                }
            });
        }
        return new Promise<Paziente | Medico>((resolve) => {
            resolve(this.loggedUser.user);
        });
    }

    /** Set the user
     */

    setUser(user: Paziente | Medico) {
        this.loggedUser.user = user;
        this.setUserIdentity(user.name, user.surname);
        this.serialize();
    }

    /** This method load all the information of user
     * @returns {Promise<any>} all the information about user if logged_user is set
     */
    private loadUser() {
        return this.storage.get('logged_user').then(JSONstring => {
            if (JSONstring) {
                const tmp = JSON.parse(JSONstring);
                console.log(tmp);

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
                        tmp.user.image
                    );
                } else {
                    tmpUser = new Medico(
                        tmp.user.name,
                        tmp.user.surname,
                        '',
                        tmp.user.phone_number,
                        tmp.user.email,
                        tmp.user.id,
                        tmp.user.address,
                        tmp.user.image
                    );
                }

                const loggedUser = new LoggedUser();
                loggedUser.isUser = tmp.isUser;
                loggedUser.accessToken = new Token(tmp.accessToken.token, new Date(tmp.accessToken.expirationDate));
                loggedUser.refreshToken = new Token(tmp.refreshToken.token, new Date(tmp.refreshToken.expirationDate));
                loggedUser.user = tmpUser;
                this.loggedUser = loggedUser;
                this.setUserIdentity(this.loggedUser.user.name, this.loggedUser.user.surname);
                this.userType.next(this.loggedUser.isUser);
                console.log('LOADED', this.loggedUser);
                return loggedUser;
            } else {
                this.loggedUser = new LoggedUser();
                console.log('UNLOADED', this.loggedUser);
                return null;
            }
        });
    }

}
