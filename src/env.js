"use strict";
exports.__esModule = true;
// eslint-disable-next-line import/default
var dotenv_1 = require("dotenv");
// Setup env
dotenv_1.config();
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
    var _a;
    Env.env = (_a = process.env) !== null && _a !== void 0 ? _a : {};
    return Env;
}());
exports["default"] = Env;
