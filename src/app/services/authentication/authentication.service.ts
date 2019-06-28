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

    /**
     * This method allows to set the logged used to null and to remove him from the 
     * storage in orfer to avoid the autologin.
     */
    logout() {
        this.loggedUser = null;
        this.storage.remove('logged_user');
    }

    /**
     * The method checks if the user has already logged in.
     *
     * @returns {Promise<boolean>}
     */
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
        return new Promise<boolean>((resolve) => {
            resolve(true);
        });
    }

    /**
     * 
     * This method allows to retrieve the user on the REST Server. The server's response can be successfull
     * if the user exists and it returns some user's information, or 'error' if the user doesn't exist.
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

    /**
     * This method allows to put a new user on the database server, after the user submit the form
     * on the register page.
     *
     * @param user the user could be a 'Medico' or a 'Paziente'
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

    /**
     * To save the logged user correctly he is serialized as a JSON object.
     * The user is saved on the storage.
     */
    private serialize() {
        this.storage.set('logged_user', JSON.stringify(this.loggedUser));
    }

    /**
     * Get the isAuthenticated value
     * 
     * @returns {boolean}
     */
    getAuthentication() {
        return this.isAuthenticated;
    }

    /** 
     * Set the name and surname of user
     *
     * @param name the name of user
     * @param surname the surname of user
     */
    private setUserIdentity(name: string, surname: string) {
        this.userIdentity.next(
            {
                name,
                surname
            }
        );
    }

    /**
     * Get the user name and surname
     *
     * @returns {Observable<Person>} return the user
     */
    get user() {
        return this.userIdentity.asObservable();
    }

    /**
     * Get the user type
     *
     * @returns {Observable<boolean>} return the type of user
     */
    get type() {
        return this.userType.asObservable();
    }

    /**
     * Get the token of user. If the token is not set then the user is logged out,
     * otherwise the method checks if the token still has validity.
     * If the token is null, the method checks the validity of the refresh token.
     * If the refresh token is not valid (null or expired), the user is logged out, otherwise a 
     * new token is set.
     *
     * @returns {Promise<Token>}
     */
    get token() {
        return this.retrieveAuthToken().then(token => {
            if (token === null) {
                this.logout();
                this.router.navigate(['/']);
            }
            // checks if the token is expired
            if (token.expirationDate <= new Date()) {
                return this.retrieveRefToken().then(refToken => {
                    if (refToken === null) {
                        this.logout();
                        this.router.navigate(['/']);
                    }
                    if (refToken.expirationDate <= new Date()) {
                        this.logout();
                        this.router.navigate(['/']);
                    } else {
                        return this.http.get<Respons>(
                            `http://${environment.serverIp}/refresh`,
                            {
                                headers: new HttpHeaders({
                                    Authorization: `Bearer ${refToken.token}`
                                })
                            }
                        ).toPromise().then(response => {
                            this.setAuthToken(response.access_token, response.access_token_exp);
                            return response.access_token;
                        });
                    }
                });
            } else { // the token is not expired
                return token.token;
            }
        });
    }

    /**
     * This method chesk if the user is logged, so it return the refresh Token; 
     * otherwise a new refresh token is returned.
     *
     * @returns {Promise<Token>} Return a Promise of the token.
     */
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

    /**
     * This method chesk if the user is logged, so it return the authentication Token; 
     * otherwise a new authentication token is returned.
     *
     * @returns {Promise<Token>} Return a Promise of the token.
     */    
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

    /**
     * Set the validation interval of token
     *
     * @param token the new token
     * @param interval the interval of validation
     */
    setAuthToken(token: string, interval: number) {
        this.loggedUser.accessToken = new Token(token, new Date(interval * 1000));
        this.serialize();
    }

    /**
     * Refresh the token and set a new validation interval
     *
     * @param token the token thah is refreshed
     * @param interval the interval of validation
     */
    setRefreshToken(token: string, interval: number) {
        this.loggedUser.refreshToken = new Token(token, new Date(interval * 1000));
        this.serialize();
    }

    /**
     * Get the patient type
     *
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

    /** 
     * Get the doctor type
     * 
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

    /**
     * Get the user
     *
     * @returns {Medico | Paziente} all information about the user
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

    /**
     * Set the user
     *
     * @param user it can be 'Paziente' or 'Medico'
     */
    setUser(user: Paziente | Medico) {
        this.loggedUser.user = user;
        this.setUserIdentity(user.name, user.surname);
        this.serialize();
    }

    /**
     * This method load all the information of the user from the storage
     *
     * @returns {Promise<any>} all the information about user if logged_user is set
     */
    private loadUser() {
        return this.storage.get('logged_user').then(JSONstring => {
            if (JSONstring) {
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
                return loggedUser;
            } else {
                this.loggedUser = new LoggedUser();
                return null;
            }
        });
    }

}
