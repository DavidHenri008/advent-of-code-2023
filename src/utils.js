const fs = require('fs');
const path = require('path');
const {
  BASE_FOLDER,
  DAY_FOLDER_NAME,
  INPUT_FILE_NAME,
  INPUT_FOLDER_NAME,
} = require('../scripts/constants');

const loadInput = (day) => {
  try {
    var data = fs.readFileSync(
      path.join(
        process.cwd(),
        BASE_FOLDER,
        DAY_FOLDER_NAME.replace('{{day}}', day),
        INPUT_FOLDER_NAME,
        INPUT_FILE_NAME
      ),
      'utf8'
    );
  } catch (e) {
    console.log('Error:', e.stack);
  }
  return data.toString().split('\n');
};

module.exports = {
  loadInput,
};
