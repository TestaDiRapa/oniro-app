import { Bevanda } from './bevanda.model';

export class Abitudini {

    constructor(
        private caffe: Bevanda,
        private drink: Bevanda,
        private isSport: boolean,
        private isCena: boolean
    ) {}
}
