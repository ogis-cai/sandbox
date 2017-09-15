import React from 'react';
import {Motion, spring} from 'react-motion';
import R from 'ramda';
import range from 'lodash.range';

import './DraggableList.css';

function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function overRow(items, mouseY) {
  let offset = 0;
  for (let i = 0; i < items.length; i++) {
    if (mouseY < offset + items[i].height / 2) {
      return i;
    }
    offset = offset + items[i].height;
  }
  return items.length - 1;
}

const springConfig = {stiffness: 300, damping: 50};

export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topDeltaY: 0,
      mouseY: 0,
      isPressed: false,
      originalItemOfLastPressed: 0,
      items: [
        { id: 1, height: 100, text: 'A', },
        { id: 2, height: 100, text: 'B', },
        { id: 3, height: 100, text: 'C', },
        { id: 4, height: 200, text: 'D', },
      ]
    };
  };

  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  calculateOffset = i => {
    const { items } = this.state;
    return R.pipe(
      R.slice(0, i),
      R.pluck('height'),
      R.sum
    )(items);
  }

  handleTouchStart = (key, pressLocation, e) => {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  };

  handleTouchMove = (e) => {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  };

  handleMouseDown = (id, pressY, {pageY}) => {
    this.setState({
      topDeltaY: pageY - pressY,
      mouseY: pressY,
      isPressed: true,
      originalItemOfLastPressed: id,
    });
  };

  handleMouseMove = ({pageY}) => {
    const {isPressed, topDeltaY, originalItemOfLastPressed, items} = this.state;
    const itemsCount = items.length;
    if (isPressed) {
      const mouseY = pageY - topDeltaY;
      const currentRow = overRow(items, mouseY);
      let newItems = items;

      const lastPressedRow = items.findIndex(item => item.id === originalItemOfLastPressed);

      if (currentRow !== lastPressedRow){
        newItems = reinsert(items, lastPressedRow, currentRow);
      }

      this.setState({mouseY: mouseY, items: newItems});
    }
  };

  handleMouseUp = () => {
    this.setState({isPressed: false, topDeltaY: 0});
  };

  render() {
    const {mouseY, isPressed, originalItemOfLastPressed, items} = this.state;

    return (
      <div className="demo8">
        {items.map((item, i) => {
          const style = (originalItemOfLastPressed === item.id) && isPressed
            ? {
                scale: spring(1.1, springConfig),
                shadow: spring(16, springConfig),
                y: mouseY,
              }
            : {
                scale: spring(1, springConfig),
                shadow: spring(1, springConfig),
                y: spring(this.calculateOffset(i), springConfig),
              };
          return (
            <Motion style={style} key={i}>
              {({scale, shadow, y}) =>
                <div
                  onMouseDown={this.handleMouseDown.bind(null, item.id, y)}
                  onTouchStart={this.handleTouchStart.bind(null, item.id, y)}
                  className="demo8-item"
                  style={{
                    boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                    transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                    WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                    zIndex: item.id === originalItemOfLastPressed ? 99 : i,
                    height: item.height - 10
                  }}>
                  {item.text}
                </div>
              }
            </Motion>
          );
        })}
      </div>
    );
  };
}