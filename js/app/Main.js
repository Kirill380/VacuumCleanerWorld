"use strict";
import $ from "jquery";
import Snap from "snapsvg";
import Scene from "./Scene.js";
import Cleaner from "./Cleaner.js";
import Trash from "./Trash.js";

var s = Snap("#svg");
var env = new Scene({svg: s});
env.renderScene();
var cln = new Cleaner({scene : env});
cln.render(1, 1);

var gen = new Trash({
    scene : env,
    interval: 200
});


$(document).ready(function() {
    var algorithm = "genetic";
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

    $("#algorithms").change(function(){
        var value = $(this).find("option:selected").val();
        console.log(value);
        algorithm = value;
    });

    $("#trip").on("click", function() {
        cln.goTrip(algorithm);
        localStorage.setItem("getGraphMatrix", JSON.stringify(cln.getGraphMatrix()));

    });

    $("#restart").on("click", function() {
        cln.moveTo(1, 1);
        env.cleanAllTrash();
        gen.restoreLastGeneration();
    });

    setInterval(function() {
        $(".count").text(cln.getWastedEnergy());
        var count = cln.getWastedEnergy();
        localStorage.setItem(algorithm, count);
    }, 100);
});