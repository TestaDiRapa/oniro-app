import { ApneaEvent } from './apnea-event.model';

/**
 * This class represents a raw packet sent from the device, elaborated to structure the apnea events
 * and to add the time of the beginning of the recording
 */
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
