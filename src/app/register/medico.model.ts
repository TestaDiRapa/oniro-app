import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Medico {
    constructor(
        private name: string,
        private surname: string,
        private password: string,
        private phone: string,
        private email: string,
        private id: string,
        private address: string
    ) {}
}
