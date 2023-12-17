const { loadInput } = require('../utils');

let input = loadInput(11);
input = input.map((row) => row.split(''));

let emptyRows = input.reduce((acc, row, i) => {
  if (row.length > 0 && !row.includes('#')) {
    acc.push(i);
  }
  return acc;
}, []);
let emptyColumns = [];
for (let i = 0; i < input[0].length; i++) {
  let column = input.map((row) => row[i]);
  if (!column.includes('#')) {
    emptyColumns.push(i);
  }
}
const expand = (expansion) => {
  for (let i = 0; i < emptyRows.length; i++) {
    const index = emptyRows[emptyRows.length - 1 - i];
    for (let j = 0; j < expansion; j++) {
      input.splice(index + j, 0, [...input[index]]);
    }
  }
  for (let i = 0; i < emptyColumns.length; i++) {
    const index = emptyColumns[emptyColumns.length - 1 - i];
    for (let j = 0; j < input.length; j++) {
      if (input[j].length > 0) {
        for (let k = 0; k < expansion; k++) {
          input[j].splice(index + k, 0, '.');
        }
      }
    }
  }
};

// input.forEach((row, index) => {
//   console.log(index, row.join(''));
// });
// console.log(input.length, input[0].length);

const getGalaxies = () => {
  const galaxies = {};
  let count = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === '#') {
        galaxies[count] = {
          x: j,
          y: i,
        };
        count += 1;
      }
    }
  }
  return galaxies;
};

/**** Part ONE ****/
const part1 = () => {
  let sum = 0;

  //expand(1);

  // Galaxy coordinates.
  const galaxies = getGalaxies();
  const g = Object.values(galaxies);
  for (let i = 0; i < g.length; i++) {
    for (let j = i; j < g.length; j++) {
      const dist = Math.abs(g[i].x - g[j].x) + Math.abs(g[i].y - g[j].y);
      sum += dist;
    }
  }
  console.log(sum);
};

/**** Part TWO ****/
const part2 = () => {
  let sum = 0;
  // console.log('col', emptyColumns.join(' '));
  // console.log('row', emptyRows.join(' '));

  const calcDiff = (v1, v2, emptyArray) => {
    let minIndex = -1;
    let maxIndex = -1;
    let minValue = Math.min(v1, v2);
    let maxValue = Math.max(v1, v2);
    for (let k = 0; k < emptyArray.length; k++) {
      if (minValue > emptyArray[k]) {
        minIndex = k;
      }
      if (maxValue > emptyArray[k]) {
        maxIndex = k;
      }
    }

    return (maxIndex - minIndex) * 999999;
  };

  // Galaxy coordinates.
  const galaxies = getGalaxies();
  const g = Object.values(galaxies);
  for (let i = 0; i < g.length; i++) {
    for (let j = i + 1; j < g.length; j++) {
      let dist = Math.abs(g[i].x - g[j].x) + Math.abs(g[i].y - g[j].y);
      dist += calcDiff(g[i].x, g[j].x, emptyColumns);
      dist += calcDiff(g[i].y, g[j].y, emptyRows);
      sum += dist;
    }
  }
  console.log(sum);
};

const res001 = 8624388;
const res002 = 9370588;
const res010 = 15340188;
const res020 = 22802188;

// console.log('10-1', res010 - res001);
// console.log('100-1', res100 - res001);
// console.log('(10-1)/10', (res010 - res001) / 10);
// console.log('(20-1)/20', (res020 - res001) / 20);
// console.log('(100-1)/100', (res100 - res001) / 100);
// (res010-x)/10 = (res020-x)/20
// x = 7878188
// (res010-x)/10 = 746200
// res1M = 746200 * 1000000 + x
console.log('2*res010-res020', 2 * res010 - res020);
console.log('(res010-x)/10', (res010 - 7878188) / 10);
console.log('res1M', ((res002 - 7878188) / 2) * 1000000 + 7878188);

part1();
part2();
