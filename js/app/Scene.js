"use strict";
import { random, isEmpty } from "underscore";
import $ from "jquery";
import Snap from "snapsvg";


// TODO refactor 5 unit shift coordinate
function Scene(options) {
    var s = options.svg || Snap("#svg");
    var mapNum = options.mapNum || 1;
    var CELL_SIZE = options.cellSize || 60;
    var N = options.sceneSize || 10;
    var SHIFT = 5;
    var map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    var cellStyle = {
        fill: "#bada55",
        stroke: "#000",
        strokeWidth: 3
    };


    var wallStyle = {
        fill: "#777",
        stroke: "#000",
        strokeWidth: 3
    };



    function renderScene() {
        // if map hasn't been already loaded then load
        if (!map) {
            loadMap(mapNum);
        }

        for (var i = 0; i < N; i++) {
            for (var j = 0; j < N; j++) {
                var cell = s.rect(SHIFT + j * CELL_SIZE, SHIFT + i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                cell.attr(isWall(i, j) ? wallStyle : cellStyle);
            }
        }
    }

    // TODO refactor API and method body
    function renderCell(img, x, y, zoom) {
        if (!isWall(y, x)) {
            var size = zoom ? CELL_SIZE * zoom : CELL_SIZE;
            var centerShift = zoom ? CELL_SIZE * (1 - zoom) / 2 : 0;
            return s.image(img, SHIFT + x * CELL_SIZE + centerShift, SHIFT + y * CELL_SIZE + centerShift, size, size);
        }
    }

    // TODO refactor API
    function stepTo(el, dx, dy) {
        var x = el.getBBox().x;
        var y = el.getBBox().y;
        if (isWall(convertToXY(y) + dy, convertToXY(x) + dx) || isGreaterLimit(convertToXY(x) + dx, convertToXY(y) + dy)) {
            var cell = s.select("[x='" + x + "'][y='" + y + "']");
            cell.animate({fill: "red"}, 1000);
            setTimeout(function () {
                cell.animate({fill: "#bada55"}, 1000);
            }, 1000);
            return false;
        }

        el.attr({x: x + dx * CELL_SIZE, y: y + dy * CELL_SIZE});
        return true;
    }

    function moveTo(el, x, y) {
        if (isWall(y, x) || isGreaterLimit(x, y)) {
            return false;
        }
        el.attr({
            x: convertToAbsPos(x),
            y: convertToAbsPos(y)
        });
        return true;
    }

    //TODO refactor zoom
    function getTrashOnCell(x, y) {
        var centerShift = CELL_SIZE * (1 - 0.5) / 2;
        return s.selectAll("[x='" + (x + centerShift) + "'][y='" + (y + centerShift) + "'].trash-item");
    }


    function getAllTrash() {
        var trashArray = [];
        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[0].length; x++) {
                if (!isWall(y, x)) {
                    var trashOnCell = getTrashOnCell(convertToAbsPos(x), convertToAbsPos(y));
                    if (trashOnCell.length != 0) {
                        trashArray.push({
                            count: trashOnCell.length,
                            coord: {x: x, y: y}
                        });
                    }
                }
            }
        }
        return trashArray;
    }

    function isSceneClean() {
        return s.selectAll(".trash-item").length == 0;
    }

    //TODO refactor
    function cleanAllTrash() {
        var trash = s.selectAll(".trash-item");
        trash.forEach(t => t.remove());
    }

    function loadMap(num) {
        $.ajax({
            url: "/map/" + num,
            method: "GET",
            dataType: "json",
            success: function (matrix) {
                map = JSON.parse(matrix);
            },
            error: function (jqXHR, status) {
                console.log("Can't load map: " + status);
            }
        })
    }


    function convertToXY(position) {
        return (position - SHIFT) / CELL_SIZE;
    }

    function convertToAbsPos(coord) {
        return coord * CELL_SIZE + SHIFT
    }

    function isWall(y, x) {
        return map[y][x];
    }


    function getFullMap() {
        return JSON.parse(JSON.stringify(map));
    }

    function isGreaterLimit(x, y) {
        return x > N - 1 || y > N - 1 || x < 0 || y < 0;
    }


    //TODO optimize
    function getRandomFreeCell() {
        var coord = {};
        do {
            coord.x = random(0, N - 1);
            coord.y = random(0, N - 1);
        } while (isWall(coord.y, coord.x));
        return coord;
    }

    this.renderScene = renderScene;
    this.isWall = isWall;
    this.renderCell = renderCell;
    this.stepTo = stepTo;
    this.getRandomFreeCell = getRandomFreeCell;
    this.getTrashOnCell = getTrashOnCell;
    this.isSceneClean = isSceneClean;
    this.cleanAllTrash = cleanAllTrash;
    this.getFullMap = getFullMap;
    this.getAllTrash = getAllTrash;
    this.moveTo = moveTo;
    this.convertToXY = convertToXY;
}

export default Scene;

