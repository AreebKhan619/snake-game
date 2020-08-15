import React, { Component } from "react";
import GameContext from "./Context";
import "./Board.css";
// import Snake from "./Snake";
class Board extends Component {
 constructor(props){
   super(props)
   this.gameRef = React.createRef()
   this.state = {
    rows: "",
    cols: "",
    intervalKey: 0,
    position: [],
    // position: [{"row":10,"col":15},{"row":11,"col":15},{"row":12,"col":15}]
    //the first element of this array will be the head, the one behind the head will be the second element, and so on.
    matrix: [],
    // matrix : [
    // [null,null,null,6,null], 6 is in first row and fourth column
    // [null,2,null,null,null], 2 is in second row and second column, length of each array will be equal to the width of the board
    // ]
    lastMoveKey: "",
    isGameOver: false,
    berry: {
      row: '',
      col: ''
    }
  };
 }

  componentDidMount() {
    this.startOver();
    this.snakeNavigator(38);
  }

  startOver = () => {
    const { height, width, blockUnitHeight, blockUnitWidth } = this.context;
    const blockRows = height / blockUnitHeight;
    const blockCols = width / blockUnitWidth;

    let tempArray = [];
    for (let i = 0; i < blockRows; i++) {
      tempArray.push(Array(blockCols).fill(null));
    }

    // console.log(tempArray[(blockRows)/2])
    tempArray[blockRows / 2][blockCols / 2] = true;
    tempArray[blockRows / 2 + 1][blockCols / 2] = true;
    tempArray[blockRows / 2 + 2][blockCols / 2] = true;
    tempArray[blockRows / 2 + 3][blockCols / 2] = true;

    let pos = [
      { row: blockRows / 2, col: blockCols / 2 }, //the first element of this array will be the head
      { row: blockRows / 2 + 1, col: blockCols / 2 },
      { row: blockRows / 2 + 2, col: blockCols / 2 },
      { row: blockRows / 2 + 3, col: blockCols / 2 }
    ];

    this.setState({
      rows: blockRows - 1, //subtracted one for index purposes
      cols: blockCols - 1,
      position: pos,
      isGameOver: false,
      lastMoveKey: "",
      intervalKey: ""
      // matrix: tempArray
    });

    this.insertBerry(blockRows - 1, blockCols - 1, pos, tempArray);
    // this.snakeNavigator(38)
    this.gameRef.current.focus()
    // console.log(ReactDOM.findDOMNode(this.refs.game))
  };

  isBerryEaten = (p = this.state.position) => {
    const b = this.state.berry;
    if (p[0].row === b.row && p[0].col === b.col) {
      return true;
    } else {
      return false;
    }
  };

  insertBerry = (
    ur = this.state.rows,
    uc = this.state.cols,
    p = this.state.position,
    m = this.state.matrix
  ) => {
    let rowForBerry = this.randomNum(0, ur);
    let colForBerry = this.randomNum(0, uc);
    // console.log(rowForBerry,colForBerry)
    // console.log(p)

    let t = p.filter(_snakeBlock => {
      return _snakeBlock.row === rowForBerry && _snakeBlock.col === colForBerry;
    });
    if (t.length > 0) {
      rowForBerry = this.randomNum(0, ur);
      colForBerry = this.randomNum(0, uc);
    }
    let _m = m.slice();
    _m[rowForBerry][colForBerry] = "berry";
    this.setState({
      matrix: _m,
      berry: {
        row: rowForBerry,
        col: colForBerry
      }
    });
  };

  randomNum = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  eatYourselfCheck = _positionArray => {
    const head = _positionArray[0];

    let t = _positionArray.filter(x => {
      return x.col === head.col && x.row === head.row;
    });

    // console.log(t.length>1)
    return t.length > 1;
  };

