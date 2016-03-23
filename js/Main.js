"use strict";
import $ from "jQuery";
import Snap from "snapsvg";
import Environment from "./Environment.js";
import Cleaner from "./Cleaner.js";
import Trash from "./Trash.js";

var s = Snap("#svg");
var env = new Environment({svg: s});
env.renderScene();
var cln = new Cleaner({scene : env});
cln.render(1, 1);

var gen = new Trash({
    scene : env,
    interval: 200
});


$(document).ready(function() {
    $("#start").on("click", function() {
        cln.run();
    });

    $("#stop").on("click", function() {
        cln.stop();
    });

    $("#gen").on("click", function() {
        env.cleanAllTrash();
        gen.staticGeneration();
    });
});