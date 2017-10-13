"use strict";
import { random } from "underscore";
import $ from "jquery";

function Trash(options) {
    var images = ["./img/donat.png", "./img/coca-cola.png", "./img/cookie.png"];
    var scene = options.scene;
    var zoom = 0.5;
    var interval = options.interval || 0;
    var id;
    var lastGeneration = [];


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
        lastGeneration = [];
        for (var i = 0; i < times; i++) {
            var coord = scene.getRandomFreeCell();
            var amount = random(0, 7);
            (function(c, a, i, r) {
                lastGeneration.push({
                    coord: c,
                    amount: a,
                    image: getRandomImage(),
                    rotation:  random(0, 360)
                });
            })(coord, amount);
            for (var j = 0; j < amount; j++) {
                var rotation = random(0, 360);
                var image = getRandomImage();
                var trash = scene.renderCell(image, coord.x, coord.y, zoom);
                trash.transform("r" + rotation);
                trash.attr({class: "trash-item"});
            }
        }

    }

    function restoreLastGeneration() {
        for (var i = 0; i < lastGeneration.length; i++) {
            var trashItem = lastGeneration[i];
            for (var j = 0; j < trashItem.amount; j++) {
                var trash = scene.renderCell(trashItem.image, trashItem.coord.x, trashItem.coord.y, zoom);
                trash.transform("r" + trashItem.rotation);
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
    this.restoreLastGeneration = restoreLastGeneration;
}

export default Trash;