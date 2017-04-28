import ArrivalType from './ArrivalType'

const MAX_LINES = [
    "blue",
    "red",
    "orange",
    "green",
    "yellow"
];

class Arrival {

    constructor(arrivalData) {
        this.departed = arrivalData.departed;
        this.scheduled = arrivalData.scheduled;
        this.shortSign = arrivalData.shortSign;
        this.blockPosition = arrivalData.blockPosition;
        this.estimated = arrivalData.estimated;
        this.dir = arrivalData.dir;
        this.route = arrivalData.route;
        this.detour = arrivalData.detour;
        this.piece = arrivalData.piece;
        this.fullSign = arrivalData.fullSign;
        this.block = arrivalData.block;
        this.locid = arrivalData.locid;
        this.status = arrivalData.status;

        var trainSign = this.getTrainSign();
        if (MAX_LINES.indexOf(trainSign.toLowerCase()) !== -1) {
            this.arrivalType = ArrivalType.MAX_TRAIN;
        } else {
            this.arrivalType = ArrivalType.BUS;
        }
    }

    getNextArrivalTime() {
        if (this.estimated) {
            return Date.parse(this.estimated);
        }
        return Date.parse(this.scheduled);
    }

    getMinutesUntilArrival() {
        var arrivalTime = this.getNextArrivalTime();
        var now = Date.now();
        var diffMs = arrivalTime - now;
        var diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
        return diffMins;
    }

    getTrainSign() {
        return this.shortSign.split(" ")[0];
    }

    getBusID() {
        return this.route;
    }

    getArrivalType() {
        return this.arrivalType;
    }
}

export default Arrival;