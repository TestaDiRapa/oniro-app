import { ApneaEvent } from './apnea-event.model';

export class BluetoothData {
    public SpO2: number[];
    public oxyEvents: ApneaEvent[];
    public diaEvents: ApneaEvent[];
    public hr: number[];
    public rawHr: number[];

    constructor() { }

    insertSpO2(value: number) {
        this.SpO2.push(value);
    }

    insertOxyEvent(duration: number, time: Date) {
        this.oxyEvents.push(new ApneaEvent(duration, time));
    }

    insertDiaEvent(duration: number, time: Date) {
        this.diaEvents.push(new ApneaEvent(duration, time));
    }

    insertHR(value: number) {
        this.hr.push(value);
    }

    insertRawHR(samples: number[]) {
        for (const sample of samples) {
            if (sample > 0) {
                this.rawHr.push(sample);
            }
        }
    }

}