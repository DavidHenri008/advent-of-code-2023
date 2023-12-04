const fs = require('fs');
const path = require('path');
const { loadInput } = require('../utils');

const input = loadInput(2);

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;
/**** Part ONE ****/
const part1 = (params) => {
  let sum = 0;
  input.forEach((line, index) => {
    if (!line) return;
    const redMatches = line.match(/\d+ red/g).map((match) => match.replace(' red', ''));
    const greenMatches = line.match(/\d+ green/g).map((match) => match.replace(' green', ''));
    const blueMatches = line.match(/\d+ blue/g).map((match) => match.replace(' blue', ''));
    const gameId = index + 1;
    // console.log(gameId, redMatches, greenMatches, blueMatches);
    if (
      redMatches.some((match) => parseInt(match) > MAX_RED) ||
      greenMatches.some((match) => parseInt(match) > MAX_GREEN) ||
      blueMatches.some((match) => parseInt(match) > MAX_BLUE)
    ) {
      return;
    }
    sum += gameId;
  });
  console.log(sum);
};

/**** Part TWO ****/
const part2 = (params) => {
  let sum = 0;
  input.forEach((line, index) => {
    if (!line) return;
    const redMatches = line.match(/\d+ red/g).map((match) => match.replace(' red', ''));
    const greenMatches = line.match(/\d+ green/g).map((match) => match.replace(' green', ''));
    const blueMatches = line.match(/\d+ blue/g).map((match) => match.replace(' blue', ''));
    const gameId = index + 1;
    // console.log(gameId, redMatches, greenMatches, blueMatches);
    const maxRed = redMatches.reduce((acc, value) => Math.max(acc, value), 0);
    const maxGreen = greenMatches.reduce((acc, value) => Math.max(acc, value), 0);
    const maxBlue = blueMatches.reduce((acc, value) => Math.max(acc, value), 0);
    sum += maxRed * maxGreen * maxBlue;
  });
  console.log(sum);
};

part1();
part2();
