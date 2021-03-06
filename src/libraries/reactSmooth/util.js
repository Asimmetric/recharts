'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warn = exports.getTransitionVal = exports.compose = exports.translateStyle = exports.mapObject = exports.debugf = exports.debug = exports.log = exports.generatePrefixStyle = exports.getDashCase = exports.identity = exports.getIntersectionKeys = undefined;

var _intersection2 = require('lodash/intersection');

var _intersection3 = _interopRequireDefault(_intersection2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint no-console: 0 */
var PREFIX_LIST = ['Webkit', 'Moz', 'O', 'ms'];
var IN_LINE_PREFIX_LIST = ['-webkit-', '-moz-', '-o-', '-ms-'];
var IN_COMPATIBLE_PROPERTY = ['transform', 'transformOrigin', 'transition'];

var getIntersectionKeys = exports.getIntersectionKeys = function getIntersectionKeys(preObj, nextObj) {
  return (0, _intersection3.default)(Object.keys(preObj), Object.keys(nextObj));
};

var identity = exports.identity = function identity(param) {
  return param;
};

/*
 * @description: convert camel case to dash case
 * string => string
 */
var getDashCase = exports.getDashCase = function getDashCase(name) {
  return name.replace(/([A-Z])/g, function (v) {
    return '-' + v.toLowerCase();
  });
};

/*
 * @description: add compatible style prefix
 * (string, string) => object
 */
var generatePrefixStyle = exports.generatePrefixStyle = function generatePrefixStyle(name, value) {
  if (IN_COMPATIBLE_PROPERTY.indexOf(name) === -1) {
    return _defineProperty({}, name, value);
  }

  var isTransition = name === 'transition';
  var camelName = name.replace(/(\w)/, function (v) {
    return v.toUpperCase();
  });
  var styleVal = value;

  return PREFIX_LIST.reduce(function (result, property, i) {
    if (isTransition) {
      styleVal = value.replace(/(transform|transform-origin)/gim, '-webkit-$1');
    }

    return _extends({}, result, _defineProperty({}, property + camelName, styleVal));
  }, {});
};

var log = exports.log = console.log.bind(console);

/*
 * @description: log the value of a varible
 * string => any => any
 */
var debug = exports.debug = function debug(name) {
  return function (item) {
    log(name, item);

    return item;
  };
};

/*
 * @description: log name, args, return value of a function
 * function => function
 */
var debugf = exports.debugf = function debugf(tag, f) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var res = f.apply(undefined, args);
    var name = tag || f.name || 'anonymous function';
    var argNames = '(' + args.map(JSON.stringify).join(', ') + ')';

    log(name + ': ' + argNames + ' => ' + JSON.stringify(res));

    return res;
  };
};

/*
 * @description: map object on every element in this object.
 * (function, object) => object
 */
var mapObject = exports.mapObject = function mapObject(fn, obj) {
  return Object.keys(obj).reduce(function (res, key) {
    return _extends({}, res, _defineProperty({}, key, fn(key, obj[key])));
  }, {});
};

/*
 * @description: add compatible prefix to style
 * object => object
 */
var translateStyle = exports.translateStyle = function translateStyle(style) {
  return Object.keys(style).reduce(function (res, key) {
    return _extends({}, res, generatePrefixStyle(key, res[key]));
  }, style);
};

var compose = exports.compose = function compose() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  if (!args.length) {
    return identity;
  }

  var fns = args.reverse();
  // first function can receive multiply arguments
  var firstFn = fns[0];
  var tailsFn = fns.slice(1);

  return function () {
    return tailsFn.reduce(function (res, fn) {
      return fn(res);
    }, firstFn.apply(undefined, arguments));
  };
};

var getTransitionVal = exports.getTransitionVal = function getTransitionVal(props, duration, easing) {
  return props.map(function (prop) {
    return getDashCase(prop) + ' ' + duration + 'ms ' + easing;
  }).join(',');
};

var isDev = process.env.NODE_ENV !== 'production';

var warn = exports.warn = function warn(condition, format, a, b, c, d, e, f) {
  if (isDev && typeof console !== 'undefined' && console.warn) {
    if (format === undefined) {
      console.warn('LogUtils requires an error message argument');
    }

    if (!condition) {
      if (format === undefined) {
        console.warn('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
      } else {
        (function () {
          var args = [a, b, c, d, e, f];
          var argIndex = 0;

          console.warn(format.replace(/%s/g, function () {
            return args[argIndex++];
          }));
        })();
      }
    }
  }
};