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
  while (!tracks.every((track) => track[2] === 'Z')) {
    tracks = tracks.map((track) => map[track][steps[index]]);
    index += 1;
    if (index === steps.length) index = 0;
    nbSteps += 1;
  }
  console.log(nbSteps);
};

part1();
part2();
