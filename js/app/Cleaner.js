"use strict";
import { random, isObject, contains } from "underscore";
import $ from "jQuery";
import animation from "./Animation.js";
import evolve from "../vendor/EvolveJS.js";
import PF from "pathfinding";
import {condRecLoop, recursiveLoop} from "./utils/Utils.js";
import Greedy from "./algorithms/Greedy.js";
import Genetic from "./algorithms/Genetic.js";
import BranchAndBound from "./algorithms/BranchAndBound.js";

function Cleaner(options) {
    var image = options.image || "./img/cat.png";
    var scene = options.scene;
    var keyDriven = options.keyDriven || true;
    var cleaner;
    var energyCounter = 0;
    var runId;
    var graphMatrix = [];
    /*
     * 1#2 => (1,2) -> (2, 1) -> (3, 1)
     * */
    var pathDictionary = {};
    /*
     * Contains init position and positions of trash
     * */
    var pointsMapping = [];
    var trip = [];
    var algorithms = {};


    function render(x, y) {
        cleaner = scene.renderCell(image, x, y);
        cleaner.attr({id: "cleaner" /*tabindex: "0" */});
        if (keyDriven) {
            $(document).on("keydown", function (e) {
                switch (e.keyCode) {
                    case 37: // left
                        move(-1, 0);
                        break;
                    case 38: // up
                        move(0, -1);
                        break;
                    case 39: // right
                        move(1, 0);
                        break;
                    case 40: // down
                        move(0, 1);
                        break;
                    case 67: // press C
                        cleanCell();
                        break;
                }
                return false;
            })
        }
    }

    function move(dx, dy) {
        // hack keep top z-index
        cleaner.appendTo(cleaner.paper);
        energyCounter++;
        scene.stepTo(cleaner, dx, dy);
    }

    function moveTo(x, y) {
        // hack keep top z-index
        cleaner.appendTo(cleaner.paper);
        energyCounter++;
        scene.moveTo(cleaner, x, y);
    }


    function cleanCell() {
        var x = cleaner.getBBox().x;
        var y = cleaner.getBBox().y;
        var trash = scene.getTrashOnCell(x, y);
        for (var i = 0; i < trash.length; i++) {
            if (i < 10)
                trash[i].remove();
            else
                break;
        }

        if (i) {
            energyCounter += 2;
            animation.createCleanEvent(i, x, y);
        }

    }

    function run() {
        cleanCell();
        runId = setInterval(function () {
            if (scene.isSceneClean()) {
                stop();
                return;
            }
            var step = random(1, 3);
            switch (random(0, 3)) {
                case 0: // left
                    move(-step, 0);
                    break;
                case 1: // up
                    move(0, -step);
                    break;
                case 2: // right
                    move(step, 0);
                    break;
                case 3: // down
                    move(0, step);
                    break;
            }
            cleanCell();
        }, 100);
    }

    function stop() {
        clearInterval(runId);
    }

    function getWastedEnergy() {
        return energyCounter;
    }

    function goTrip(name) {
        energyCounter = 0;
        convertMapToGraphMatrix();
        trip = algorithms[name].buildTrip();
        condRecLoop(0, function (i) {
            var path = trip[i];
            (function (row) {
                recursiveLoop(0, function (index) {
                    var cell = row[index];
                    moveTo(cell[0], cell[1]);
                    if (index == row.length - 1) {
                        cleanCell();
                    }
                }, row.length, 300);
            })(path);

            return path.length;
        }, trip.length);

    }

    function convertMapToGraphMatrix() {
        // clear
        graphMatrix = [];
        pathDictionary = {};
        pointsMapping = [];
        var initCoords = getInitCoords();
        var map = scene.getFullMap();
        var trashes = scene.getAllTrash();
        var grid = new PF.Grid(map);
        var gridBackup = grid.clone();
        var finder = new PF.AStarFinder();
        for (var i = 0; i < trashes.length + 1; i++) {
            var point = (i == 0) ? initCoords : (trashes[i - 1].coord);
            // i = 0 - position of cleaner
            pointsMapping[i] = [point.x, point.y];
            if (!graphMatrix[i])
                graphMatrix[i] = [];
            for (var j = 0; j < trashes.length + 1; j++) {
                var from = (i == 0) ? initCoords : trashes[i - 1].coord;
                var to = (j == 0) ? initCoords : trashes[j - 1].coord;
                var path = finder.findPath(from.x, from.y, to.x, to.y, grid);
                graphMatrix[i].push(path.length);
                pathDictionary[getId(from.x, from.y) + "#" + getId(to.x, to.y)] = path;
                // refresh grid
                grid = gridBackup.clone();
            }
        }
        algorithms["greedy"] = new Greedy(pointsMapping, pathDictionary, graphMatrix);
        algorithms["genetic"] = new Genetic(pointsMapping, pathDictionary, graphMatrix);
        algorithms["branch_bound"] = new BranchAndBound(pointsMapping, pathDictionary, graphMatrix);
    }


    function getId(x, y) {
        return x + "|" + y;
    }


    function getInitCoords() {
        var x = cleaner.getBBox().x;
        var y = cleaner.getBBox().y;
        return {
            x: scene.convertToXY(x),
            y: scene.convertToXY(y)
        }
    }

    function getGraphMatrix() {
        return graphMatrix;
    }

    this.move = move;
    this.moveTo = moveTo;
    this.render = render;
    this.getWastedEnergy = getWastedEnergy;
    this.run = run;
    this.stop = stop;
    this.goTrip = goTrip;
    this.getGraphMatrix = getGraphMatrix;

}

export default Cleaner;
