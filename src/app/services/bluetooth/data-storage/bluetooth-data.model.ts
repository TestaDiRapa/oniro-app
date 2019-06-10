import { ApneaEvent } from './apnea-event.model';

export class BluetoothData {
    constructor(
        public timestamp: string,
        public spo2: number,
// tslint:disable: variable-name
        public oxy_event: ApneaEvent,
        public dia_event: ApneaEvent,
        public hr: number,
        public raw_hr: number[],
        ) { }
}
