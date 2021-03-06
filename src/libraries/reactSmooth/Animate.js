'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _AnimateManager = require('./AnimateManager');

var _AnimateManager2 = _interopRequireDefault(_AnimateManager);

var _PureRender = require('./PureRender');

var _PureRender2 = _interopRequireDefault(_PureRender);

var _easing = require('./easing');

var _configUpdate = require('./configUpdate');

var _configUpdate2 = _interopRequireDefault(_configUpdate);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Animate = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
  _inherits(Animate, _Component);

  function Animate(props, context) {
    _classCallCheck(this, Animate);

    var _this = _possibleConstructorReturn(this, (Animate.__proto__ || Object.getPrototypeOf(Animate)).call(this, props, context));

    var _this$props = _this.props;
    var isActive = _this$props.isActive;
    var attributeName = _this$props.attributeName;
    var from = _this$props.from;
    var to = _this$props.to;
    var steps = _this$props.steps;
    var children = _this$props.children;


    _this.handleStyleChange = _this.handleStyleChange.bind(_this);
    _this.changeStyle = _this.changeStyle.bind(_this);

    if (!isActive) {
      _this.state = { style: {} };

      // if children is a function and animation is not active, set style to 'to'
      if (typeof children === 'function') {
        _this.state = { style: to };
      }

      return _possibleConstructorReturn(_this);
    }

    if (steps && steps.length) {
      _this.state = { style: steps[0].style };
    } else if (from) {
      if (typeof children === 'function') {
        _this.state = {
          style: from
        };

        return _possibleConstructorReturn(_this);
      }
      _this.state = {
        style: attributeName ? _defineProperty({}, attributeName, from) : from
      };
    } else {
      _this.state = { style: {} };
    }
    return _this;
  }

  _createClass(Animate, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props;
      var isActive = _props.isActive;
      var canBegin = _props.canBegin;


      if (!isActive || !canBegin) {
        return;
      }

      this.runAnimation(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var isActive = nextProps.isActive;
      var canBegin = nextProps.canBegin;
      var attributeName = nextProps.attributeName;
      var shouldReAnimate = nextProps.shouldReAnimate;


      if (!canBegin) {
        return;
      }

      if (!isActive) {
        this.setState({
          style: attributeName ? _defineProperty({}, attributeName, nextProps.to) : nextProps.to
        });

        return;
      }

      var animateProps = ['to', 'canBegin', 'isActive'];

      if ((0, _isEqual3.default)(this.props.to, nextProps.to) && this.props.canBegin && this.props.isActive) {
        return;
      }

      var isTriggered = !this.props.canBegin || !this.props.isActive;

      if (this.manager) {
        this.manager.stop();
      }

      if (this.stopJSAnimation) {
        this.stopJSAnimation();
      }

      var from = isTriggered || shouldReAnimate ? nextProps.from : this.props.to;

      this.setState({
        style: attributeName ? _defineProperty({}, attributeName, from) : from
      });

      this.runAnimation(_extends({}, nextProps, {
        from: from,
        begin: 0
      }));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unSubscribe) {
        this.unSubscribe();
      }

      if (this.manager) {
        this.manager.stop();
        this.manager = null;
      }

      if (this.stopJSAnimation) {
        this.stopJSAnimation();
      }
    }
  }, {
    key: 'runJSAnimation',
    value: function runJSAnimation(props) {
      var _this2 = this;

      var from = props.from;
      var to = props.to;
      var duration = props.duration;
      var easing = props.easing;
      var begin = props.begin;
      var onAnimationEnd = props.onAnimationEnd;
      var onAnimationStart = props.onAnimationStart;

      var startAnimation = (0, _configUpdate2.default)(from, to, (0, _easing.configEasing)(easing), duration, this.changeStyle);

      var finalStartAnimation = function finalStartAnimation() {
        _this2.stopJSAnimation = startAnimation();
      };

      this.manager.start([onAnimationStart, begin, finalStartAnimation, duration, onAnimationEnd]);
    }
  }, {
    key: 'runStepAnimation',
    value: function runStepAnimation(props) {
      var _this3 = this;

      var steps = props.steps;
      var begin = props.begin;
      var onAnimationStart = props.onAnimationStart;
      var _steps$ = steps[0];
      var initialStyle = _steps$.style;
      var _steps$$duration = _steps$.duration;
      var initialTime = _steps$$duration === undefined ? 0 : _steps$$duration;


      var addStyle = function addStyle(sequence, nextItem, index) {
        if (index === 0) {
          return sequence;
        }

        var duration = nextItem.duration;
        var _nextItem$easing = nextItem.easing;
        var easing = _nextItem$easing === undefined ? 'ease' : _nextItem$easing;
        var style = nextItem.style;
        var nextProperties = nextItem.properties;
        var onAnimationEnd = nextItem.onAnimationEnd;


        var preItem = index > 0 ? steps[index - 1] : nextItem;
        var properties = nextProperties || Object.keys(style);

        if (typeof easing === 'function' || easing === 'spring') {
          return [].concat(_toConsumableArray(sequence), [_this3.runJSAnimation.bind(_this3, {
            from: preItem.style,
            to: style,
            duration: duration,
            easing: easing
          }), duration]);
        }

        var transition = (0, _util.getTransitionVal)(properties, duration, easing);
        var newStyle = _extends({}, preItem.style, style, {
          transition: transition
        });

        return [].concat(_toConsumableArray(sequence), [newStyle, duration, onAnimationEnd]).filter(_util.identity);
      };

      return this.manager.start([onAnimationStart].concat(_toConsumableArray(steps.reduce(addStyle, [initialStyle, Math.max(initialTime, begin)])), [props.onAnimationEnd]));
    }
  }, {
    key: 'runAnimation',
    value: function runAnimation(props) {
      if (!this.manager) {
        this.manager = (0, _AnimateManager2.default)();
      }
      var begin = props.begin;
      var duration = props.duration;
      var attributeName = props.attributeName;
      var propsFrom = props.from;
      var propsTo = props.to;
      var easing = props.easing;
      var onAnimationStart = props.onAnimationStart;
      var onAnimationEnd = props.onAnimationEnd;
      var steps = props.steps;
      var children = props.children;


      var manager = this.manager;

      this.unSubscribe = manager.subscribe(this.handleStyleChange);

      if (typeof easing === 'function' || typeof children === 'function' || easing === 'spring') {
        this.runJSAnimation(props);
        return;
      }

      if (steps.length > 1) {
        this.runStepAnimation(props);
        return;
      }

      var to = attributeName ? _defineProperty({}, attributeName, propsTo) : propsTo;
      var transition = (0, _util.getTransitionVal)(Object.keys(to), duration, easing);

      manager.start([onAnimationStart, begin, _extends({}, to, { transition: transition }), duration, onAnimationEnd]);
    }
  }, {
    key: 'handleStyleChange',
    value: function handleStyleChange(style) {
      this.changeStyle(style);
    }
  }, {
    key: 'changeStyle',
    value: function changeStyle(style) {
      this.setState({
        style: style
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var children = _props2.children;
      var begin = _props2.begin;
      var duration = _props2.duration;
      var attributeName = _props2.attributeName;
      var easing = _props2.easing;
      var isActive = _props2.isActive;
      var steps = _props2.steps;
      var from = _props2.from;
      var to = _props2.to;
      var canBegin = _props2.canBegin;
      var onAnimationEnd = _props2.onAnimationEnd;
      var shouldReAnimate = _props2.shouldReAnimate;
      var onAnimationReStart = _props2.onAnimationReStart;

      var others = _objectWithoutProperties(_props2, ['children', 'begin', 'duration', 'attributeName', 'easing', 'isActive', 'steps', 'from', 'to', 'canBegin', 'onAnimationEnd', 'shouldReAnimate', 'onAnimationReStart']);

      var count = _react.Children.count(children);
      var stateStyle = (0, _util.translateStyle)(this.state.style);

      if (typeof children === 'function') {
        return children(stateStyle);
      }

      if (!isActive || count === 0) {
        return children;
      }

      var cloneContainer = function cloneContainer(container) {
        var _container$props = container.props;
        var _container$props$styl = _container$props.style;
        var style = _container$props$styl === undefined ? {} : _container$props$styl;
        var className = _container$props.className;


        var res = (0, _react.cloneElement)(container, _extends({}, others, {
          style: _extends({}, style, stateStyle),
          className: className
        }));
        return res;
      };

      if (count === 1) {
        var onlyChild = _react.Children.only(children);

        return cloneContainer(_react.Children.only(children));
      }

      return _react2.default.createElement(
        'div',
        null,
        _react.Children.map(children, function (child) {
          return cloneContainer(child);
        })
      );
    }
  }]);

  return Animate;
}(_react.Component), _class2.displayName = 'Animate', _class2.propTypes = {
  from: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.string]),
  to: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.string]),
  attributeName: _react.PropTypes.string,
  // animation duration
  duration: _react.PropTypes.number,
  begin: _react.PropTypes.number,
  easing: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  steps: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    duration: _react.PropTypes.number.isRequired,
    style: _react.PropTypes.object.isRequired,
    easing: _react.PropTypes.oneOfType([_react.PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']), _react.PropTypes.func]),
    // transition css properties(dash case), optional
    properties: _react.PropTypes.arrayOf('string'),
    onAnimationEnd: _react.PropTypes.func
  })),
  children: _react.PropTypes.oneOfType([_react.PropTypes.node, _react.PropTypes.func]),
  isActive: _react.PropTypes.bool,
  canBegin: _react.PropTypes.bool,
  onAnimationEnd: _react.PropTypes.func,
  // decide if it should reanimate with initial from style when props change
  shouldReAnimate: _react.PropTypes.bool,
  onAnimationStart: _react.PropTypes.func,
  onAnimationReStart: _react.PropTypes.func
}, _class2.defaultProps = {
  begin: 0,
  duration: 1000,
  from: '',
  to: '',
  attributeName: '',
  easing: 'ease',
  isActive: true,
  canBegin: true,
  steps: [],
  onAnimationEnd: function onAnimationEnd() {},
  onAnimationStart: function onAnimationStart() {}
}, _temp)) || _class;

exports.default = Animate;