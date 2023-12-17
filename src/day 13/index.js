const fs = require('fs');
const path = require('path');
const { loadInput } = require('../utils');

const input = loadInput(13);
const pattern = [];
let tempPattern = [];
input.forEach((line) => {
  if (!line) {
    tempPattern.push(line.split(''));
  } else {
    pattern.push(tempPattern);
    tempPattern = [];
  }
});
console.log(pattern);

/**** Part ONE ****/
const part1 = () => {};

/**** Part TWO ****/
const part2 = () => {};

part1();
part2();
