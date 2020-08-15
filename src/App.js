import React, { Component } from "react";
import Board from "./Board";
import GameContext from "./Context";

const height = 400;
const width = 600;




class App extends Component {
  state = {
    height,
    width,
    blockUnitWidth: width / 30,
    blockUnitHeight: height / 20,
    lastMoveKey: "",
    
  };




  componentDidMount() {
    this.setState({
      // lastMoveKey: Math.floor(Math.random() * 4) + 37
      lastMoveKey: 40
    });
  }

  moveSnake = code => {
    this.setState({
      lastMoveKey: code
    });
  };

  snakeNavigator = e => {
    const key = e.keyCode;
    if (key === 37 && this.state.lastMoveKey !== 37) {
      console.log("left");
      this.moveSnake(key)
    } else if (key === 38 && this.state.lastMoveKey !== 38) {
      console.log("up");
      this.moveSnake(key)
    } else if (key === 39 && this.state.lastMoveKey !== 39) {
      console.log("right");
      this.moveSnake(key)
    } else if (key === 40 && this.state.lastMoveKey !== 40) {
      console.log("down");
      this.moveSnake(key)
    }
  };

  render() {
    const { height, width } = this.state;
    return (
      <GameContext.Provider value={this.state}>
        <div
          style={{ display: "flex", justifyContent: "center" }}
          // tabIndex="0"
          // onKeyDown={this.snakeNavigator}
        >
          <div
            style={{
              width: `${width}px`,
              height: `${height}px`,
              border: "3px dotted black",
              position: "relative"
            }}
          >
            <Board />
          </div>
        </div>
      </GameContext.Provider>
    );
  }
}
export default App;
