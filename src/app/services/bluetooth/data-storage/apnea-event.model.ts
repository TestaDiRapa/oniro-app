/**
 * This class represents an apnea event, defined by the time it happened and its duration
 */
export class ApneaEvent {

    constructor(
        public duration: number,
        public time: string
    ) { }

}
