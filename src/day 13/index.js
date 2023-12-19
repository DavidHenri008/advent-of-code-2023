const { loadInput } = require('../utils');

const input = loadInput(13);
const patterns = [];
let tempPattern = [];
input.forEach((line) => {
  if (!line) {
    patterns.push(tempPattern);
    tempPattern = [];
  } else {
    tempPattern.push(line);
  }
});
const stats = {};

const constructColumns = (pattern) => {
  let columns = [];
  for (let i = 0; i < pattern[0].length; i++) {
    const column = [];
    for (let j = 0; j < pattern.length; j++) {
      column.push(pattern[j][i]);
    }
    columns.push(column.join(''));
  }
  return columns;
};

/**** Part ONE ****/
const part1 = () => {
  let sum = 0;
  patterns.forEach((pattern, pIndex) => {
    // Construct columns
    let columns = constructColumns(pattern);

    const getStartIndex = (array) => {
      let isMirror = false;
      let startIndex;
      for (let i = 0; i < array.length - 1; i++) {
        if (array[i] === array[i + 1]) {
          startIndex = i;
          isMirror = true;
          // Compare before and after.
          for (let j = 0; j < array.length - (startIndex + 1); j++) {
            const left = array[startIndex - j];
            const right = array[startIndex + 1 + j];
            if (left !== right) {
              isMirror = false;
              break;
            }
            if (startIndex - j - 1 < 0) {
              break;
            }
          }
          if (isMirror) {
            break;
          }
        }
      }
      if (!isMirror) {
        startIndex = undefined;
      }
      return startIndex;
    };

    let index;
    // Columns compare
    index = getStartIndex(columns);
    if (index !== undefined) {
      stats[pIndex] = { type: 'column', index: index };
      sum += index + 1;
    } else {
      // Rows compare
      index = getStartIndex(pattern);
      if (index !== undefined) {
        stats[pIndex] = { type: 'row', index: index };
        sum += (index + 1) * 100;
      } else {
        console.log('NONE...');
        console.log(pattern);
      }
    }
  });
  console.log(sum);
};

/**** Part TWO ****/
const part2 = () => {
  let sum = 0;

  const toggleElement = (pattern, i, j) => {
    let newChar = '.';
    if (pattern[i][j] === '.') {
      newChar = '#';
    }
    pattern[i] = pattern[i].substring(0, j) + newChar + pattern[i].substring(j + 1);
  };

  patterns.forEach((pattern, pIndex) => {
    let foundNewLine = false;

    // Toggle one element at a time.
    for (let i = 0; i < pattern.length; i++) {
      if (foundNewLine) {
        break;
      }
      for (let j = 0; j < pattern[i].length; j++) {
        if (foundNewLine) {
          break;
        }
        // Toggle element.
        toggleElement(pattern, i, j);

        // Construct columns
        let columns = constructColumns(pattern);

        const getStartIndex = (array, type) => {
          let isMirror = false;
          let startIndex;
          for (let i = 0; i < array.length - 1; i++) {
            if (
              type !== stats[pIndex].type ||
              (type === stats[pIndex].type && i !== stats[pIndex].index)
            ) {
              if (array[i] === array[i + 1]) {
                startIndex = i;
                isMirror = true;
                // Compare before and after.
                for (let j = 0; j < array.length - (startIndex + 1); j++) {
                  const left = array[startIndex - j];
                  const right = array[startIndex + 1 + j];
                  if (left !== right) {
                    isMirror = false;
                    break;
                  }
                  if (startIndex - j - 1 < 0) {
                    break;
                  }
                }
                if (isMirror) {
                  break;
                }
              }
            }
          }
          if (!isMirror) {
            startIndex = undefined;
          }
          return startIndex;
        };

        // Columns compare
        const cIndex = getStartIndex(columns, 'column');
        const rIndex = getStartIndex(pattern, 'row');

        if (
          cIndex !== undefined &&
          ((stats[pIndex].type === 'column' && cIndex !== stats[pIndex].index) ||
            stats[pIndex].type !== 'column')
        ) {
          sum += cIndex + 1;
          foundNewLine = true;
        } else if (
          rIndex !== undefined &&
          ((stats[pIndex].type === 'row' && rIndex !== stats[pIndex].index) ||
            stats[pIndex].type !== 'row')
        ) {
          sum += (rIndex + 1) * 100;
          foundNewLine = true;
        }

        // Toggle element.
        toggleElement(pattern, i, j);
      }
    }

    if (!foundNewLine) {
      console.log('NONE...', pIndex, stats[pIndex]);
      console.log(pattern);
    }
  });
  console.log(sum);
};

part1();
part2();
