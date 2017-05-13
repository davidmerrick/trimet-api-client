import Arrival from './Arrival'
import axios from 'axios'

class TriMetAPI {

    constructor(TRIMET_API_KEY) {
        this.TRIMET_API_KEY = TRIMET_API_KEY;
        this.TRIMET_BASE_URL = "https://developer.trimet.org/ws/V1/arrivals?";
    };

    getNextArrivalForBus(stopId, busId) {
        return new Promise((resolve, reject) => {
            this.getSortedFilteredArrivals(stopId)
                    .then(arrivals => {
                        try {
                            let arrivalsForStop = arrivals.filter(arrival => arrival.route === busId);
                            let arrivalData = arrivalsForStop[0];
                            let arrival = new Arrival(arrivalData);
                            resolve(arrival);
                        } catch(err) {
                            reject(Error(`Error getting arrivals at stop ${stopId} for bus ${busId}`));
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
        });
    }

    getTrimetStopUrl(stopId) {
        return this.TRIMET_BASE_URL + "locIDs=" + stopId + "&appID=" + this.TRIMET_API_KEY + "&json=true";
    }

    getSortedFilteredArrivals(stopId) {
        return new Promise((resolve, reject) => {
            let url = this.getTrimetStopUrl(stopId);
            axios.get(url)
                .then(response => {
                    let data = response.data;
                    let arrivalDatas = data.resultSet.arrival;
                    if (arrivalDatas == null || arrivalDatas.length === 0) {
                        reject(new Error("No arrivals found."));
                        return;
                    }
                    let arrivals = arrivalDatas.map(arrivalData => new Arrival(arrivalData));
                    arrivals = this.sortArrivals(arrivals);

                    // Filter for arrivals that have already happened
                    arrivals = arrivals.filter(arrival => arrival.getMinutesUntilArrival() > 0);
                    resolve(arrivals);
                })
                .catch(err => {
                    reject(err);
                });

        });
    }

    getNextArrivalsForTrainStop(stopId) {
        return new Promise((resolve, reject) => {
            this.getSortedFilteredArrivals(stopId)
                .then(arrivals => {
                    let arrival = arrivals[0];
                    resolve(arrival);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    sortArrivals(arrivals) {
        arrivals.sort(function (a, b) {
            let aTime = a.getNextArrivalTime();
            let bTime = b.getNextArrivalTime();
            if (aTime > bTime) {
                return 1;
            } else if (aTime == bTime) {
                return 0;
            } else {
                return -1;
            }
        });
        return arrivals;
    }
}

export default TriMetAPI;