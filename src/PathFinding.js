import './style.css';
import React from 'react';

class Coords {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.f = 30*30
    this.parent = null
    this.neighbors = []
  }

  sameCoordsAs(a) {
    if (this.x === a.x && this.y === a.y) return true
    else return false
  }

  isInList(list) {
    var result = list.map((Coords) => {
      if (this.sameCoordsAs(Coords)) {
        return true
      }
      return false
    })
    if (result.indexOf(true) > -1) return true
    return false
  }
}
function Square(props) {
  const color = props.coords.sameCoordsAs(props.blocks.start) ? "blue" : props.coords.sameCoordsAs(props.blocks.end) ? "red" : props.coords.isInList(props.blocks.path) ? "green" : props.coords.isInList(props.blocks.open) ? "grey" :  props.coords.isInList(props.blocks.closed) ? "pink" : props.coords.isInList(props.blocks.obstacles) ? "black" : "rgba(255,255,255,0.4)";
  return (
    <div className="square" style={{ backgroundColor: color, fontSize: '8px'}}>{props.coords.x + ", " + props.coords.y}</div>
  )
}

class PathFinding extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      start: new Coords(23, 7),
      end: new Coords(8, 22),
      obstacles: [new Coords(20, 5), new Coords(20, 6), new Coords(20, 7), new Coords(20, 8), new Coords(20, 9), new Coords(20, 10), new Coords(21, 11), new Coords(22, 11), new Coords(23, 11), new Coords(24, 11), new Coords(25, 11)],
      path: [],
      open: [],
      closed: []
    }
    this.handleKeys = this.handleKeys.bind(this)
    this.findPath = this.findPath.bind(this)
  }

  handleKeys(event) {
    if (event.key === "Enter") {
      this.findPath()
    }
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeys)
  }
  
  async findPath(){
    const sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    var open = []
    var closed = []
    var targetFound = false
    var current, new_g, new_h, new_f
    open.push(this.state.start)
    while (!targetFound){
      await sleep(1)
      this.setState({
        open: open,
        closed: closed
      })
      open.sort((a, b) => a.f - b.f)
      current = open[0]
      open = open.slice(1)
      closed.push(current)

      if (current.sameCoordsAs(this.state.end)) targetFound = true

      if (current.x !== 0) current.neighbors.push(new Coords(current.x - 1, current.y))
      if (current.x !== 29) current.neighbors.push(new Coords(current.x + 1, current.y))
      if (current.y !== 0) current.neighbors.push(new Coords(current.x, current.y - 1))
      if (current.y !== 29) current.neighbors.push(new Coords(current.x, current.y + 1))

      current.neighbors = current.neighbors.map((neighbor) => {
        if (neighbor.isInList(this.state.obstacles) || neighbor.isInList(closed)) return

        new_g = Math.abs(neighbor.x - this.state.start.x) + Math.abs(neighbor.y - this.state.start.y)
        new_h = Math.abs(neighbor.x - this.state.end.x) + Math.abs(neighbor.y - this.state.end.y)
        new_f = new_g + new_h
        if (new_f < neighbor.f || !neighbor.isInList(open)){
          neighbor.f = new_f
          neighbor.parent = current

          if (!neighbor.isInList(open)){
            open.push(neighbor)
          }
        }
      })
    }

    var colorChange = closed[closed.length-1]
    while(colorChange.parent !== null){
      await sleep(1)
      var path = this.state.path.slice().concat(colorChange)
      this.setState({
        path: path
      })
      colorChange = colorChange.parent
    }
  }

  render() {
    var columns = []
    var rows = []
    for (var i = 0; i < 30; i++) {
      rows = []
      for (var j = 0; j < 30; j++) {
        rows.push(<Square blocks={this.state} coords={new Coords(j, i)}></Square>)
      }
      columns.push(<div style={{ display: 'flex', flexDirection: 'row wrap' }}>{rows}</div>)
    }
    return (
      <div>
        <div className="center">
          {columns}
        </div>
      </div>
    );
  }
}

export default PathFinding;