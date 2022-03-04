import './style.css';
import React from 'react';
import { WebTemplate, navBarElement } from './website-template/src/WebTemplate.js'
import PathFinding from './PathFinding.js';
import Coords from './Coords.js'

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
      squareCount: 25,
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
      if (event.key === "ArrowRight" && snakeBody[snakeBody.length - 2].x !== snakeBody[snakeBody.length - 1].x + 1 && snakeBody[snakeBody.length - 2].x !== snakeBody[snakeBody.length - 1].x - (this.state.squareCount - 1)) direction = "Right"
      else if (event.key === "ArrowLeft" && snakeBody[snakeBody.length - 2].x !== snakeBody[snakeBody.length - 1].x - 1 && snakeBody[snakeBody.length - 2].x !== snakeBody[snakeBody.length - 1].x + (this.state.squareCount - 1)) direction = "Left"
      else if (event.key === "ArrowUp" && snakeBody[snakeBody.length - 2].y !== snakeBody[snakeBody.length - 1].y - 1 && snakeBody[snakeBody.length - 2].y !== snakeBody[snakeBody.length - 1].y + (this.state.squareCount - 1)) direction = "Up"
      else if (event.key === "ArrowDown" && snakeBody[snakeBody.length - 2].y !== snakeBody[snakeBody.length - 1].y + 1 && snakeBody[snakeBody.length - 2].y !== snakeBody[snakeBody.length - 1].y - (this.state.squareCount - 1)) direction = "Down"
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
    var change = new Coords(0, 0)
    var hitWall = false
    var speed = this.state.speed

    if (direction === "Right") {
      if (this.state.walls && snakeBody[snakeBody.length - 1].x === (this.state.squareCount - 1)) hitWall = true
      else if (!this.state.walls && snakeBody[snakeBody.length - 1].x === (this.state.squareCount - 1)) change.x = - (this.state.squareCount - 1)
      else change.x = 1
    }
    else if (direction === "Left") {
      if (this.state.walls && snakeBody[snakeBody.length - 1].x === 0) hitWall = true
      else if (!this.state.walls && snakeBody[snakeBody.length - 1].x === 0) change.x = (this.state.squareCount - 1)
      else change.x = - 1
    }
    else if (direction === "Up") {
      if (this.state.walls && snakeBody[snakeBody.length - 1].y === 0) hitWall = true
      else if (!this.state.walls && snakeBody[snakeBody.length - 1].y === 0) change.y = (this.state.squareCount - 1)
      else change.y = - 1
    }
    else if (direction === "Down") {
      if (this.state.walls && snakeBody[snakeBody.length - 1].y === (this.state.squareCount - 1)) hitWall = true
      else if (!this.state.walls && snakeBody[snakeBody.length - 1].y === (this.state.squareCount - 1)) change.y = - (this.state.squareCount - 1)
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
          var newX = Math.floor(Math.random() * this.state.squareCount)
          var newY = Math.floor(Math.random() * this.state.squareCount)
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
      try {
        if (current.sameCoordsAs(end)) targetFound = true
      } catch (e) {
        if (e instanceof TypeError) {
          this.setState({
            gameFinished: true
          })
        }
      }
      current.neighbors = []
      if (current.x !== 0) current.neighbors.push(new Coords(current.x - 1, current.y))
      if (current.x !== (this.state.squareCount - 1)) current.neighbors.push(new Coords(current.x + 1, current.y))
      if (current.y !== 0) current.neighbors.push(new Coords(current.x, current.y - 1))
      if (current.y !== (this.state.squareCount - 1)) current.neighbors.push(new Coords(current.x, current.y + 1))

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
        var newX = Math.floor(Math.random() * this.state.squareCount)
        var newY = Math.floor(Math.random() * this.state.squareCount)
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

  autoSolve = () => {
    if (!this.state.gamePaused) {
      if (this.state.gameStarted) {
        if (this.state.gameFinished) {
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

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeys)
    var options = [<label>Enable Walls<input type='checkbox' id='enableDisableWalls' onChange={this.handleButtons}/></label>]
    var navBarElements = [new navBarElement("Auto Solve", 'button', this.autoSolve), new navBarElement("Options", 'select', options)]
    this.props.setNavBarElements(navBarElements)
  }

  render() {
    var columns = []
    var rows = []
    for (var i = 0; i < this.state.squareCount; i++) {
      rows = []
      for (var j = 0; j < this.state.squareCount; j++) {
        rows.push(<Square apple={this.state.appleLocation} list={this.state.snakeBody} coords={new Coords(j, i)}></Square>)
      }
      columns.push(<div style={{ display: 'flex', flexDirection: 'row wrap' }}>{rows}</div>)
    }
    const gameStatus = this.state.gameStarted ? this.state.gamePaused ? <p className="gameResult">Press Enter<br />to resume.</p> : this.state.gameFinished ? <p className="gameResult">Game Over.<br />Press Enter<br />to start<br />again.</p> : <p className="gameResult">Press Escape<br />to pause.</p> : <p className="gameResult">Press Enter<br />to start.</p>
    return (
      <div className='boardDiv'>
        <div className="infoDiv">
          <p style={{ color: "darkGreen" }}>Snake Length: {this.state.snakeBody.length} squares.</p>
          <p style={{ color: "darkRed" }}>Apples Caught: {this.state.applesCaught}</p>
          <p style={{ color: "darkOrange" }}>Speed: ~{Math.round(1000 / this.state.speed)} squares/sec.</p>
        </div>
        <div className="squaresDiv">
          {columns}
        </div>
        {gameStatus}
      </div>
    );
  }
}

class Board extends React.Component {
  constructor() {
    super()
    this.snakeGame = <SnakeGame setNavBarElements={this.setNavBarElements} />
    this.pathFinding = <PathFinding setNavBarElements={this.setNavBarElements} />
    this.state = {
      display: this.snakeGame,
      navBarElements: []
    }
    this.handleKeys = this.handleKeys.bind(this)
    this.setNavBarElements = this.setNavBarElements.bind(this)
  }

  handleKeys(event) {
    if (event.key === "f") {
      this.setState({
        display: this.pathFinding
      })
    } else if (event.key === "s") {
      this.setState({
        display: this.snakeGame
      })
    }
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeys)
  }

  setNavBarElements = (elements) => {
    this.setState({
      navBarElements: elements
    })
  }

  render() {
    return (
      <WebTemplate icon="/snake-game_react/favicon.ico" title="Snake Game" navBarElements={this.state.navBarElements}>
        {this.state.display}
      </WebTemplate>
    );
  }
}

export default Board;