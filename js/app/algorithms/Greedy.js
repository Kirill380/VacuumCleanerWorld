import { contains } from "underscore";

export default function Greedy(pointsMapping, pathDictionary,graphMatrix) {
    var passedPoints = [];

    function buildTrip() {
        var trip = [];
        passedPoints = [];
        var counter = 0;
        var startIndex = 0;
        while (counter < pointsMapping.length - 1) {
            passedPoints.push(startIndex);
            var endIndex = findMin(startIndex);
            var startP = pointsMapping[startIndex];
            var endP = pointsMapping[endIndex];
            trip.push(pathDictionary[getId(startP[0], startP[1]) + "#" + getId(endP[0], endP[1])]);
            startIndex = endIndex;
            counter++;
        }

        return trip;
    }

    // return nearest point
    function findMin(pointIndex) {
        var row = graphMatrix[pointIndex];
        var min = Number.MAX_SAFE_INTEGER;
        var minIndex = 0;
        for (var i = 0; i < row.length; i++) {
            if (row[i] < min && !contains(passedPoints, i)) {
                min = row[i];
                minIndex = i;
            }
        }
        return minIndex;
    }

    function getId(x, y) {
        return x + "|" + y;
    }

    this.buildTrip = buildTrip;
}