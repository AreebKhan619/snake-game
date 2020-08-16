import React, { Component } from "react";
import GameContext from "./Context";
import "./Board.css";
// import Snake from "./Snake";
class Board extends Component {
  constructor(props) {
    super(props);
    this.gameRef = React.createRef();
    this.state = {
      rows: "",
      cols: "",
      intervalKey: 0,
      position: [],
      // position: [285,315,345]
      //the first element of this array will be the head's location in the matrix index, the one behind the head will be of second element's, and so on.
      matrix: [],
      // matrix : [
      // null, null, null, null, true, null, true, null, null
      // ]
      // we have the number of rows, number of columns, number of blocks in rows and number of blocks in columns.
      direction: "",
      isGameOver: false,
      berry: ""
    };
  }

  componentDidMount() {
    const { height, width, blockUnitHeight, blockUnitWidth } = this.context;
    const blockRows = height / blockUnitHeight;
    const blockCols = width / blockUnitWidth;
    // this.setState({blocks:{row:blockRows,col:blockCols}})

    this.setState({
      rows: blockRows - 1, //subtracted one for index purposes
      cols: blockCols - 1
    });
    this.startOver(blockRows, blockCols);
    // this.snakeNavigator(38);
  }

  startOver = (
    blockRows = this.state.rows + 1,
    blockCols = this.state.cols + 1
  ) => {
    const multiple = blockRows * blockCols;
    let tempArray = Array(multiple).fill(null);

    // snake head in the middle
    // for a 30x20 matrix, it will be 15x10
    // general formula = (width of grid * (x location)) + (y location)
    // center (head of the snake) will be at 30w*20h will be at 30*(10-1) + 30/2 = 285

    const _locationOfHead = blockCols * (blockRows / 2 - 1) + blockCols / 2;
    const _locationOfSecond = blockCols * (blockRows / 2) + blockCols / 2;
    const _locationOfThird = blockCols * (blockRows / 2 + 1) + blockCols / 2;

    const _locationOfFourth = blockCols * (blockRows / 2 + 2) + blockCols / 2;

    tempArray[_locationOfHead] = true;
    tempArray[_locationOfSecond] = true;
    tempArray[_locationOfThird] = true;
    tempArray[_locationOfFourth] = true;

    let pos = [
      _locationOfHead,
      _locationOfSecond,
      _locationOfThird,
      _locationOfFourth
    ];

    this.insertBerry(multiple, pos, tempArray);
    this.snakeNavigator(38)
    this.gameRef.current.focus();

    this.setState({
      isGameOver: false,
      // intervalKey: "",
      // direction: "",
      position: pos,
      matrix: tempArray
    });
  };

  isBerryEaten = (p = this.state.position) => {
    const b = this.state.berry;
    if (p[0] === b) {
      return true;
    } else {
      return false;
    }
  };

  insertBerry = (prod, p = this.state.position, m = this.state.matrix) => {
    let locationForBerry = this.randomNum(0, prod);

    if (p.includes(locationForBerry)) {
      locationForBerry = this.randomNum(0, prod);
      // failing logic what if the berry appears again?
    }

    m[locationForBerry] = "berry";

    this.setState({
      matrix: m,
      berry: locationForBerry
    });
  };

  randomNum = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  eatYourselfCheck = _positionArray => {
    const head = _positionArray[0];

    let b = _positionArray.slice(1);

    // console.log(t.length>1)
    return !(b.indexOf(head) < 0);
  };

