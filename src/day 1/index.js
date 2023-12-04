const fs = require('fs');
const path = require('path');
const { loadInput } = require('../utils');

const input = loadInput(1);

/**** Part ONE ****/
const numberRegex1 = /\d/g;
let sum1 = 0;
input.forEach((line) => {
  if (!line) return;
  const numbers = line.match(numberRegex1);
  const num0 = numbers[0];
  const numLast = numbers[numbers.length - 1];
  // console.log(line, numbers, `${num0}${numLast}`);
  sum1 += parseInt(`${num0}${numLast}`);
});
console.log(sum1);

/**** Part TWO ****/
const numberRegex2a = /\d|one|two|three|four|five|six|seven|eight|nine/g;
const numberRegex2b =
  /\d|oneight|threeight|fiveight|nineight|twone|sevenine|eightwo|one|two|three|four|five|six|seven|eight|nine/g;
const numberRegex2c =
  /(?<first>\d|one|two|three|four|five|six|seven|eight|nine).*(?<last>\d|one|two|three|four|five|six|seven|eight|nine)/;
let sum2 = 0;
const textToNumber = (text) => {
  switch (text) {
    case 'one':
    case 'twone':
      return '1';
    case 'two':
    case 'eightwo':
      return '2';
    case 'three':
      return '3';
    case 'four':
      return '4';
    case 'five':
      return '5';
    case 'six':
      return '6';
    case 'seven':
      return '7';
    case 'eight':
    case 'oneight':
    case 'threeight':
    case 'fiveight':
    case 'nineight':
      return '8';
    case 'nine':
    case 'sevenine':
      return '9';
    default:
      return text;
  }
};

input.forEach((line) => {
  if (!line) return;
  // const numbersa = line.match(numberRegex2a);
  // const numbersb = line.match(numberRegex2b);
  // const num0 = textToNumber(numbersa[0]);
  // const numLast = textToNumber(numbersb[numbersb.length - 1]);
  // console.log(line, `${num0}${numLast}`);
  // sum2 += parseInt(`${num0}${numLast}`);

  let numbers = line.match(numberRegex2c);
  let num0;
  let numLast;
  if (numbers) {
    num0 = textToNumber(numbers.groups.first);
    numLast = textToNumber(numbers.groups.last);
  } else {
    // With a single number the groups are null.
    numbers = line.match(numberRegex2a);
    num0 = textToNumber(numbers[0]);
    numLast = textToNumber(numbers[0]);
  }
  console.log(line, `${num0}${numLast}`);
  sum2 += parseInt(`${num0}${numLast}`);
});
console.log(sum2);
