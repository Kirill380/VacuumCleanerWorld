"use strict";
import { random } from "underscore";
import $ from "jQuery";

function Trash(options) {
    var images = ["./img/donat.png", "./img/coca-cola.png", "./img/cookie.png"];
    var scene = options.scene;
    var zoom = 0.5;
    var interval = options.interval || 0;
    var id;

    /**
     * Generate trash in random cell with specified periodicity [interval]
     */
    function startGenerate() {
        id = setInterval(function () {
            var coord = scene.getRandomFreeCell();
            var trash = scene.renderCell(getRandomImage(), coord.x, coord.y, zoom);
            trash.transform("r" + random(0, 360));
            trash.attr({class: "trash-item"});
        }, interval);

    }

    function stopGeneration() {
        clearInterval(id);
    }


    /**
     * Randomly generate trash on scene
     */
    function staticGeneration() {
        var times = random(0, 20);
        for (var i = 0; i < times; i++) {
            var coord = scene.getRandomFreeCell();
            var amount = random(0, 7);
            for (var j = 0; j < amount; j++) {
                var trash = scene.renderCell(getRandomImage(), coord.x, coord.y, zoom);
                trash.transform("r" + random(0, 360));
                trash.attr({class: "trash-item"});
            }
        }

    }


    function getRandomImage() {
        return images[random(0, images.length - 1)];
    }

    this.stopGeneration = stopGeneration;
    this.startGenerate = startGenerate;
    this.staticGeneration = staticGeneration;
}

export default Trash;