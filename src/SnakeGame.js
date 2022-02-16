import './style.css';
import React from 'react';
import PathFinding from './PathFinding';

class Coords {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.f = 30 * 30
    this.parent = null
    this.neighbors = []
  }

  sameCoordsAs(a) {
    if (this.x === a.x && this.y === a.y) return true
    else return false
  }

  isInList(list) {
    var result = list.map((tile) => {
      if (this.sameCoordsAs(tile)) {
        return true
      }
      return false
    })
    if (result.indexOf(true) > -1) return true
    return false
  }
}
function Square(props) {
  const color = props.coords.sameCoordsAs(props.apple) ? "red" : props.coords.sameCoordsAs(props.list[props.list.length - 1]) ? "grey" : props.coords.isInList(props.list) ? "darkGreen" : "rgba(255,255,255,0.4)";
  return (
    <div className="square" style={{ backgroundColor: color }}></div>
  )

}

class SnakeGame extends React.Component {
  constructor(props) {
    super(props)
    this.initialState = {
      gameStarted: true,
      speed: 80,
      appleLocation: new Coords(17, 14),
      snakeBody: [new Coords(0, 0), new Coords(1, 0), new Coords(2, 0), new Coords(3, 0), new Coords(4, 0), new Coords(5, 0)],
      direction: "Right",
      applesCaught: 0,
      gameFinished: false,
      gamePaused: false,
      autoMove: false,
      path: []
    }
    this.state = {
      gameStarted: false,
      speed: 80,
      appleLocation: new Coords(17, 14),
      snakeBody: [new Coords(0, 0), new Coords(1, 0), new Coords(2, 0), new Coords(3, 0), new Coords(4, 0), new Coords(5, 0)],
      direction: "Right",
      applesCaught: 0,
      gameFinished: false,
      gamePaused: false,
      autoMove: false,
      path: [],
      walls: false
    }
    this.handleKeys = this.handleKeys.bind(this)
    this.handleButtons = this.handleButtons.bind(this)
    this.autoMovement = this.autoMovement.bind(this)
    this.findPath = this.findPath.bind(this)
    this.autoMoveSolver = this.autoMoveSolver.bind(this)
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
        if (this.state.autoMove) this.autoPathFollow = setInterval(() => this.autoMoveSolver(), this.state.speed);
        else this.autoMoveSnake = setInterval(() => this.autoMovement(), this.state.speed);
      }
    }
    if (event.key === "Escape") {
      if (this.state.autoMove) clearInterval(this.autoPathFollow)
      else clearInterval(this.autoMoveSnake)
      this.setState({
        gamePaused: true
      })
    }
    var direction = "No change"
    var snakeBody = this.state.snakeBody.slice()
    if (!this.state.gamePaused) {
      if (event.key === "ArrowRight" && snakeBody[snakeBody.length - 2].x !== snakeBody[snakeBody.length - 1].x + 1 && snakeBody[snakeBody.length - 2].x !== snakeBody[snakeBody.length - 1].x - 29) direction = "Right"
      else if (event.key === "ArrowLeft" && snakeBody[snakeBody.length - 2].x !== snakeBody[snakeBody.length - 1].x - 1 && snakeBody[snakeBody.length - 2].x !== snakeBody[snakeBody.length - 1].x + 29) direction = "Left"
      else if (event.key === "ArrowUp" && snakeBody[snakeBody.length - 2].y !== snakeBody[snakeBody.length - 1].y - 1 && snakeBody[snakeBody.length - 2].y !== snakeBody[snakeBody.length - 1].y + 29) direction = "Up"
      else if (event.key === "ArrowDown" && snakeBody[snakeBody.length - 2].y !== snakeBody[snakeBody.length - 1].y + 1 && snakeBody[snakeBody.length - 2].y !== snakeBody[snakeBody.length - 1].y - 29) direction = "Down"
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
    else if (event.target.id === "autoSolveButton" && !this.state.gamePaused) {
      if (this.state.gameStarted) {
        if (this.state.gameFinished){
          this.setState(this.initialState)
          this.findPath(this.initialState.snakeBody[this.state.snakeBody.length - 1], this.initialState.appleLocation, this.initialState.snakeBody.slice(0, this.initialState.snakeBody.length - 1))
        } else if (!this.state.autoMove) {
          clearInterval(this.autoMoveSnake)
          this.findPath(this.state.snakeBody[this.state.snakeBody.length - 1], this.state.appleLocation, this.state.snakeBody.slice(0, this.state.snakeBody.length - 1))
        }
      }
      else this.findPath(this.state.snakeBody[this.state.snakeBody.length - 1], this.state.appleLocation, this.state.snakeBody.slice(0, this.state.snakeBody.length - 1))
    }
  }

  autoMovement() {
    var direction = this.state.direction
    var snakeBody = this.state.snakeBody.slice()
    var appleLocation = this.state.appleLocation
    var applesCaught = this.state.applesCaught
    var newBody
    var change = new Coords(0, 0)
    var hitWall = false
    var speed = this.state.speed

    if (direction === "Right") {
      if (this.state.walls && snakeBody[snakeBody.length - 1].x === 29) hitWall = true
      else if (!this.state.walls && snakeBody[snakeBody.length - 1].x === 29) change.x = - 29
      else change.x = 1
    }
    else if (direction === "Left") {
      if (this.state.walls && snakeBody[snakeBody.length - 1].x === 0) hitWall = true
      else if (!this.state.walls && snakeBody[snakeBody.length - 1].x === 0) change.x = 29
      else change.x = - 1
    }
    else if (direction === "Up") {
      if (this.state.walls && snakeBody[snakeBody.length - 1].y === 0) hitWall = true
      else if (!this.state.walls && snakeBody[snakeBody.length - 1].y === 0) change.y = 29
      else change.y = - 1
    }
    else if (direction === "Down") {
      if (this.state.walls && snakeBody[snakeBody.length - 1].y === 29) hitWall = true
      else if (!this.state.walls && snakeBody[snakeBody.length - 1].y === 29) change.y = - 29
      else change.y = 1
    }

    var afterChange = new Coords(snakeBody[snakeBody.length - 1].x + change.x, snakeBody[snakeBody.length - 1].y + change.y)
    if (afterChange.isInList(snakeBody.slice(0, snakeBody.length - 1)) || hitWall) {
      clearInterval(this.autoMoveSnake)
      this.setState({
        gameFinished: true
      })
    } else {
      if (afterChange.sameCoordsAs(appleLocation)) {
        newBody = snakeBody.slice().concat([afterChange])
        applesCaught += 1
        if (speed !== 34) {
          speed -= 2
          clearInterval(this.autoMoveSnake)
          this.autoMoveSnake = setInterval(() => this.autoMovement(), this.state.speed);
        }
        do {
          var newX = Math.floor(Math.random() * 30)
          var newY = Math.floor(Math.random() * 30)
          appleLocation = new Coords(newX, newY)
        } while (appleLocation.isInList(newBody))
      }
      else {
        newBody = snakeBody.slice(1).concat([afterChange])
      }
      this.setState({
        appleLocation: appleLocation,
        snakeBody: newBody,
        applesCaught: applesCaught,
        speed: speed
      })
    }
  }

  findPath(start, end, obstacles) {
    var open = []
    var closed = []
    var targetFound = false
    var current, new_g, new_h, new_f
    open.push(start)
    while (!targetFound) {
      open.sort((a, b) => a.f - b.f)
      current = open[0]
      open = open.slice(1)
      closed.push(current)
      if (current.sameCoordsAs(end)) targetFound = true
      try {
      } catch (e) {
        if (e instanceof TypeError) {
          this.setState({
            gameFinished: true
          })
        }
      }
      current.neighbors = []
      if (current.x !== 0) current.neighbors.push(new Coords(current.x - 1, current.y))
      if (current.x !== 29) current.neighbors.push(new Coords(current.x + 1, current.y))
      if (current.y !== 0) current.neighbors.push(new Coords(current.x, current.y - 1))
      if (current.y !== 29) current.neighbors.push(new Coords(current.x, current.y + 1))

      current.neighbors = current.neighbors.map((neighbor) => {
        if (neighbor.isInList(obstacles) || neighbor.isInList(closed)) return neighbor

        new_g = Math.abs(neighbor.x - start.x) + Math.abs(neighbor.y - start.y)
        new_h = Math.abs(neighbor.x - end.x) + Math.abs(neighbor.y - end.y)
        new_f = new_g + new_h
        if (new_f < neighbor.f || !neighbor.isInList(open)) {
          neighbor.f = new_f
          neighbor.parent = current

          if (!neighbor.isInList(open)) {
            open.push(neighbor)
          }
        }
        return neighbor
      })
    }

    var path = []
    var pathBlock = closed[closed.length - 1]
    var speed = 34
    while (pathBlock.parent !== null) {
      path = path.concat(pathBlock)
      pathBlock = pathBlock.parent
    }
    this.setState({
      path: path,
      speed: speed,
      gameStarted: true,
      autoMove: true
    })
    this.autoPathFollow = setInterval(() => this.autoMoveSolver(), speed);
  }

  autoMoveSolver() {
    var snakeBody = this.state.snakeBody.slice()
    var path = this.state.path.slice()
    var newBlock = path.pop()
    var appleLocation = this.state.appleLocation
    var applesCaught = this.state.applesCaught
    var findNewPath = false
    snakeBody = snakeBody.concat(newBlock)
    if (newBlock.sameCoordsAs(appleLocation)) {
      findNewPath = true
      applesCaught += 1
      do {
        var newX = Math.floor(Math.random() * 30)
        var newY = Math.floor(Math.random() * 30)
        appleLocation = new Coords(newX, newY)
      } while (appleLocation.isInList(snakeBody))
    } else {
      snakeBody = snakeBody.slice(1)
    }
    this.setState({
      snakeBody: snakeBody,
      path: path,
      appleLocation: appleLocation,
      applesCaught: applesCaught
    })
    if (findNewPath) {
      snakeBody[snakeBody.length - 1].parent = null
      clearInterval(this.autoPathFollow)
      this.findPath(snakeBody[snakeBody.length - 1], appleLocation, snakeBody.slice(0, snakeBody.length - 1))
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
        rows.push(<Square apple={this.state.appleLocation} list={this.state.snakeBody} coords={new Coords(j, i)}></Square>)
      }
      columns.push(<div style={{ display: 'flex', flexDirection: 'row wrap' }}>{rows}</div>)
    }
    const gameStatus = this.state.gameStarted ? this.state.gamePaused ? <p className="gameResult">Press Enter<br />to resume.</p> : this.state.gameFinished ? <p className="gameResult">Game Over.<br />Press Enter<br />to start<br />again.</p> : <p className="gameResult">Press Escape<br />to pause.</p> : <p className="gameResult">Press Enter<br />to start.</p>
    return (
      <div>
        <div className="info">
          <div className='buttonDiv'>
            <input id="enableDisableWalls" type="button" value={this.state.walls ? "Disable Walls" : "Enable Walls"} onClick={this.handleButtons} disabled={this.state.gameStarted && !this.state.gameFinished} style={this.state.gameStarted && !this.state.gameFinished ? { backgroundColor: 'rgb(150, 150, 150)' } : this.state.walls ? { backgroundColor: 'rgba(211, 39, 16, 0.3)' } : { backgroundColor: 'rgba(16, 149, 211, 0.3)' }} />
            <br />
            <input id="autoSolveButton" type="button" value="Auto-solve" onClick={this.handleButtons} />
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


class Board extends React.Component {
  constructor() {
    super()
    this.state = {
      display: <SnakeGame />
    }
    this.handleKeys = this.handleKeys.bind(this)
  }
  handleKeys(event) {
    if (event.key === "f") {
      this.setState({
        display: <PathFinding />
      })
    } else if (event.key === "s") {
      this.setState({
        display: <SnakeGame />
      })
    }

  }
  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeys)
  }
  render() {
    return (this.state.display);
  }
}

export {
  SnakeGame,
  Board
}