import React, { Component } from "react";
import GameContext from "./Context";
import "./Board.css";
import Snake from "./Snake";
class Board extends Component {
  state = {
    rows: "",
    cols: "",
    position: [],
    // position: [{"row":10,"col":15},{"row":11,"col":15},{"row":12,"col":15}]
    //the first element of this array will be the head, the one behind the head will be the second element, and so on.
    matrix: [],
    // matrix : [
    // [null,null,null,6,null], 6 is in first row and fourth column
    // [null,2,null,null,null], 2 is in second row and second column, length of each array will be equal to the width of the board
    // ]
    lastMoveKey: ""
  };

  componentDidMount() {
    const { height, width, blockUnitHeight, blockUnitWidth } = this.context;
    const blockRows = height / blockUnitHeight;
    const blockCols = width / blockUnitWidth;

    const boardArea = height * width;
    const snakeBlockArea = blockUnitHeight * blockUnitWidth;
    const totalBlocks = boardArea / snakeBlockArea;

    let tempArray = [];
    for (let i = 0; i < blockRows; i++) {
      tempArray.push(Array(blockCols).fill(null));
    }

    //matrix array is created
    //we wanna insert {true} wherever snake occupies blocks

    // console.log(tempArray[(blockRows)/2])
    tempArray[blockRows / 2][blockCols / 2] = true;
    tempArray[blockRows / 2 + 1][blockCols / 2] = true;
    tempArray[blockRows / 2 + 2][blockCols / 2] = true;
    tempArray[blockRows / 2 + 3][blockCols / 2] = true;


    this.setState({
      lastMoveKey: 40,
      rows: blockRows - 1, //subtracted one for index purposes
      cols: blockCols - 1,
      position: [
        { row: blockRows / 2, col: blockCols / 2 }, //the first element of this array will be the head
        { row: blockRows / 2 + 1, col: blockCols / 2 },
        { row: blockRows / 2 + 2, col: blockCols / 2 },
        { row: blockRows / 2 + 3, col: blockCols / 2 },
      ],
      matrix: tempArray
    });
  }

  moveSnake = (code, dir) => {
    // this.setState({
    //   lastMoveKey: code
    // });

    let p = this.state.position;
    let m = this.state.matrix;

    switch (dir) {
      case "u":
        console.log("u");
        break;
      case "l":
        console.log("l");
        break;
      case "r":
        console.log("r");

        // let p = this.state.position
        // let obj = {row: p[0].row,col: p[0].col + 1}
        // let m = this.state.matrix
        // m[p[0].row][p[0].col] = null
        // m[p[0].row][p[0].col+1] = true
        // p[0]=obj
        // this.setState({
        //   position:p,
        //   matrix:m
        // })

        break;
      case "d":
        console.log("d");
        break;
      default:
        break;
    }

    // following is in case of r:
    let pc = p.slice();
    p.map((x, i) => {
      if (i === 0) {
        m[p[i].row][p[i].col + 1] = true;

        let obj = { row: pc[i].row, col: pc[i].col + 1 };
        p[0] = obj;
      } else {
        if (i === p.length - 1) {
          m[p[i].row][p[i].col] = null;
        }
        let obj = { row: pc[i - 1].row, col: pc[i - 1].col };
        p[i] = obj;
      }
      this.setState({
        position: p,
        matrix: m
      });
    });

    // setInterval(() => {
    //   console.log("Hello")
    // }, 1000);
  };

  snakeNavigator = e => {
    const key = e.keyCode;
    if (
      key === 37 &&
      this.state.lastMoveKey !== 37 &&
      this.state.lastMoveKey !== 39
    ) {
      console.log("left");
      this.moveSnake(key, "l");
    } else if (
      key === 38 &&
      this.state.lastMoveKey !== 38 &&
      this.state.lastMoveKey !== 40
    ) {
      console.log("up");
      this.moveSnake(key, "u");
    } else if (
      key === 39 &&
      this.state.lastMoveKey !== 39 &&
      this.state.lastMoveKey !== 37
    ) {
      console.log("right");
      this.moveSnake(key, "r");
    } else if (
      key === 40 &&
      this.state.lastMoveKey !== 40 &&
      this.state.lastMoveKey !== 38
    ) {
      console.log("down");
      this.moveSnake(key, "d");
    }
  };

  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "aliceblue",
          display: "flex",
          flexWrap: "wrap",
          position: "absolute"
        }}
        tabIndex="0"
        onKeyDown={this.snakeNavigator}
      >
        {/* {blocks()} */}
        {this.state.matrix.map((_arrayOfRow, j) => {
          return _arrayOfRow.map((block, i) => {
            return (
              <div
                key={i}
                className="block"
                style={{
                  height: this.context.blockUnitHeight,
                  width: this.context.blockUnitWidth,
                  background: block !== null ? "#795548" : "#CDDC39",
                  borderRadius: "3px"
                }}
              >
                {j}
                {i}
              </div>
            );
          });
        })}
        <Snake />
      </div>
    );
  }
}

Board.contextType = GameContext;
export default Board;
