'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configEasing = exports.configSpring = exports.configBezier = undefined;

var _util = require('./util');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ACCURACY = 1e-4;

var cubicBezierFactor = function cubicBezierFactor(c1, c2) {
  return [0, 3 * c1, 3 * c2 - 6 * c1, 3 * c1 - 3 * c2 + 1];
};

var multyTime = function multyTime(params, t) {
  return params.map(function (param, i) {
    return param * Math.pow(t, i);
  }).reduce(function (pre, curr) {
    return pre + curr;
  });
};

var cubicBezier = function cubicBezier(c1, c2) {
  return function (t) {
    var params = cubicBezierFactor(c1, c2);

    return multyTime(params, t);
  };
};

var derivativeCubicBezier = function derivativeCubicBezier(c1, c2) {
  return function (t) {
    var params = cubicBezierFactor(c1, c2);
    var newParams = [].concat(_toConsumableArray(params.map(function (param, i) {
      return param * i;
    }).slice(1)), [0]);

    return multyTime(newParams, t);
  };
};

// calculate cubic-bezier using Newton's method
var configBezier = exports.configBezier = function configBezier() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var x1 = args[0];
  var y1 = args[1];
  var x2 = args[2];
  var y2 = args[3];


  if (args.length === 1) {
    switch (args[0]) {
      case 'linear':
        x1 = 0.0;
        y1 = 0.0;
        x2 = 1.0;
        y2 = 1.0;

        break;
      case 'ease':
        x1 = 0.25;
        y1 = 0.1;
        x2 = 0.25;
        y2 = 1.0;

        break;
      case 'ease-in':
        x1 = 0.42;
        y1 = 0.0;
        x2 = 1.0;
        y2 = 1.0;

        break;
      case 'ease-out':
        x1 = 0.42;
        y1 = 0.0;
        x2 = 0.58;
        y2 = 1.0;

        break;
      case 'ease-in-out':
        x1 = 0.0;
        y1 = 0.0;
        x2 = 0.58;
        y2 = 1.0;

        break;
      default:
        (0, _util.warn)(false, '[configBezier]: arguments should be one of ' + 'oneOf \'linear\', \'ease\', \'ease-in\', \'ease-out\', ' + '\'ease-in-out\', instead received %s', args);
    }
  }

  (0, _util.warn)([x1, x2, y1, y2].every(function (num) {
    return typeof num === 'number' && num >= 0 && num <= 1;
  }), '[configBezier]: arguments should be x1, y1, x2, y2 of [0, 1] instead received %s', args);

  var curveX = cubicBezier(x1, x2);
  var curveY = cubicBezier(y1, y2);
  var derCurveX = derivativeCubicBezier(x1, x2);
  var rangeValue = function rangeValue(value) {
    if (value > 1) {
      return 1;
    } else if (value < 0) {
      return 0;
    }

    return value;
  };

  var bezier = function bezier(_t) {
    var t = _t > 1 ? 1 : _t;
    var x = t;

    for (var i = 0; i < 8; ++i) {
      var evalT = curveX(x) - t;
      var derVal = derCurveX(x);

      if (Math.abs(evalT - t) < ACCURACY || derVal < ACCURACY) {
        return curveY(x);
      }

      x = rangeValue(x - evalT / derVal);
    }

    return curveY(x);
  };

  bezier.isStepper = false;

  return bezier;
};

var configSpring = exports.configSpring = function configSpring() {
  var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var _config$stiff = config.stiff;
  var stiff = _config$stiff === undefined ? 100 : _config$stiff;
  var _config$damping = config.damping;
  var damping = _config$damping === undefined ? 8 : _config$damping;
  var _config$dt = config.dt;
  var dt = _config$dt === undefined ? 17 : _config$dt;

  var stepper = function stepper(currX, destX, currV) {
    var FSpring = -(currX - destX) * stiff;
    var FDamping = currV * damping;
    var newV = currV + (FSpring - FDamping) * dt / 1000;
    var newX = currV * dt / 1000 + currX;

    if (Math.abs(newX - destX) < ACCURACY && Math.abs(newV) < ACCURACY) {
      return [destX, 0];
    }
    return [newX, newV];
  };

  stepper.isStepper = true;
  stepper.dt = dt;

  return stepper;
};

var configEasing = exports.configEasing = function configEasing() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var easing = args[0];


  if (typeof easing === 'string') {
    switch (easing) {
      case 'ease':
      case 'ease-int-out':
      case 'ease-out':
      case 'ease-in':
      case 'linear':
        return configBezier(easing);
      case 'spring':
        return configSpring();
      default:
        (0, _util.warn)(false, '[configEasing]: first argument should be one of \'ease\', \'ease-in\', ' + '\'ease-out\', \'ease-in-out\', \'linear\' and \'spring\', instead  received %s', args);
    }
  }

  if (typeof easing === 'function') {
    return easing;
  }

  (0, _util.warn)(false, '[configEasing]: first argument type should be function or ' + 'string, instead received %s', args);

  return null;
};