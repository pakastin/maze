const maze = [];

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

class Cell {
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

const $table = document.createElement('table');

for (let y = 0; y < 48; y++) {
  maze[y] = [];

  const $tr = document.createElement('tr');

  for (let x = 0; x < 64; x++) {
    maze[y][x] = new Cell(maze, x, y);

    const $td = document.createElement('td');
    maze[y][x].$td = $td;

    $td.classList.add('top');
    $td.classList.add('left');
    $td.classList.add('right');
    $td.classList.add('bottom');

    $tr.appendChild($td);
  }
  $table.appendChild($tr);
}

document.body.appendChild($table);

const stack = [];

maze[0][0].visited = true;

stack.push(maze[0][0]);

(async () => {
  while (stack.length) {
    const last = stack.pop();
    last.$td.classList.add('black');

    if (last.unvisitedNeighbors.length) {
      const visitIndex = Math.random() * last.unvisitedNeighbors.length | 0;
      const { pos, cell: neighbor } = last.unvisitedNeighbors[visitIndex];

      last.visit(pos);
      neighbor.visited = true;

      if (last.unvisitedNeighbors.length) {
        stack.push(last);
      } else {
        last.$td.classList.add('ready');
      }
      if (neighbor.unvisitedNeighbors.length) {
        stack.push(neighbor);
      } else {
        neighbor.$td.classList.add('ready');
      }
    } else {
      last.$td.classList.add('ready');
    }
    await new Promise(resolve => requestAnimationFrame(resolve));
    last.$td.classList.remove('black');
  }
})();
