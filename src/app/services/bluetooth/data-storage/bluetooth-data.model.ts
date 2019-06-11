import { ApneaEvent } from './apnea-event.model';

export class BluetoothData {
    // tslint:disable: variable-name
    constructor(
        public timestamp: string,
        public spo2: number,
        public spo2_rate: number,
        public oxy_event: ApneaEvent,
        public dia_event: ApneaEvent,
        public hr: number,
        public hr_rate: number,
        public movements_count: number
        ) { }
}
