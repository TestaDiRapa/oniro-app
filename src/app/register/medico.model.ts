import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Medico {
    constructor(
        private name: string,
        private surname: string,
        private password: string,
        private phone_number: string,
        private email: string,
        private id: string,
        private address: string
    ) {}

    getName() {
        return this.name;
    }

    getSurname() {
        return this.surname;
    }

    getPhone() {
        return this.phone_number;
    }

    getMail() {
        return this.email;
    }

    getAlbo() {
        return this.id;
    }

    getAddress() {
        return this.address;
    }

    setAddress(address: string) {
        this.address = address;
    }

    setPhone(phone: string) {
        this.phone_number = phone;
    }

}
