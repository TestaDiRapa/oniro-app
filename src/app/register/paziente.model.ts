import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Paziente {
    constructor(
        private name: string,
        private surname: string,
        private password: string,
        private phone_number: string,
        private email: string,
        private cf: string,
        private age: string,
    ) {}
}
