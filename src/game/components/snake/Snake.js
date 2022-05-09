import React, { Component } from "react";
import GameContext from "../../context";
import "./Board.css";
class Snake extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastMoveKey: 40
    };
  }

  mover = (_blockid, i, code) => {
    if (code === 37) {
      document.getElementById(_blockid).style.transform = "translateX(-30px)";
    } else if (code === 38) {
      document.getElementById(_blockid).style.transform = "translateY(-30px)";
    } else if (code === 39) {
      document.getElementById(_blockid).style.transform = "translateX(30px)";
    } else if (code === 40) {
      document.getElementById(_blockid).style.transform = "translateY(30px)";
    }
  };

  moveSnake = code => {
    this.setState({
      lastMoveKey: code
    });
    setInterval(() => {
      this.mover("block0", 0, code);
    }, 0);
    setInterval(() => {
      this.mover("block1", 1, code);
    }, 100);
  };

  snakeNavigator = e => {
    const key = e.keyCode;
    if (key === 37 && this.state.lastMoveKey !== 37) {
      console.log("left");
      this.moveSnake(key);
    } else if (key === 38 && this.state.lastMoveKey !== 38) {
      console.log("up");
      this.moveSnake(key);
    } else if (key === 39 && this.state.lastMoveKey !== 39) {
      console.log("right");
      this.moveSnake(key);
    } else if (key === 40 && this.state.lastMoveKey !== 40) {
      console.log("down");
      this.moveSnake(key);
    }
  };

  render() {
    return (
      <div tabIndex="0" onKeyDown={this.snakeNavigator}>
        {/* Hello World */}
        <div
          id="block0"
          style={{ height: "50px", width: "50px", background: "green" }}
        ></div>
        <div
          id="block1"
          style={{ height: "50px", width: "50px", background: "red" }}
        ></div>
      </div>
    );
  }
}

Snake.contextType = GameContext;
export default Snake;
