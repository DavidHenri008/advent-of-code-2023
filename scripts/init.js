const fs = require('fs');
const path = require('path');
const https = require('https');
const {
  MAX_DATE,
  BASE_FOLDER,
  DAY_FOLDER_NAME,
  INPUT_FOLDER_NAME,
  INPUT_FILE_NAME,
  INDEX_FILE_NAME,
} = require('./constants');

const INPUT_URL = 'https://adventofcode.com/2023/day/{{day}}/input';
const AOC_COOKIE =
  'session=53616c7465645f5fbdd809381cecac80290326579b2e2c6f70202f17870ec290b67068f86b8bf4bdedda91d6e99d726ff0fd6380cf310786ee233c0d547e41a5';

const currentDate = new Date();
let daysToLoad = currentDate.getDate();

// Set daysToLoad to MAX_DATE if the current date is past December 25th, 2023.
if (
  currentDate.getFullYear() > 2023 ||
  currentDate.getMonth() !== 11 ||
  currentDate.getDate() > MAX_DATE
) {
  daysToLoad = MAX_DATE;
}

async function initDays() {
  for (let day = 1; day <= daysToLoad; day++) {
    const folderPath = path.join(BASE_FOLDER, DAY_FOLDER_NAME.replace('{{day}}', day));
    const inputFolderPath = path.join(folderPath, INPUT_FOLDER_NAME);
    const inputFilePath = path.join(inputFolderPath, INPUT_FILE_NAME);
    const indexFilePath = path.join(folderPath, INDEX_FILE_NAME);

    // Create folder structure if it doesn't exist.
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      fs.mkdirSync(inputFolderPath);
    }

    // Fetch input file if it doesn't exist.
    if (!fs.existsSync(inputFilePath)) {
      const response = await fetch(INPUT_URL.replace('{{day}}', day), {
        method: 'get',
        headers: { Cookie: AOC_COOKIE },
      });
      if (response.status >= 300) {
        console.error(
          `Invalid request for day ${day}. Status code ${response.status}: ${response.statusText}`
        );
      } else {
        await response
          .text()
          .then((data) => {
            fs.writeFileSync(inputFilePath, data);
            console.log(`Day ${day} input saved to ${inputFilePath}`);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }

    // Create index.js if it doesn't exist.

    if (!fs.existsSync(indexFilePath)) {
      const data = `const { loadInput } = require('../utils');\n\nconst input = loadInput(${day});\n\n/**** Part ONE ****/\nconst part1 = () => {\n\n};\n\n/**** Part TWO ****/\nconst part2 = () => {\n\n};\n\npart1();\npart2();\n`;
      fs.writeFileSync(indexFilePath, data);
    }
  }
}

initDays();
