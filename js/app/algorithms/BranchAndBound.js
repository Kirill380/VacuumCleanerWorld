import Combinatorics from "js-combinatorics";
import {range, without, last, first} from "underscore";

export default function BranchAndBound(pointsMapping, pathDictionary, graphMatrix) {

    function buildTrip() {
        var DEEP = 5;
        var trip = [];
        var startIndex = 0;
        var unpassedPoints = range(0, pointsMapping.length);
        while (unpassedPoints.length > 1) {
            var deep = DEEP < unpassedPoints.length ? DEEP : unpassedPoints.length;
            var comb = Combinatorics.permutation(unpassedPoints, deep).toArray().filter( trip => first(trip) == startIndex);
            var minComb = findMinSubTrip(comb);
            for (var i = 0; i < minComb.length - 1; i++) {
                var startP = pointsMapping[minComb[i]];
                var endP = pointsMapping[minComb[i+1]];
                trip.push(pathDictionary[getId(startP[0], startP[1]) + "#" + getId(endP[0], endP[1])]);
                // remove passed point except last one
                unpassedPoints = without(unpassedPoints, minComb[i]);
            }
            startIndex = last(minComb);
        }

        return trip;

    }

    // return nearest point
    function findMinSubTrip(combTrip) {
        var minTrip = [];
        var minLength = Number.MAX_SAFE_INTEGER;
        for (var i = 0; i < combTrip.length; i++) {
            var subTrip = combTrip[i];
            if (countLength(subTrip) < minLength) {
                minTrip = subTrip;
                minLength = countLength(subTrip);
            }
        }

        return minTrip;
    }

    function countLength(subTrip) {
        var length = 0;
        for (var i = 0; i < subTrip.length - 1; i++) {
            length += graphMatrix[subTrip[i]][subTrip[i + 1]];
        }
        return length;
    }

    function getId(x, y) {
        return x + "|" + y;
    }

    this.buildTrip = buildTrip;
}