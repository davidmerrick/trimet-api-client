import {expect} from "chai";
import TriMetAPI from '../src/TriMetAPI'

var TriMetAPIInstance = new TriMetAPI(process.env.TRIMET_API_KEY);

describe("TriMetAPI Tests", done => {

    it("Test getNextArrivalForBus", done => {
        let stopId = 755;
        let busId = 20;

        return TriMetAPIInstance.getNextArrivalForBus(stopId, busId)
            .then(result => {
                console.log("Success!");
                done();
            })
            .catch(err => {
                throw new Error(err);
            });
    });
});
