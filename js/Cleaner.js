"use strict";

import { random } from "underscore";
import $ from "jQuery";

function Cleaner(options) {
    var image = options.image || "./img/cat.png";
    var scene = options.scene;
    var keyDriven = options.keyDriven || true;
    var cleaner;
    var energyCounter = 0;
    var runId;


    function render(x, y) {
        cleaner = scene.renderCell(image, x, y);
        cleaner.attr({id: "cleaner" /*tabindex: "0" */});
        if (keyDriven) {
            // TODO refactor find snap.svg API for event handling
            $(document).on("keydown", function (e) {
                switch (e.keyCode) {
                    case 37: // left
                        move(-1, 0);
                        return false;
                    case 38: // up
                        move(0, -1);
                        return false;
                    case 39: // right
                        move(1, 0);
                        return false;
                    case 40: // down
                        move(0, 1);
                        return false;
                    case 67:
                        cleanCell();
                        return false;
                }
            })
        }
    }


    function move(dx, dy) {
        // hack keep top z-index
        cleaner.appendTo(cleaner.paper);
        energyCounter++;
        scene.moveCell(cleaner, dx, dy);
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
            createCleanEvent(i, x, y);
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
                    cleanCell();
                    break;
                case 1: // up
                    move(0, -step);
                    cleanCell();
                    break;
                case 2: // right
                    move(step, 0);
                    cleanCell();
                    break;
                case 3: // down
                    move(0, step);
                    cleanCell();
                    break;
            }
        }, 100);
    }


    function stop() {
        clearInterval(runId);
    }


    // TODO refactor hardcoded value 20 and rename method
    function createCleanEvent(num, x, y) {
        var $div = $("<div></div>").appendTo(".svg-container");
        $div.css("top", y + "px");
        $div.css("left", (x + 20) + "px");
        $div.append("+" + num);
        $div.addClass("clean-event");
        $div.animate({
            opacity: 0,
            top: "-=100"
        }, 2000);
        setTimeout(function () {
            $div.remove();
        }, 2000);
    }

    function getWastedEnergy() {
        return energyCounter;
    }

    this.move = move;
    this.render = render;
    this.getWastedEnergy = getWastedEnergy;
    this.run = run;
    this.stop = stop;
}


export default Cleaner;
