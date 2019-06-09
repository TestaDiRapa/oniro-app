import { ApneaEvent } from './apnea-event.model';

export class BluetoothData {
    public spo2: number[];
    public oxy_events: ApneaEvent[];
    public dia_events: ApneaEvent[];
    public hr: number[];
    public raw_hr: number[];

    constructor(public timestamp: string) { }

    insertSpO2(value: number) {
        this.spo2.push(value);
    }

    insertOxyEvent(duration: number, time: string) {
        this.oxy_events.push(new ApneaEvent(duration, time));
    }

    insertDiaEvent(duration: number, time: string) {
        this.dia_events.push(new ApneaEvent(duration, time));
    }

    insertHR(value: number) {
        this.hr.push(value);
    }

    insertRawHR(samples: number[]) {
        for (const sample of samples) {
            if (sample > 0) {
                this.raw_hr.push(sample);
            }
        }
    }

}