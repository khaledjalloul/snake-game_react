import './style.css';
import React from 'react';

function Square(props) {
  const color = props.id === props.apple ? "red" : props.id === props.list[props.list.length - 1] ? "grey" :
    props.list.indexOf(props.id) > -1 ? "darkGreen" : "rgba(255,255,255,0.4)";
  return (
    <div className="square" style={{ backgroundColor: color }}></div>
  )
}

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.initialState = {
      gameStarted: true,
      speed: 80,
      appleLocation: 437,
      snakeBody: [0, 1, 2, 3, 4, 5],
      direction: "Right",
      applesCaught: 0,
      gameFinished: false,
      gamePaused: false,
    }
    this.state = {
      gameStarted: false,
      speed: 80,
      appleLocation: 437,
      snakeBody: [0, 1, 2, 3, 4, 5],
      direction: "Right",
      applesCaught: 0,
      gameFinished: false,
      gamePaused: false,
      walls: false
    }
    this.handleKeys = this.handleKeys.bind(this)
    this.handleButtons = this.handleButtons.bind(this)
    this.autoMovement = this.autoMovement.bind(this)
  }

  handleKeys(event) {
    if (event.key === "Enter") {
      if (!this.state.gameStarted || (this.state.gameStarted && this.state.gameFinished)) {
        this.setState(this.initialState)
        this.autoMoveSnake = setInterval(() => this.autoMovement(), this.state.speed);
      }
      else if (this.state.gamePaused) {
        this.setState({
          gamePaused: false
        })
        this.autoMoveSnake = setInterval(() => this.autoMovement(), this.state.speed);
      }
    }
    if (event.key === "Escape") {
      clearInterval(this.autoMoveSnake)
      this.setState({
        gamePaused: true
      })
    }
    var direction = "No change"
    var snakeBody = this.state.snakeBody.slice()
    if (!this.state.gamePaused) {
      if (event.key === "ArrowRight" && snakeBody[snakeBody.length - 2] !== snakeBody[snakeBody.length - 1] + 1 && snakeBody[snakeBody.length - 2] !== snakeBody[snakeBody.length - 1] - 29) direction = "Right"
      else if (event.key === "ArrowLeft" && snakeBody[snakeBody.length - 2] !== snakeBody[snakeBody.length - 1] - 1 && snakeBody[snakeBody.length - 2] !== snakeBody[snakeBody.length - 1] + 29) direction = "Left"
      else if (event.key === "ArrowUp" && snakeBody[snakeBody.length - 2] !== snakeBody[snakeBody.length - 1] - 30 && snakeBody[snakeBody.length - 2] !== snakeBody[snakeBody.length - 1] + 870) direction = "Up"
      else if (event.key === "ArrowDown" && snakeBody[snakeBody.length - 2] !== snakeBody[snakeBody.length - 1] + 30 && snakeBody[snakeBody.length - 2] !== snakeBody[snakeBody.length - 1] - 870) direction = "Down"
    }
    if (direction !== "No change" && (event.key === "ArrowUp" || event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "ArrowLeft")) {
      this.setState({
        direction: direction
      })
    }
  }

  handleButtons(event) {
    if (event.target.id === "enableDisableWalls") {
      this.setState({
        walls: !this.state.walls
      })
    }
  }

  autoMovement() {
    var direction = this.state.direction
    var snakeBody = this.state.snakeBody.slice()
    var appleLocation = this.state.appleLocation
    var applesCaught = this.state.applesCaught
    var newBody
    var change = 0
    var hitWall = false
    var speed = this.state.speed

    if (direction === "Right") {
      if (this.state.walls && snakeBody[snakeBody.length - 1] % 30 === 29) hitWall = true
      else if (!this.state.walls && snakeBody[snakeBody.length - 1] % 30 === 29) change = - 29
      else change = 1
    }
    else if (direction === "Left") {
      if (this.state.walls && snakeBody[snakeBody.length - 1] % 30 === 0) hitWall = true
      else if (!this.state.walls && snakeBody[snakeBody.length - 1] % 30 === 0) change = 29
      else change = - 1
    }
    else if (direction === "Up") {
      if (this.state.walls && snakeBody[snakeBody.length - 1] < 30) hitWall = true
      else if (!this.state.walls && snakeBody[snakeBody.length - 1] < 30) change = 870
      else change = - 30
    }
    else if (direction === "Down") {
      if (this.state.walls && snakeBody[snakeBody.length - 1] >= 870 && snakeBody[snakeBody.length - 1] < 900) hitWall = true
      else if (!this.state.walls && snakeBody[snakeBody.length - 1] >= 870 && snakeBody[snakeBody.length - 1] < 900) change = - 870
      else change = 30
    }

    if (snakeBody.slice(0, snakeBody.length - 1).indexOf(snakeBody[snakeBody.length - 1] + change) > -1 || hitWall) {
      clearInterval(this.autoMoveSnake)
      this.setState({
        gameFinished: true
      })
    } else {
      if (snakeBody[snakeBody.length - 1] + change === appleLocation) {
        newBody = snakeBody.slice().concat([snakeBody[snakeBody.length - 1] + change])
        applesCaught += 1
        if (speed !== 34) {
          speed -= 2
          clearInterval(this.autoMoveSnake)
          this.autoMoveSnake = setInterval(() => this.autoMovement(), this.state.speed);
        }
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
        applesCaught: applesCaught,
        speed: speed
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
    const gameStatus = this.state.gameStarted ? this.state.gamePaused ? <p className="gameResult">Press Enter<br />to resume.</p> : this.state.gameFinished ? <p className="gameResult">Game Over.<br />Press Enter<br />to start<br />again.</p> : <p className="gameResult">Press Escape<br />to pause.</p> : <p className="gameResult">Press Enter<br />to start.</p>
    return (
      <div>
        <div className="info">
          <div className='buttonDiv'>
            <input id="enableDisableWalls" type="button" value={this.state.walls ? "Disable Walls" : "Enable Walls"} onClick={this.handleButtons} disabled={this.state.gameStarted && !this.state.gameFinished} style={this.state.gameStarted && !this.state.gameFinished ? { backgroundColor: 'rgb(150, 150, 150)' } : this.state.walls ? { backgroundColor: 'rgba(211, 39, 16, 0.3)' } : { backgroundColor: 'rgba(16, 149, 211, 0.3)' }} />
          </div>
          <p style={{ color: "darkGreen" }}>Snake Length: {this.state.snakeBody.length} squares.</p>
          <p style={{ color: "darkRed" }}>Apples Caught: {this.state.applesCaught}</p>
          <p style={{ color: "darkOrange" }}>Speed: ~{Math.round(1000 / this.state.speed)} squares/sec.</p>
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