  moveSnake = (code = 38, dir) => {
    this.setState({
      lastMoveKey: code
    });

    let p = this.state.position;
    let m = this.state.matrix;
    let pc = p.slice();
    // console.log(dir);

    if (dir === "u" || dir === "d") {
      if (
        (dir === "u" && this.state.position[0].row === 0) ||
        (dir === "d" && this.state.position[0].row === this.state.rows)
      ) {
        // console.log("out of bounds u&d");
        this.setState({
          isGameOver: true
        });
        clearInterval(this.state.intervalKey);
      } else {
        var obj;

        p.map((x, i) => {
          if (i === 0) {
            if (dir === "u") {
              m[p[i].row - 1][p[i].col] = true;
              obj = { row: pc[i].row - 1, col: pc[i].col };
            } else {
              m[p[i].row + 1][p[i].col] = true;
              obj = { row: pc[i].row + 1, col: pc[i].col };
            }
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
        // console.log(this.eatYourselfCheck(p))
        if (this.eatYourselfCheck(p)) {
          this.setState({
            isGameOver: true
          });
          clearInterval(this.state.intervalKey);
        }
        if (this.isBerryEaten(p)) {
          this.insertBerry(undefined, undefined, p, m);
          this.increaseSnakeLength();
        }
      }
    } else if (dir === "l" || dir === "r") {
      if (
        (dir === "l" && this.state.position[0].col === 0) ||
        (dir === "r" && this.state.position[0].col === this.state.cols)
      ) {
        // console.log("out of bounds r&l");
        this.setState({
          isGameOver: true
        });
        clearInterval(this.state.intervalKey);
      } else {
        // following is in case of r:
        p.map((x, i) => {
          if (i === 0) {
            var obj;
            if (dir === "r") {
              m[p[i].row][p[i].col + 1] = true;
              obj = { row: pc[i].row, col: pc[i].col + 1 };
            } else {
              m[p[i].row][p[i].col - 1] = true;

              obj = { row: pc[i].row, col: pc[i].col - 1 };
            }

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
        if (this.eatYourselfCheck(p)) {
          this.setState({
            isGameOver: true
          });
          clearInterval(this.state.intervalKey);
        }
        if (this.isBerryEaten(p)) {
          this.insertBerry(undefined, undefined, p, m);
          this.increaseSnakeLength();
        }
      }
    }
  };

  snakeNavigator = key => {
    const interval = 200;

    if (
      key === 37 &&
      this.state.lastMoveKey !== 37 &&
      this.state.lastMoveKey !== 39
    ) {
      // console.log("left");
      clearInterval(this.state.intervalKey);
      let t = setInterval(() => {
        this.moveSnake(key, "l");
        console.log("left");
      }, interval);

      this.setState({
        intervalKey: t
      });
    } else if (
      key === 38 &&
      this.state.lastMoveKey !== 38 &&
      this.state.lastMoveKey !== 40
    ) {
      // console.log("up");
      clearInterval(this.state.intervalKey);

      let t = setInterval(() => {
        this.moveSnake(key, "u");
        console.log("up");
      }, interval);

      this.setState({
        intervalKey: t
      });
    } else if (
      key === 39 &&
      this.state.lastMoveKey !== 39 &&
      this.state.lastMoveKey !== 37
    ) {
      // console.log("right");
      clearInterval(this.state.intervalKey);

      let t = setInterval(() => {
        this.moveSnake(key, "r");
        console.log("right");
      }, interval);

      this.setState({
        intervalKey: t
      });
    } else if (
      key === 40 &&
      this.state.lastMoveKey !== 40 &&
      this.state.lastMoveKey !== 38
    ) {
      // console.log("down");
      clearInterval(this.state.intervalKey);

      let t = setInterval(() => {
        this.moveSnake(key, "d");
        console.log("down");
      }, interval);

      this.setState({
        intervalKey: t
      });
    }
  };

  increaseSnakeLength = () => {
    const t = this.state.position.slice().reverse();
    // console.log(this.state.position.slice(-1)[0])
    const last = t[0];
    const secondLast = t[1];

    console.log(last, secondLast);
    let p = this.state.position.slice();
    let m = this.state.matrix;

    if (last.row > secondLast.row) {
      // that means the snake is facing upwards
      p.push({
        col: t[0].col,
        row: t[0].row + 1
      });
      m[t[0].row + 1][t[0].col] = true;
    } else if (last.row < secondLast.row) {
      p.push({
        col: t[0].col,
        row: t[0].row - 1
      });
      m[t[0].row - 1][t[0].col] = true;
    } else if (last.col > secondLast.col) {
      p.push({
        col: t[0].col + 1,
        row: t[0].row
      });
      m[t[0].row][t[0].col + 1] = true;
    } else if (last.col < secondLast.col) {
      p.push({
        col: t[0].col - 1,
        row: t[0].row
      });
      m[t[0].row][t[0].col - 1] = true;
    }

    this.setState({
      position: p,
      matrix: m
    });
  };

  render() {
    return (
      <>
        <div
          ref={this.gameRef}
          style={{
            width: "100%",
            height: "100%",
            background: "aliceblue",
            display: "flex",
            flexWrap: "wrap",
            position: "absolute",
            filter: this.state.isGameOver ? "blur(5px)" : ""
          }}
          tabIndex="0"
          onKeyDown={e => this.snakeNavigator(e.keyCode)}
        >
          {/* {blocks()} */}
          {this.state.matrix.map((_arrayOfRow, j) => {
            return _arrayOfRow.map((block, i) => {
              return (
                <div
                  key={i}
                  // className="block"
                  className={
                    `block ` +
                    (block === null ? `` : block === true ? `active` : `berry`)
                  }
                  style={{
                    height: this.context.blockUnitHeight,
                    width: this.context.blockUnitWidth
                  }}
                >
                  {/* {j}
                {i} */}
                </div>
              );
            });
          })}
          {/* <Snake /> */}
        </div>

        {this.state.isGameOver && (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#ffffff8a",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              zIndex: "3"
            }}
          >
            Game over!
            <button
              onClick={() => {
                this.startOver();
                this.snakeNavigator(38);
              }}
            >
              Start Over
            </button>
          </div>
        )}

        {/* <button style={{position: 'absolute',bottom: '-35px'}} onClick={this.increaseSnakeLength}>Increase Length</button>
      <button style={{position: 'absolute',bottom: '-55px'}} onClick={this.eatYourselfCheck}>Eat Yourself Check</button>
      <button style={{position: 'absolute',bottom: '-85px'}} onClick={()=>this.insertBerry(undefined,undefined,undefined)}>Berry</button> */}
      </>
    );
  }
}

Board.contextType = GameContext;
export default Board;
