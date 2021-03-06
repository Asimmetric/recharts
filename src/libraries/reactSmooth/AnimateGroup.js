'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTransitionGroup = require('react-addons-transition-group');

var _reactAddonsTransitionGroup2 = _interopRequireDefault(_reactAddonsTransitionGroup);

var _AnimateGroupChild = require('./AnimateGroupChild');

var _AnimateGroupChild2 = _interopRequireDefault(_AnimateGroupChild);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AnimateGroup = (_temp = _class = function (_Component) {
  _inherits(AnimateGroup, _Component);

  function AnimateGroup() {
    _classCallCheck(this, AnimateGroup);

    return _possibleConstructorReturn(this, (AnimateGroup.__proto__ || Object.getPrototypeOf(AnimateGroup)).apply(this, arguments));
  }

  _createClass(AnimateGroup, [{
    key: 'wrapChild',
    value: function wrapChild(child) {
      var _props = this.props;
      var appear = _props.appear;
      var leave = _props.leave;
      var enter = _props.enter;


      return _react2.default.createElement(
        _AnimateGroupChild2.default,
        {
          appear: appear,
          leave: leave,
          enter: enter
        },
        child
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var component = _props2.component;
      var children = _props2.children;


      return _react2.default.createElement(
        _reactAddonsTransitionGroup2.default,
        {
          component: component,
          childFactory: this.wrapChild.bind(this)
        },
        children
      );
    }
  }]);

  return AnimateGroup;
}(_react.Component), _class.propTypes = {
  appear: _react.PropTypes.object,
  leave: _react.PropTypes.object,
  enter: _react.PropTypes.object,
  children: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.element]),
  component: _react.PropTypes.any
}, _class.defaultProps = {
  component: 'span'
}, _temp);
exports.default = AnimateGroup;