const fs = require('fs');
const path = require('path');
const { loadInput } = require('../utils');

const input = loadInput(6);

const races = [
  { time: 40, minDistance: 215 },
  { time: 70, minDistance: 1051 },
  { time: 98, minDistance: 2147 },
  { time: 79, minDistance: 1005 },
];

/**** Part ONE ****/
const part1 = () => {
  let result = 1;
  races.forEach(({ time, minDistance }) => {
    let nbWin = 0;
    for (let i = 0; i < time; i++) {
      const dist = (time - i) * i;
      if (dist > minDistance) {
        nbWin += 1;
      }
    }
    result *= nbWin;
  });
  console.log(result);
};

/**** Part TWO ****/
const part2 = () => {
  const time = 40709879;
const minDistance = 215105121471005;
  let nbWin = 0;
    for (let i = 0; i < time; i++) {
      const dist = (time - i) * i;
      if (dist > minDistance) {
        nbWin += 1;
      }
    }
  console.log(nbWin);
};

part1();
part2();
