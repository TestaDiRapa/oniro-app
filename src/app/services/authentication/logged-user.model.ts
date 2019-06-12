import { Paziente } from '../../register/paziente.model';
import { Medico } from '../../register/medico.model';

export class LoggedUser {
    public isUser: boolean;
    public accessToken: Token;
    public refreshToken: Token;
    public user: Paziente | Medico;

    constructor() { }
}

export class Token {

    constructor(
        public token: string,
        public expirationDate: Date
    ) {}

}