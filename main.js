import Cell from './cell.js';

const maze = [];

const $table = document.createElement('table');

// Create maze grid

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

// Generate maze

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
