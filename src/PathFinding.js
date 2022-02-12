import './style.css';
import React from 'react';
import { findByPlaceholderText } from '@testing-library/react';

function Square(props) {
  const color = props.id === props.blocks.start ? "blue" : props.id === props.blocks.end ? "red" : "rgba(255,255,255,0.4)";
  return (
    <div className="square" style={{ backgroundColor: color }}></div>
  )
}

class Tile{
  Tile(id){
    this.id = id
    this.g = 0
    this.h = 0
    this.f = 0
  }
}

class PathFinding extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      start: 72,
      end: 491,
      obstacles: []
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
  
  findPath(){
    var open = []
    var closed = []
    var isNotFound = true
    var current
    var neighbors = []
    open.push(Tile(this.state.start))
    while (isNotFound){
      open.sort((a, b) => a.id - b.id)
      current = open.pop(0)
      closed.push(current)

      if (current.id === this.state.end){
        return
      }
      neighbors = []
      if (current % 30 !== 29) neighbors.push(Tile(current.id+1))
      if (current % 30 !== 0) neighbors.push(Tile(current.id-1))
      if (current < 30) neighbors.push(Tile(current.id-30))
      if (current >= 870 && current < 900) neighbors.push(Tile(current.id+30))

      neighbors = neighbors.map((tile) => {
        if (this.state.obstacles.indexOf(tile.id) > -1 || closed.indexOf(tile.id) > -1) return

        if (this.state.obstacles.indexOf(tile.id) === -1){}
      })
    }
  }

  render() {
    var columns = []
    var rows = []
    for (var i = 0; i < 30; i++) {
      rows = []
      for (var j = 0; j < 30; j++) {
        rows.push(<Square blocks={this.state} id={Number(i * 30 + j)}></Square>)
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
