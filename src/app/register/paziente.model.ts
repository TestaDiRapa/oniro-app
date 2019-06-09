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

    getName() {
        return this.name;
    }

    getSurname() {
        return this.surname;
    }

    getPhone() {
        return this.phone_number;
    }

    getAge() {
        return this.age;
    }

    getMail() {
        return this.email;
    }

    getCf() {
        return this.cf;
    }

    setAge(age: string) {
        this.age = age;
    }

    setPhone(phone: string) {
        this.phone_number = phone;
    }
}
