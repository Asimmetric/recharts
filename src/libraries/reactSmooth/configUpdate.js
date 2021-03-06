'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var alpha = function alpha(begin, end, k) {
  return begin + (end - begin) * k;
};
var needContinue = function needContinue(_ref) {
  var from = _ref.from;
  var to = _ref.to;
  return from !== to;
};

/*
 * @description: cal new from value and velocity in each stepper
 * @return: { [styleProperty]: { from, to, velocity } }
 */
var calStepperVals = function calStepperVals(easing, preVals, steps) {
  var nextStepVals = (0, _util.mapObject)(function (key, val) {
    if (needContinue(val)) {
      var _easing = easing(val.from, val.to, val.velocity);

      var _easing2 = _slicedToArray(_easing, 2);

      var newX = _easing2[0];
      var newV = _easing2[1];

      return _extends({}, val, {
        from: newX,
        velocity: newV
      });
    }

    return val;
  }, preVals);

  if (steps < 1) {
    return (0, _util.mapObject)(function (key, val) {
      if (needContinue(val)) {
        return _extends({}, val, {
          velocity: alpha(val.velocity, nextStepVals[key].velocity, steps),
          from: alpha(val.from, nextStepVals[key].from, steps)
        });
      }

      return val;
    }, preVals);
  }

  return calStepperVals(easing, nextStepVals, steps - 1);
};

// configure update function

exports.default = function (from, to, easing, duration, render) {
  var interKeys = (0, _util.getIntersectionKeys)(from, to);
  var timingStyle = interKeys.reduce(function (res, key) {
    return _extends({}, res, _defineProperty({}, key, [from[key], to[key]]));
  }, {});

  var stepperStyle = interKeys.reduce(function (res, key) {
    return _extends({}, res, _defineProperty({}, key, {
      from: from[key],
      velocity: 0,
      to: to[key]
    }));
  }, {});
  var cafId = -1;
  var preTime = void 0;
  var beginTime = void 0;
  var update = function update() {
    return null;
  };

  var getCurrStyle = function getCurrStyle() {
    return (0, _util.mapObject)(function (key, val) {
      return val.from;
    }, stepperStyle);
  };
  var shouldStopAnimation = function shouldStopAnimation() {
    return !(0, _filter3.default)(stepperStyle, needContinue).length;
  };

  // stepper timing function like spring
  var stepperUpdate = function stepperUpdate(now) {
    if (!preTime) {
      preTime = now;
    }
    var deltaTime = now - preTime;
    var steps = deltaTime / easing.dt;

    stepperStyle = calStepperVals(easing, stepperStyle, steps);
    // get union set and add compatible prefix
    render(_extends({}, from, to, getCurrStyle(stepperStyle)));

    preTime = now;

    if (!shouldStopAnimation()) {
      cafId = (0, _raf2.default)(update);
    }
  };

  // t => val timing function like cubic-bezier
  var timingUpdate = function timingUpdate(now) {
    if (!beginTime) {
      beginTime = now;
    }

    var t = (now - beginTime) / duration;
    var currStyle = (0, _util.mapObject)(function (key, val) {
      return alpha.apply(undefined, _toConsumableArray(val).concat([easing(t)]));
    }, timingStyle);

    // get union set and add compatible prefix
    render(_extends({}, from, to, currStyle));

    if (t < 1) {
      cafId = (0, _raf2.default)(update);
    }
  };

  update = easing.isStepper ? stepperUpdate : timingUpdate;

  // return start animation method
  return function () {
    (0, _raf2.default)(update);

    // return stop animation method
    return function () {
      (0, _raf.cancel)(cafId);
    };
  };
};