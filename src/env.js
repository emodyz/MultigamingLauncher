'use strict'
exports.__esModule = true
const dotenv_1 = require('dotenv')
const Env = /** @class */ (function () {
  function Env () {
  }
  Env.get = function (key, defaultValue) {
    if (defaultValue === void 0) { defaultValue = null }
    if (this.env[key]) {
      return this.env[key]
    } else {
      return defaultValue
    }
  }
  let _a
  Env.env = (_a = dotenv_1.config().parsed) !== null && _a !== void 0 ? _a : {}
  return Env
}())
exports.default = Env
