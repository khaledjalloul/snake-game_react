import './style.css';
import React from 'react';

function Square(props) {
  const color = props.id === props.apple ? "red" : props.id === props.list[props.list.length - 1] ? "grey" :
    props.list.indexOf(props.id) > -1 ? "darkGreen" : "white";
  return (
    <div className="square" style={{ backgroundColor: color }}></div>
  )
}

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.initialState = {
      gameStarted: true,
      speed: 50,
      appleLocation: 437,
      snakeBody: [0, 1, 2, 3, 4, 5],
      direction: "Right",
      applesCaught: 0,
      gameFinished: false
    }
    this.state = {
      gameStarted: false,
      speed: 50,
      appleLocation: 437,
      snakeBody: [0, 1, 2, 3, 4, 5],
      direction: "Right",
      applesCaught: 0,
      gameFinished: false
    }
    this.handleKeys = this.handleKeys.bind(this)
    this.autoMovement = this.autoMovement.bind(this)
  }

  handleKeys(event) {
    if (event.key === "Enter" && (!this.state.gameStarted || (this.state.gameStarted && this.state.gameFinished))) {
      this.autoMoveSnake = setInterval(() => this.autoMovement(), this.state.speed);
      this.setState(this.initialState)
    }

    var direction = "No change"
    var snakeBody = this.state.snakeBody.slice()
    if (event.key === "ArrowRight" && snakeBody[snakeBody.length - 2] !== snakeBody[snakeBody.length - 1] + 1) direction = "Right"
    else if (event.key === "ArrowLeft" && snakeBody[snakeBody.length - 2] !== snakeBody[snakeBody.length - 1] - 1) direction = "Left"
    else if (event.key === "ArrowDown" && snakeBody[snakeBody.length - 2] !== snakeBody[snakeBody.length - 1] + 30) direction = "Down"
    else if (event.key === "ArrowUp" && snakeBody[snakeBody.length - 2] !== snakeBody[snakeBody.length - 1] - 30) direction = "Up"

    if (direction !== "No change" && (event.key === "ArrowUp" || event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "ArrowLeft")) {
      this.setState({
        direction: direction
      })
    }
  }

  autoMovement() {
    const direction = this.state.direction
    var snakeBody = this.state.snakeBody.slice()
    var appleLocation = this.state.appleLocation
    var applesCaught = this.state.applesCaught
    var newBody
    var change = 0
    if (direction === "Right") {
      if (snakeBody[snakeBody.length - 1] % 30 === 29) change = - 29
      else change = 1
    }
    else if (direction === "Left") {
      if (snakeBody[snakeBody.length - 1] % 30 === 0) change = 29
      else change = - 1
    }
    else if (direction === "Down") {
      if (snakeBody[snakeBody.length - 1] >= 870 && snakeBody[snakeBody.length - 1] < 900) change = - 870
      else change = 30
    }
    else if (direction === "Up") {
      if (snakeBody[snakeBody.length - 1] < 30) change = 870
      else change = - 30
    }
    if (snakeBody.slice(0, snakeBody.length - 1).indexOf(snakeBody[snakeBody.length - 1] + change) > -1) {
      clearInterval(this.autoMoveSnake)
      this.setState({
        gameFinished: true
      })
    } else {
      if (snakeBody[snakeBody.length - 1] + change === appleLocation) {
        newBody = snakeBody.slice().concat([snakeBody[snakeBody.length - 1] + change])
        applesCaught += 1
        do {
          appleLocation = Math.floor(Math.random() * 900)
        } while (newBody.indexOf(appleLocation) > -1)
      }
      else {
        newBody = snakeBody.slice(1).concat([snakeBody[snakeBody.length - 1] + change])
      }
      this.setState({
        appleLocation: appleLocation,
        snakeBody: newBody,
        applesCaught: applesCaught
      })
    }
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeys)
  }

  render() {
    var columns = []
    var rows = []
    for (var i = 0; i < 30; i++) {
      rows = []
      for (var j = 0; j < 30; j++) {
        rows.push(<Square apple={this.state.appleLocation} list={this.state.snakeBody} id={Number(i * 30 + j)}></Square>)
      }
      columns.push(<div style={{ display: 'flex', flexDirection: 'row wrap' }}>{rows}</div>)
    }
    const gameStatus = this.state.gameStarted ? this.state.gameFinished ?<p className="gameResult">Game Over.<br/>Press Enter<br/>to start<br/>again.</p> : <div></div> : <p className="gameResult">Press Enter<br/>to start.</p>
    return (
      <div>
        <div className="info">
          <p id="snakeLength">Snake Length: {this.state.snakeBody.length} squares.</p>
          <p id="applesCaught">Apples Caught: {this.state.applesCaught}</p>
        </div>
        {gameStatus}
        <div className="center">
          {columns}
        </div>
      </div>
    );
  }
}

export default Board;
