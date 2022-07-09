const posDiff = {
  top: [0, -1],
  left: [-1, 0],
  right: [1, 0],
  bottom: [0, 1]
};

const posFrom = {
  top: 'bottom',
  left: 'right',
  right: 'left',
  bottom: 'top'
};

export default class Cell {
  constructor (maze, x, y) {
    this.maze = maze;
    this.x = x;
    this.y = y;
    this.visited = false;
    this.walls = {
      top: true,
      left: true,
      right: true,
      bottom: true
    };
  }

  visit (pos) {
    this.walls[pos] = false;
    this.neighbor(pos).walls[posFrom[pos]] = false;
    this.updateBorders();
    this.neighbor(pos).updateBorders();
  }

  updateBorders () {
    for (const pos in this.walls) {
      if (this.walls[pos]) {
        this.$td.classList.add(pos);
      } else {
        this.$td.classList.remove(pos);
      }
    }
  }

  get neighbors () {
    return ['top', 'left', 'right', 'bottom'].map(pos => ({
      pos,
      cell: this.neighbor(pos)
    })).filter(neighbor => neighbor.cell);
  }

  get unvisitedNeighbors () {
    return this.neighbors.filter(neighbor => !neighbor.cell.visited);
  }

  neighbor (pos) {
    const { maze } = this;
    const [xDiff, yDiff] = posDiff[pos];
    const x = this.x + xDiff;
    const y = this.y + yDiff;
    return maze[y] && maze[y][x];
  }
}
