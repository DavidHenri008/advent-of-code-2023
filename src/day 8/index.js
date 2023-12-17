const fs = require('fs');
const path = require('path');
const { loadInput } = require('../utils');

const input = loadInput(8);
const steps = input[0];
const map = {};
for (let i = 2; i < input.length; i++) {
  if (!input[i]) break;
  const parts = input[i].match(/(\w{3}) = \((\w{3}), (\w{3})\)/);
  map[parts[1]] = {
    L: parts[2],
    R: parts[3],
  };
}

/**** Part ONE ****/
const part1 = () => {
  const firstStep = 'AAA';
  const lastStep = 'ZZZ';

  let nbSteps = 0;
  let index = 0;
  let track = firstStep;
  while (track !== lastStep) {
    track = map[track][steps[index]];
    index += 1;
    if (index === steps.length) index = 0;
    nbSteps += 1;
  }
  console.log(nbSteps);
};

/**** Part TWO ****/
const part2 = () => {
  let nbSteps = 0;
  let index = 0;

  let tracks = Object.keys(map).filter((v) => v[2] == 'A');
  let preResults = [];
  tracks.forEach((track) => {
    let nbSteps = 0;
    let index = 0;
    while (track[2] !== 'Z') {
      track = map[track][steps[index]];
      index += 1;
      if (index === steps.length) index = 0;
      nbSteps += 1;
    }
    preResults.push(nbSteps);
  });

  preResults.sort((a, b) => a - b);
  function gcd(a, b) {
    return !b ? a : gcd(b, a % b);
  }
  function lcm(a, b) {
    return (a * b) / gcd(a, b);
  }
  let multiple = preResults[0];
  preResults.forEach(function (n) {
    multiple = lcm(multiple, n);
  });

  console.log(multiple);
};

// const map = new Map();
// for (let i = 2; i < input.length; i++) {
//   if (!input[i]) break;
//   const parts = input[i].match(/(\w{3}) = \((\w{3}), (\w{3})\)/);
//   map.set(parts[1], {
//     L: parts[2],
//     R: parts[3],
//   });
// }
// const part2 = () => {
//   let nbSteps = 0;
//   let index = 0;

//   let tracks = Object.keys(map).filter((v) => v[2] == 'A');
//   while (!tracks.every((track) => track[2] === 'Z')) {
//     tracks = tracks.map((track) => map[track][steps[index]]);
//     index += 1;
//     if (index === steps.length) index = 0;
//     nbSteps += 1;
//   }
//   console.log(nbSteps);
// };
// const part2 = () => {
//   let nbSteps = 0;
//   let index = 0;

//   let tracks = [...map.keys()].filter((v) => v[2] == 'A');
//   while (
//     tracks[0][2] !== 'Z' ||
//     tracks[1][2] !== 'Z' ||
//     tracks[2][2] !== 'Z' ||
//     tracks[3][2] !== 'Z' ||
//     tracks[4][2] !== 'Z' ||
//     tracks[5][2] !== 'Z'
//   ) {
//     tracks[0] = map.get(tracks[0])[steps[index]];
//     tracks[1] = map.get(tracks[1])[steps[index]];
//     tracks[2] = map.get(tracks[2])[steps[index]];
//     tracks[3] = map.get(tracks[3])[steps[index]];
//     tracks[4] = map.get(tracks[4])[steps[index]];
//     tracks[5] = map.get(tracks[5])[steps[index]];
//     index += 1;
//     if (index === steps.length) index = 0;
//     nbSteps += 1;
//   }
//   console.log(nbSteps);
// };

part1();
part2();
