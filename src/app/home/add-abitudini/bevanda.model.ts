export class Bevanda {
    constructor(
        private tipo: string,
        private totale: number
    ) {}

    getTipo() {
        return this.tipo;
    }

    getTot() {
        return this.totale;
    }

}
