const fs = require('fs');
const path = require('path');
const { loadInput } = require('../utils');

const input = loadInput(10);
const MODE = {
  left: 0,
  right: 1,
  up: 2,
  down: 3,
};
let sX;
let sY;
// Find S coordinates
input.forEach((line, y) => {
  for (let x = 0; x < line.length; x++) {
    if (line[x] === 'S') {
      sX = x;
      sY = y;
    }
  }
});

/**** Part ONE ****/
const part1 = () => {
  let count = 0;
  let mode = MODE.right;
  let newX = sX + 1;
  let newY = sY;
  let pipe;
  while (pipe !== 'S') {
    count += 1;
    pipe = input[newY][newX];

    if (pipe === '|') {
      if (mode === MODE.up) {
        newY -= 1;
      } else if (mode === MODE.down) {
        newY += 1;
      }
    }
    if (pipe === '-') {
      if (mode === MODE.left) {
        newX -= 1;
      } else if (mode === MODE.right) {
        newX += 1;
      }
    }
    if (pipe === 'L') {
      if (mode === MODE.left) {
        newY -= 1;
        mode = MODE.up;
      } else if (mode === MODE.down) {
        newX += 1;
        mode = MODE.right;
      }
    }
    if (pipe === 'J') {
      if (mode === MODE.right) {
        newY -= 1;
        mode = MODE.up;
      } else if (mode === MODE.down) {
        newX -= 1;
        mode = MODE.left;
      }
    }
    if (pipe === '7') {
      if (mode === MODE.right) {
        newY += 1;
        mode = MODE.down;
      } else if (mode === MODE.up) {
        newX -= 1;
        mode = MODE.left;
      }
    }
    if (pipe === 'F') {
      if (mode === MODE.left) {
        newY += 1;
        mode = MODE.down;
      } else if (mode === MODE.up) {
        newX += 1;
        mode = MODE.right;
      }
    }
    if (pipe === '.') {
      console.log('ERROR ground reached !!!');
      return;
    }
  }

  console.log(count / 2);
};

const replaceAt = (line, index, replacement) => {
  return line.substring(0, index) + replacement + line.substring(index + replacement.length);
};

/**** Part TWO ****/
const part2 = () => {
  // Mark path.
  let mode = MODE.right;
  let newX = sX + 1;
  let newY = sY;
  let pipe;
  const pipeMap = new Array(input.length)
    .fill('')
    .map(() => new Array(input[0].length).fill(' ').join(''));
  while (pipe !== 'S') {
    pipe = input[newY][newX];
    pipeMap[newY] = replaceAt(pipeMap[newY], newX, pipe === '-' ? 'C' : 'X');
    // console.log(pipe);
    if (pipe === '|') {
      if (mode === MODE.up) {
        newY -= 1;
      } else if (mode === MODE.down) {
        newY += 1;
      }
    }
    if (pipe === '-') {
      if (mode === MODE.left) {
        newX -= 1;
      } else if (mode === MODE.right) {
        newX += 1;
      }
    }
    if (pipe === 'L') {
      if (mode === MODE.left) {
        newY -= 1;
        mode = MODE.up;
      } else if (mode === MODE.down) {
        newX += 1;
        mode = MODE.right;
      }
    }
    if (pipe === 'J') {
      if (mode === MODE.right) {
        newY -= 1;
        mode = MODE.up;
      } else if (mode === MODE.down) {
        newX -= 1;
        mode = MODE.left;
      }
    }
    if (pipe === '7') {
      if (mode === MODE.right) {
        newY += 1;
        mode = MODE.down;
      } else if (mode === MODE.up) {
        newX -= 1;
        mode = MODE.left;
      }
    }
    if (pipe === 'F') {
      if (mode === MODE.left) {
        newY += 1;
        mode = MODE.down;
      } else if (mode === MODE.up) {
        newX += 1;
        mode = MODE.right;
      }
    }
    if (pipe === '.') {
      console.log('ERROR ground reached !!!');
      return;
    }
  }

  // input.forEach((line) => {
  //   console.log(line);
  // });
  // pipeMap.forEach((line) => {
  //   console.log(line);
  // });

  // Count inner elements.
  let count = 0;
  for (let l = 0; l < input.length; l++) {
    const line = input[l];
    const pipeMapLine = pipeMap[l];
    let firstWall;
    // console.log(l, line);
    for (let i = 0; i < line.length - 1; i++) {
      if (pipeMapLine[i] === 'X' || pipeMapLine[i] === 'C') {
        if (firstWall === undefined) {
          firstWall = i;
        }
      } else if (firstWall !== undefined) {
        let nbWall = 0;
        let mode;
        for (let j = i; j < line.length; j++) {
          if (pipeMapLine[j] === 'X') {
            if (line[j] === '|') {
              nbWall += 1;
            }
            if (line[j] === 'L') {
              mode = 'L';
            }
            if (line[j] === 'J' && mode === 'L') {
              mode = undefined;
            }
            if (line[j] === '7' && mode === 'L') {
              nbWall += 1;
            }
            if (line[j] === 'F') {
              mode = 'F';
            }
            if (line[j] === '7' && mode === 'F') {
              mode = undefined;
            }
            if (line[j] === 'J' && mode === 'F') {
              nbWall += 1;
            }
          }
        }
        if (nbWall % 2 === 1) {
          count += 1;
        }
        // console.log(line[i], nbWall, count);
      }
    }
    //console.log(l, line, count);
  }
  console.log(count);
};

part1();
part2();