  moveSnake = dir => {
    const multiple = (this.state.rows + 1) * (this.state.cols + 1);
    let p = this.state.position;
    let m = this.state.matrix;
    let r = this.state.rows + 1;
    let w = this.state.cols + 1; //width
    let pc = p.slice();
    // console.log(dir);

    console.log(w);

    if (dir === "u" || dir === "d") {
      if (
        (dir === "u" && this.state.position[0] < w) ||
        (dir === "d" && this.state.position[0] > multiple - w - 1)
      ) {
        // console.log("out of bounds u&d");
        
        clearInterval(this.state.intervalKey);
        this.setState({
          isGameOver: true,
          intervalKey:""
        });
      } else {
        p.map((x, i) => {
          if (i === 0) {
            if (dir === "u") {
              m[p[i] - w] = true;
              p[i] = pc[i] - w;
            } else {
              m[p[i] + w] = true;
              p[i] = pc[i] + w;
            }
          } else {
            if (dir === "u") {
              if (i === p.length - 1) {
                m[p[i]] = null;
              }
              p[i] = pc[i - 1];
            } else {
              if (i === p.length - 1) {
                m[p[i]] = null;
              }
              p[i] = pc[i - 1];
            }
          }

          this.setState({
            position: p,
            matrix: m
          });
        });

        if (this.eatYourselfCheck(p)) {
          clearInterval(this.state.intervalKey);
          this.setState({
            isGameOver: true,
            intervalKey: ""
          });
        }
        if (this.isBerryEaten(p)) {
          this.insertBerry((w - 1) * (r - 1), p, m);
          this.increaseSnakeLength(p, m, w, dir);
        }
      }
    } else if (dir === "l" || dir === "r") {
      if (
        (dir === "l" && this.state.position[0] === 0) ||
        (dir === "r" && this.state.position[0] === (w-1))
      ) {
        // console.log("out of bounds r&l");
        clearInterval(this.state.intervalKey);
        this.setState({
          isGameOver: true,
          intervalKey: ''
        });
      } else {

      p.map((x, i) => {
        if (i === 0) {
          if (dir === "l") {
            m[p[i] - 1] = true;
            p[i] = pc[i] - 1;
          } else {
            // if(i=== (p.length -1)){
            //   m[p[i]]=null
            // }
            m[p[i] + 1] = true;
            p[i] = pc[i] + 1;
          }
        } else {
          if (dir === "l") {
            if (i === p.length - 1) {
              m[p[i]] = null;
            }
            p[i] = pc[i - 1];
          } else {
            if (i === p.length - 1) {
              m[p[i]] = null;
              p[i] = pc[i - 1];
            }
            m[p[i]] = m[pc[i - 1]];
            p[i] = pc[i - 1];
          }
        }

        this.setState({
          position: p,
          matrix: m
        });
      });

      if (this.eatYourselfCheck(p)) {
        clearInterval(this.state.intervalKey);
        this.setState({
          isGameOver: true,
          intervalKey: ''
        });
      }
      if (this.isBerryEaten(p)) {
        this.insertBerry(w * r, p, m);
        this.increaseSnakeLength(p, m, w, dir);
      }

      }
    }
  };

  snakeNavigator = key => {
    if(!this.state.isGameOver){
    const interval = 100;

    if (
      key === 37 &&
      this.state.direction !== "l" &&
      this.state.direction !== "r"
    ) {
      // console.log("left");
      clearInterval(this.state.intervalKey);
      let t = setInterval(() => {
        this.moveSnake("l");
        // console.log("left");
      }, interval);

      this.setState({
        intervalKey: t,
        direction: "l"
      });
    } else if (
      key === 38 &&
      this.state.direction !== "u" &&
      this.state.direction !== "d"
    ) {
      // console.log("up");
      clearInterval(this.state.intervalKey);

      let t = setInterval(() => {
        this.moveSnake("u");
        // console.log("up");
      }, interval);

      this.setState({
        intervalKey: t,
        direction: "u"
      });
    } else if (
      key === 39 &&
      this.state.direction !== "r" &&
      this.state.direction !== "l"
    ) {
      // console.log("right");
      clearInterval(this.state.intervalKey);

      let t = setInterval(() => {
        this.moveSnake("r");
        // console.log("right");
      }, interval);

      this.setState({
        intervalKey: t,
        direction: "r"
      });
    } else if (
      key === 40 &&
      this.state.direction !== "d" &&
      this.state.direction !== "u"
    ) {
      // console.log("down");
      clearInterval(this.state.intervalKey);

      let t = setInterval(() => {
        this.moveSnake("d");
        console.log("down");
      }, interval);

      this.setState({
        intervalKey: t,
        direction: "d"
      });
    }
  }
  };

  increaseSnakeLength = (p, m, w, dir) => {
    const t = this.state.position.slice();

    const last = t[t.length - 1];

    const diff = last - t[t.length - 2];

    let pushable;

    if (diff === w) {
      //meaning the last two are at 90deg to each other
      // t.push(t[t.length-1]+w)
      pushable = last + w;
    } else if (diff === -w) {
      // t.push(t[t.length-1]-w)
      pushable = last - w;
    } else if (diff === 1) {
      // t.push(t[t.length-1]+1)
      pushable = last + 1;
    } else if (diff === -1) {
      // t.push(t[t.length-1]-1)
      pushable = last - 1;
    }

    t.push(pushable);
    m[pushable] = true;

    this.setState({
      position: t,
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
            background: "radial-gradient(#CDDC39, transparent)",
            display: "flex",
            flexWrap: "wrap",
            position: "absolute",
            filter: this.state.isGameOver ? "blur(5px)" : ""
          }}
          tabIndex="0"
          onKeyDown={e => {
            e.preventDefault()
              this.snakeNavigator(e.keyCode)
          }}
        >
          {/* {blocks()} */}
          {this.state.matrix.map((_block, i) => {
            return (
              <div
                key={i}
                // className="block"
                className={
                  `block ` +
                  (_block === null ? `` : _block === true ? `active` : `berry`)
                }
                style={{
                  height: this.context.blockUnitHeight,
                  width: this.context.blockUnitWidth
                }}
              >
                
              </div>
            );
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
