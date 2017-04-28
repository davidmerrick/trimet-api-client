"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ArrivalType = require("./ArrivalType");

var _ArrivalType2 = _interopRequireDefault(_ArrivalType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MAX_LINES = ["blue", "red", "orange", "green", "yellow"];

var Arrival = function () {
    function Arrival(arrivalData) {
        _classCallCheck(this, Arrival);

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
            this.arrivalType = _ArrivalType2.default.MAX_TRAIN;
        } else {
            this.arrivalType = _ArrivalType2.default.BUS;
        }
    }

    _createClass(Arrival, [{
        key: "getNextArrivalTime",
        value: function getNextArrivalTime() {
            if (this.estimated) {
                return Date.parse(this.estimated);
            }
            return Date.parse(this.scheduled);
        }
    }, {
        key: "getMinutesUntilArrival",
        value: function getMinutesUntilArrival() {
            var arrivalTime = this.getNextArrivalTime();
            var now = Date.now();
            var diffMs = arrivalTime - now;
            var diffMins = Math.floor(diffMs % 86400000 % 3600000 / 60000); // minutes
            return diffMins;
        }
    }, {
        key: "getTrainSign",
        value: function getTrainSign() {
            return this.shortSign.split(" ")[0];
        }
    }, {
        key: "getBusID",
        value: function getBusID() {
            return this.route;
        }
    }, {
        key: "getArrivalType",
        value: function getArrivalType() {
            return this.arrivalType;
        }
    }]);

    return Arrival;
}();

exports.default = Arrival;