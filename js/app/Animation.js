"use strict";
import $ from "jquery";
// TODO refactor hardcoded value 20 and rename method
export default {
    createCleanEvent: function (num, x, y) {
        var $div = $("<div></div>").appendTo(".svg-container");
        $div.css("top", y + "px");
        $div.css("left", (x + 20) + "px");
        $div.append("+" + num);
        $div.addClass("clean-event");
        $div.animate({
            opacity: 0,
            top: "-=100"
        }, 2000);
        setTimeout(function () { $div.remove(); }, 2000);
    }
}
