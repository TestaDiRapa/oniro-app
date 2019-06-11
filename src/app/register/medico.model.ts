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
        private address: string,
        private pathUrl: string
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

    getImg() {
        return this.pathUrl;
    }

    getCf() {
        return '';
    }

    setImg(url: string) {
        this.pathUrl = url;
    }

    setAddress(address: string) {
        this.address = address;
    }

    setPhone(phone: string) {
        this.phone_number = phone;
    }

    getAge() {
        return '';
    }

    setAge(age: string) {}

}
