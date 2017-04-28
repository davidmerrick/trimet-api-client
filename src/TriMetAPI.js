/**
 * Note: callback structure uses Node convention of error-first callbacks.
 * See: http://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/
 */

import request from 'request'
import Arrival from './Arrival'

class TriMetAPI {

    constructor(TRIMET_API_KEY) {
        this.TRIMET_API_KEY = TRIMET_API_KEY;
        this.TRIMET_BASE_URL = "https://developer.trimet.org/ws/V1/arrivals?";
    };

    getNextArrivalForBus(stopId, busId) {
        return new Promise((resolve, reject) => {
            this.getSortedFilteredArrivals(stopId, (err, arrivals) => {
                if (err) {
                    reject(Error(`Error getting arrivals at stop ${stopId} for bus ${busId}`));
                }
                try {
                    let arrivalsForStop = arrivals.filter(arrival => arrival.route === busId);
                    let arrivalData = arrivalsForStop[0];
                    let arrival = new Arrival(arrivalData);
                    resolve(arrival);
                    callback(null, arrival);
                } catch(err) {
                    reject(Error(`Error getting arrivals at stop ${stopId} for bus ${busId}`));
                }
            });
        }
    }

    getTrimetStopUrl(stopId) {
        return this.TRIMET_BASE_URL + "locIDs=" + stopId + "&appID=" + this.TRIMET_API_KEY + "&json=true";
    }

    getSortedFilteredArrivals(stopId, callback) {
        var url = this.getTrimetStopUrl(stopId);
        var _this = this;
        var options = {
            url: url,
            withCredentials: false
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                var arrivalDatas = result.resultSet.arrival;
                if (arrivalDatas == null || arrivalDatas.length === 0) {
                    callback(new Error("No arrivals found."));
                    return;
                }
                var arrivals = arrivalDatas.map(arrivalData => new Arrival(arrivalData));
                arrivals = _this.sortArrivals(arrivals);

                // Filter for arrivals that have already happened
                arrivals = arrivals.filter(arrival => arrival.getMinutesUntilArrival() > 0);
                callback(null, arrivals);
            } else {
                callback(new Error(`Error in request to TriMet API. Response: ${response.statusCode}`));
            }
        });
    }

    getNextArrivalsForTrainStop(stopId, callback) {
        this.getSortedFilteredArrivals(stopId, function (err, arrivals) {
            if (err) {
                callback(err);
                return;
            }
            var arrival = arrivals[0];
            callback(null, arrival);
        });
    }

    sortArrivals(arrivals) {
        arrivals.sort(function (a, b) {
            var aNextArrivalTime = a.getNextArrivalTime();
            var bNextArrivalTime = b.getNextArrivalTime();
            if (aNextArrivalTime > bNextArrivalTime) {
                return 1;
            } else if (aNextArrivalTime == bNextArrivalTime) {
                return 0;
            } else {
                return -1;
            }
        });
        return arrivals;
    }
}

export default TriMetAPI