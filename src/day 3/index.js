const fs = require('fs');
const path = require('path');
const { loadInput } = require('../utils');

const input = loadInput(3);
const MAX_COLUMNS = input[0].length;
const MAX_ROWS = input.length;

const isNumber = (value) => {
  return !Number.isNaN(parseInt(value));
};
const isSymbol = (value) => {
  return value !== '.' && Number.isNaN(parseInt(value));
};
const isGear = (value) => {
  return value === '*';
};

/**** Part ONE ****/
const part1 = () => {
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    const row = input[i];
    let number = '';
    for (let j = 0; j < row.length; j++) {
      const char = row[j];
      const checkSymbolAround = (checkOnTheEdge) => {
        if (number !== '') {
          let touchSymbol = false;
          const startX = checkOnTheEdge ? j - number.length : j - number.length - 1;
          const endX = j;
          const startY = i - 1;
          const endY = i + 1;
          let pointsAround = [];
          // Check char before on same line.
          if (startX >= 0) {
            pointsAround = pointsAround.concat(row[startX]);
          }
          // Check char after on same line.
          if (endX < MAX_COLUMNS) {
            pointsAround = pointsAround.concat(row[endX]);
          }
          // Check char on line above.
          if (startY >= 0) {
            const charsAbove = input[startY].slice(
              Math.max(startX, 0),
              Math.min(endX + 1, MAX_COLUMNS)
            );
            pointsAround = pointsAround.concat(charsAbove.split(''));
          }
          // Check char on line below.
          if (endY < MAX_ROWS) {
            const charsBelow = input[endY].slice(
              Math.max(startX, 0),
              Math.min(endX + 1, MAX_COLUMNS)
            );
            pointsAround = pointsAround.concat(charsBelow.split(''));
          }
          if (pointsAround.some(isSymbol)) {
            touchSymbol = true;
          }
          if (touchSymbol) {
            // console.log(number);
            sum += parseInt(number);
          }
        }
      };

      if (isNumber(char)) {
        number += char;
        if (j === row.length - 1) {
          checkSymbolAround(true);
          number = '';
        }
      } else {
        checkSymbolAround();
        number = '';
      }
    }
  }
  console.log(sum);
};

/**** Part TWO ****/
const part2 = () => {
  let sum = 0;
  for (let i = 1; i < input.length - 1; i++) {
    const row = input[i];
    for (let j = 0; j < row.length; j++) {
      const char = row[j];
      if (isGear(char)) {
        let nbNumber = 0;
        const getNumber = (indexRow, indexColumn, left) => {
          let number = '';
          for (let numI = 0; numI < 3; numI++) {
            if (left) {
              if (indexColumn - numI >= 0) {
                const char = input[indexRow][indexColumn - numI];
                if (isNumber(char)) {
                  number = char + number;
                } else {
                  break;
                }
              }
            } else {
              if (indexColumn + numI < MAX_COLUMNS) {
                const char = input[indexRow][indexColumn + numI];
                if (isNumber(char)) {
                  number = number + char;
                } else {
                  break;
                }
              }
            }
          }
          if (number !== '') {
            nbNumber++;
            return parseInt(number);
          }
          return 1;
        };
        const getLineNumber = (indexRow, indexColumn) => {
          let isLeftNumber, isMiddleNumber, isRightNumber;
          let leftNumber, middleNumber, rightNumber;
          if (indexColumn - 1 >= 0) {
            leftNumber = input[indexRow][indexColumn - 1];
            isLeftNumber = isNumber(leftNumber);
          }
          middleNumber = input[indexRow][indexColumn];
          isMiddleNumber = isNumber(middleNumber);
          if (indexColumn + 1 < MAX_COLUMNS) {
            rightNumber = input[indexRow][indexColumn + 1];
            isRightNumber = isNumber(rightNumber);
          }
          // Single digit middle number.
          if (!isLeftNumber && isMiddleNumber && !isRightNumber) {
            nbNumber++;
            return parseInt(middleNumber);
          }
          // Single centered number.
          if (isLeftNumber && isMiddleNumber && isRightNumber) {
            nbNumber++;
            return parseInt(leftNumber + middleNumber + rightNumber);
          }
          // Left number.
          if (isLeftNumber && isMiddleNumber && !isRightNumber) {
            return getNumber(indexRow, indexColumn, true);
          }
          if (isLeftNumber && !isMiddleNumber && !isRightNumber) {
            return getNumber(indexRow, indexColumn - 1, true);
          }
          // Right number.
          if (!isLeftNumber && isMiddleNumber && isRightNumber) {
            return getNumber(indexRow, indexColumn, false);
          }
          if (!isLeftNumber && !isMiddleNumber && isRightNumber) {
            return getNumber(indexRow, indexColumn + 1, false);
          }
          // Left and right number.
          if (isLeftNumber && !isMiddleNumber && isRightNumber) {
            return (
              getNumber(indexRow, indexColumn - 1, true) *
              getNumber(indexRow, indexColumn + 1, false)
            );
          }
          return 1;
        };

        const topLine = input[i - 1].slice(Math.max(j - 3, 0), Math.min(j + 3, MAX_COLUMNS) + 1);
        const middleLine = input[i].slice(Math.max(j - 3, 0), Math.min(j + 3, MAX_COLUMNS) + 1);
        const bottomLine = input[i + 1].slice(Math.max(j - 3, 0), Math.min(j + 3, MAX_COLUMNS) + 1);

        // Check char before on same line.
        const left = getNumber(i, j - 1, true);
        // Check char after on same line.
        const right = getNumber(i, j + 1, false);
        // Check char on line above.
        const top = getLineNumber(i - 1, j);
        // Check char on line below.
        const bottom = getLineNumber(i + 1, j);

        console.log(topLine, top);
        console.log(middleLine, left, right);
        console.log(bottomLine, bottom);
        if (nbNumber === 2) {
          sum += top * bottom * left * right;
        }
        console.log(sum, nbNumber === 2 ? top * bottom * left * right : '---');
        nbNumber = 0;
      }
    }
  }
  console.log(sum);
};

part1();
part2();
