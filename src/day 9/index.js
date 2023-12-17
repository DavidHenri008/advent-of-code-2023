const fs = require('fs');
const path = require('path');
const { loadInput } = require('../utils');

const input = loadInput(9);

/**** Part ONE ****/
const part1 = () => {
  let sum = 0;

  const calcDiff = (numbers) => {
    const diff = [];
    for (let i = 1; i < numbers.length; i++) {
      diff.push(numbers[i] - numbers[i - 1]);
    }
    if (diff.every((d) => d === 0)) {
      return diff[diff.length - 1];
    } else {
      const precValue = calcDiff(diff);
      return precValue + diff[diff.length - 1];
    }
  };

  input.forEach((line) => {
    if (!line) return;
    const numbers = line.split(' ').map(Number);
    const extrapolate = calcDiff(numbers);
    sum += numbers[numbers.length - 1] + extrapolate;
  });

  console.log(sum);
};

/**** Part TWO ****/
const part2 = () => {
  let sum = 0;

  const calcDiff = (numbers) => {
    const diff = [];
    for (let i = 1; i < numbers.length; i++) {
      diff.push(numbers[i] - numbers[i - 1]);
    }
    if (diff.every((d) => d === 0)) {
      return diff[0];
    } else {
      const precValue = calcDiff(diff);
      return diff[0] - precValue;
    }
  };

  input.forEach((line) => {
    if (!line) return;
    const numbers = line.split(' ').map(Number);
    const extrapolate = calcDiff(numbers);
    sum += numbers[0] - extrapolate;
  });

  console.log(sum);
};

part1();
part2();
