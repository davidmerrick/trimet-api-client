'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Arrival = require('./Arrival');

var _Arrival2 = _interopRequireDefault(_Arrival);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TriMetAPI = function () {
    function TriMetAPI(TRIMET_API_KEY) {
        _classCallCheck(this, TriMetAPI);

        this.TRIMET_API_KEY = TRIMET_API_KEY;
        this.TRIMET_BASE_URL = "https://developer.trimet.org/ws/V1/arrivals?";
    }

    _createClass(TriMetAPI, [{
        key: 'getNextArrivalForBus',
        value: function getNextArrivalForBus(stopId, busId) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this.getSortedFilteredArrivals(stopId).then(function (arrivals) {
                    try {
                        var arrivalsForStop = arrivals.filter(function (arrival) {
                            return arrival.route === busId;
                        });
                        var arrivalData = arrivalsForStop[0];
                        var arrival = new _Arrival2.default(arrivalData);
                        resolve(arrival);
                    } catch (err) {
                        reject(Error('Error getting arrivals at stop ' + stopId + ' for bus ' + busId));
                    }
                }).catch(function (err) {
                    reject(err);
                });
            });
        }
    }, {
        key: 'getTrimetStopUrl',
        value: function getTrimetStopUrl(stopId) {
            return this.TRIMET_BASE_URL + "locIDs=" + stopId + "&appID=" + this.TRIMET_API_KEY + "&json=true";
        }
    }, {
        key: 'getSortedFilteredArrivals',
        value: function getSortedFilteredArrivals(stopId) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var url = _this2.getTrimetStopUrl(stopId);
                _axios2.default.get(url).then(function (response) {
                    var data = response.data;
                    var arrivalDatas = data.resultSet.arrival;
                    if (arrivalDatas == null || arrivalDatas.length === 0) {
                        callback(new Error("No arrivals found."));
                        return;
                    }
                    var arrivals = arrivalDatas.map(function (arrivalData) {
                        return new _Arrival2.default(arrivalData);
                    });
                    arrivals = _this2.sortArrivals(arrivals);

                    // Filter for arrivals that have already happened
                    arrivals = arrivals.filter(function (arrival) {
                        return arrival.getMinutesUntilArrival() > 0;
                    });
                    resolve(arrivals);
                }).catch(function (err) {
                    reject(err);
                });
            });
        }
    }, {
        key: 'getNextArrivalsForTrainStop',
        value: function getNextArrivalsForTrainStop(stopId) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3.getSortedFilteredArrivals(stopId).then(function (arrivals) {
                    var arrival = arrivals[0];
                    resolve(arrival);
                }).catch(function (err) {
                    reject(err);
                });
            });
        }
    }, {
        key: 'sortArrivals',
        value: function sortArrivals(arrivals) {
            arrivals.sort(function (a, b) {
                var aTime = a.getNextArrivalTime();
                var bTime = b.getNextArrivalTime();
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
    }]);

    return TriMetAPI;
}();

exports.default = TriMetAPI;