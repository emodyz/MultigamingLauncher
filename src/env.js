"use strict";
var _a;
exports.__esModule = true;
var dotenv_1 = require("dotenv");
var Env = /** @class */ (function () {
    function Env() {
    }
    Env.get = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        if (this.env[key]) {
            return this.env[key];
        }
        else {
            return defaultValue;
        }
    };
    return Env;
}());
exports["default"] = Env;
console.log('setup env');
Env.env = (_a = dotenv_1.config().parsed) !== null && _a !== void 0 ? _a : {};
