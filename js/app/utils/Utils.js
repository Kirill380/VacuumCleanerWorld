"use strict";

export function condRecLoop(index, callback, length) {
    var num = callback(index);
    index++;
    if (index < length) {
        setTimeout(function () {
            condRecLoop(index, callback, length);
        }, 300 * num);
    }
}

export function recursiveLoop(index, callback, length, ms) {
    setTimeout(function () {
        callback(index);
        index++;
        if (index < length) {
            recursiveLoop(index, callback, length, ms);
        }
    }, ms);
}
