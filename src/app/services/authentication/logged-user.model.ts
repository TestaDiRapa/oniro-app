import { Paziente } from '../../register/paziente.model';
import { Medico } from '../../register/medico.model';

export class LoggedUser {
    public isUser: boolean;
    public accessToken: string;
    public user: Paziente | Medico;

    constructor() { }
}