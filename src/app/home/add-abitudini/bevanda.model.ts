export class Bevanda {
    constructor(
        private tipo: string,
        private totale: number
    ) {}

    setTipo(tipo: string) {
        this.tipo = tipo;
    }

    setTotale(tot: number) {
        this.totale = tot;
    }

    getTot() {
        return this.totale;
    }

}
