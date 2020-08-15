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

  render() {
    const { height, width } = this.state;
    return (
      <GameContext.Provider value={this.state}>
        <div
          style={{ display: "flex", justifyContent: "center" }}
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
