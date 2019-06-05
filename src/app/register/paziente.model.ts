import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Paziente {
    constructor(
        public name: string,
        public surname: string,
        public password: string,
        public phone: string,
        public email: string,
        public cf: string,
        public age: string,
    ) {}
}
