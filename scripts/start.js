const fs = require('fs');
const path = require('path');
const { MAX_DATE, BASE_FOLDER, DAY_FOLDER_NAME, INDEX_FILE_NAME } = require('./constants');

console.log();

const dayNumber = process.argv[2];
if (dayNumber === undefined) {
  console.error('Please provide a day number');
  console.log();
  process.exit(1);
}
if (dayNumber < 1 || dayNumber > MAX_DATE) {
  console.error(`The day number must be between 1 and ${MAX_DATE}`);
  console.log();
  process.exit(2);
}

const dayIndexFilePath = path.join(
  BASE_FOLDER,
  DAY_FOLDER_NAME.replace('{{day}}', dayNumber),
  INDEX_FILE_NAME
);

if (!fs.existsSync(dayIndexFilePath)) {
  console.error('The day file does not exist. Run `yarn initDays` first');
  console.log();
  process.exit(3);
}

require(path.join('..', dayIndexFilePath));
