'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Animate = require('./Animate');

var _Animate2 = _interopRequireDefault(_Animate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AnimateGroupChild = (_temp2 = _class = function (_Component) {
  _inherits(AnimateGroupChild, _Component);

  function AnimateGroupChild() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AnimateGroupChild);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AnimateGroupChild.__proto__ || Object.getPrototypeOf(AnimateGroupChild)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      isActive: false
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AnimateGroupChild, [{
    key: 'handleStyleActive',
    value: function handleStyleActive(style, done) {
      if (style) {
        var onAnimationEnd = style.onAnimationEnd ? function () {
          style.onAnimationEnd();
          done();
        } : done;

        this.setState(_extends({}, style, {
          onAnimationEnd: onAnimationEnd,
          isActive: true
        }));
      } else {
        done();
      }
    }
  }, {
    key: 'componentWillAppear',
    value: function componentWillAppear(done) {
      this.handleStyleActive(this.props.appear, done);
    }
  }, {
    key: 'componentWillEnter',
    value: function componentWillEnter(done) {
      this.handleStyleActive(this.props.enter, done);
    }
  }, {
    key: 'componentWillLeave',
    value: function componentWillLeave(done) {
      this.handleStyleActive(this.props.leave, done);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _Animate2.default,
        this.state,
        _react.Children.only(this.props.children)
      );
    }
  }]);

  return AnimateGroupChild;
}(_react.Component), _class.propTypes = {
  appear: _react.PropTypes.object,
  leave: _react.PropTypes.object,
  enter: _react.PropTypes.object,
  children: _react.PropTypes.element
}, _temp2);
exports.default = AnimateGroupChild;