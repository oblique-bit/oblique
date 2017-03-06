import Timer = NodeJS.Timer;
export class Loading {
    constructor(public id: number, public timeout: Timer) {

    }
}