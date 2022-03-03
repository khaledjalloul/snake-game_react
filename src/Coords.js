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

export default Coords;