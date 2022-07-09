import Cell from './cell.js';

const GRID_WIDTH = 64;
const GRID_HEIGHT = 48;

// Create maze grid

const maze = [];

for (let y = 0; y < GRID_HEIGHT; y++) {
  maze[y] = [];

  for (let x = 0; x < GRID_WIDTH; x++) {
    maze[y][x] = new Cell(maze, x, y);

    if (x === 0 && y === 0) {
      maze[y][x].walls.top = false;
    } else if (x === GRID_WIDTH - 1 && y === GRID_HEIGHT - 1) {
      maze[y][x].walls.bottom = false;
    }
  }
}

// Create maze DOM table

const $table = document.createElement('table');

for (let y = 0; y < GRID_HEIGHT; y++) {
  const $tr = document.createElement('tr');

  for (let x = 0; x < GRID_WIDTH; x++) {
    const $td = document.createElement('td');
    maze[y][x].$td = $td;

    maze[y][x].updateBorders();

    $tr.appendChild($td);
  }
  $table.appendChild($tr);
}

document.body.appendChild($table);

// Generate maze

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
