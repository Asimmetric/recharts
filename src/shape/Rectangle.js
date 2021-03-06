/**
 * @fileOverview Rectangle
 */
import React, { Component, PropTypes } from 'react';
import pureRender from '../util/PureRender';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';
import Smooth from '../libraries/reactSmooth';
import { PRESENTATION_ATTRIBUTES, getPresentationAttributes,
  filterEventAttributes } from '../util/ReactUtils';

const getRectangePath = (x, y, width, height, radius) => {
  const maxRadius = Math.min(width / 2, height / 2);
  let newRadius = [];
  let path;

  if (maxRadius > 0 && radius instanceof Array) {
    for (let i = 0, len = 4; i < len; i++) {
      newRadius[i] = radius[i] > maxRadius ? maxRadius : radius[i];
    }

    path = `M${x},${y + newRadius[0]}`;

    if (newRadius[0] > 0) {
      path += `A ${newRadius[0]},${newRadius[0]},0,0,1,${x + newRadius[0]},${y}`;
    }

    path += `L ${x + width - newRadius[1]},${y}`;

    if (newRadius[1] > 0) {
      path += `A ${newRadius[1]},${newRadius[1]},0,0,1,${x + width},${y + newRadius[1]}`;
    }
    path += `L ${x + width},${y + height - newRadius[2]}`;

    if (newRadius[2] > 0) {
      path += `A ${newRadius[2]},${newRadius[2]},0,0,1,${x + width - newRadius[2]},${y + height}`;
    }
    path += `L ${x + newRadius[3]},${y + height}`;

    if (newRadius[3] > 0) {
      path += `A ${newRadius[3]},${newRadius[3]},0,0,1,${x},${y + height - newRadius[3]}`;
    }
    path += 'Z';

  } else if (maxRadius > 0 && radius === +radius && radius > 0) {
    newRadius = radius > maxRadius ? maxRadius : radius;

    path = `M ${x},${y + newRadius} A ${newRadius},${newRadius},0,0,1,${x + newRadius},${y}
            L ${x + width - newRadius},${y}
            A ${newRadius},${newRadius},0,0,1,${x + width},${y + newRadius}
            L ${x + width},${y + height - newRadius}
            A ${newRadius},${newRadius},0,0,1,${x + width - newRadius},${y + height}
            L ${x + newRadius},${y + height}
            A ${newRadius},${newRadius},0,0,1,${x},${y + height - newRadius} Z`;

  } else {
    path = `M ${x},${y} h ${width} v ${height} h ${-width} Z`;
  }

  return path;
};

@pureRender
class Rectangle extends Component {

  static displayName = 'Rectangle';

  static propTypes = {
    ...PRESENTATION_ATTRIBUTES,
    className: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    radius: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.array,
    ]),
    isAnimationActive: PropTypes.bool,
    isUpdateAnimationActive: PropTypes.bool,
    animationBegin: PropTypes.number,
    animationDuration: PropTypes.number,
    animationEasing: PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']),
    noteHoverStartTime: PropTypes.number,
    invert: PropTypes.bool,
    parentWidth: PropTypes.number,
  };

  static defaultProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    // The radius of border
    // The radius of four corners when radius is a number
    // The radius of left-top, right-top, right-bottom, left-bottom when radius is an array
    radius: 0,
    stroke: 'none',
    strokeWidth: 1,
    strokeDasharray: 'none',
    fill: '#000',
    isAnimationActive: false,
    isUpdateAnimationActive: false,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease',
    invert: false,
  };

  state = {
    totalLength: -1,
  };

  /* eslint-disable  react/no-did-mount-set-state */
  componentDidMount() {
    const path = findDOMNode(this);

    const totalLength = path && path.getTotalLength && path.getTotalLength();

    if (totalLength) {
      this.setState({
        totalLength,
      });
    }
  }

  render() {
    const { x, y, width, height, radius, className, hasEndTimestamp } = this.props;
    const { totalLength } = this.state;
    const { animationEasing, animationDuration, animationBegin,
      isAnimationActive, isUpdateAnimationActive } = this.props;

    if (x !== +x || y !== +y || width !== +width || height !== +height) { return null; }

    const layerClass = classNames('recharts-rectangle', className);

    if (this.props.invert === true) {
      const endX = this.props.parentWidth - (x + width);
      const presentationAttributes = getPresentationAttributes(this.props);
      const eventAttributes = filterEventAttributes(this.props);
      return (
        <g>
          <path
            {...presentationAttributes}
            {...eventAttributes}
            className={layerClass}
            d={getRectangePath(0, 0, x, height, radius)}
          />
        {hasEndTimestamp && <path
            {...presentationAttributes}
            {...eventAttributes}
            className={layerClass}
            d={getRectangePath(x + width, 0, endX, height, radius)}
          />}
        </g>
      );
    }

    return (
      <Smooth
        canBegin={totalLength > 0}
        from={{ width, height, x, y }}
        to={{ width, height, x, y }}
        duration={animationDuration}
        animationEasing={animationEasing}
        isActive={isUpdateAnimationActive}
      >
      {
        ({ width: currWidth, height: currHeight, x: currX, y: currY }) => (
          <Smooth
            canBegin={totalLength > 0}
            from={`0px ${totalLength === -1 ? 1 : totalLength}px`}
            to={`${totalLength}px 0px`}
            attributeName="strokeDasharray"
            begin={animationBegin}
            duration={animationDuration}
            isActive={isAnimationActive}
            easing={animationEasing}
          >
            <path
              {...getPresentationAttributes(this.props)}
              {...filterEventAttributes(this.props)}
              className={layerClass}
              d={getRectangePath(currX, currY, currWidth, currHeight, radius)}
            />
          </Smooth>
        )
      }
      </Smooth>
    );
  }
}

export default Rectangle;
