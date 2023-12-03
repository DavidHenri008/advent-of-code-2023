const path = require('path');
const packageInfo = require('../package.json');

/**
 * Replace placeholders in a string identify with the pattern "Some {TEXT} to replace".
 * @param {String} str String containing replaceable placeholders.
 * @param {String} key Key representing the placeholder to replace, without curly braces.
 * @param {String} value Value to replace the placeholder
 * @returns {String} A new string with replaced placeholders.
 */
const replaceStrValue = (str, key, value) => {
  return str.replace('{' + key + '}', value);
};

/**
 * Format date and time.
 * @returns {String} The current date and time.
 */
const getDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day}_${hour}h${minutes}m${seconds}s`;
  const o1 = path.join('./', fullDate);
};

/**
 * Determine the absolute output path based on the arguments.
 * @param {Object} options Arguments passed to the application.
 * @returns {String} The absolute output path.
 */
const getOutputPath = (options) => {
  let output = options.output;
  if (options.outputTimestamp) {
    if (output === '' || output === '.' || output === './' || output === '.\\') {
      output = '';
    } else {
      output += '_';
    }
    output += getDate();
  }
  return path.resolve(output);
};

/**
 * Display a debug section in the console.
 * @param {Object} options Arguments passed to the application.
 * @param {String} title Title of the debug section.
 * @param {Any} data Data to display in the debug section.
 */
const logDebug = (options, title, data) => {
  if (options.debug) {
    // Skip line.
    console.log();
    console.log(`\x1b[35m${`**  ${title}  *`.padEnd(40, '*')}\x1b[0m`);
    console.log(`\x1b[34m${data}\x1b[0m`);
    console.log(`\x1b[35m${`*`.padEnd(40, '*')}\x1b[0m`);
  }
};

/**
 * Display information in the console according to options.
 * @param {Object} options Arguments passed to the application.
 * @param {Any} data Data to display.
 * @param {Any} mandatory Indicate if the data is needed in compact mode.
 *@param {Boolean} isError Indicate if it should be an error.
 */
const logInfo = (options, data = '', mandatory, isError) => {
  // Display information if mandatory or in non compact mode.
  if (mandatory || !options.compact) {
    if (isError) {
      console.error(data);
    } else {
      console.log(data);
    }
  }
};

/**
 * Display the progress in the console be re-writing the console line.
 * @param {Object} options Arguments passed to the application.
 * @param {String} dataFormat The type of artifact like ecy10, ecy20, ecy20_unsigned.
 * @param {Number} currentSize The number of received bytes.
 * @param {Number} finalSize The number of expected bytes.
 */
const displayDownloadProgress = (options, dataFormat, currentSize, finalSize) => {
  let formattedSize = Math.round(finalSize / 1024).toString();
  // Add space after 3 characters.
  if (formattedSize.length > 3) {
    formattedSize = formattedSize.slice(0, -3) + ' ' + formattedSize.slice(-3);
  }
  formattedSize = formattedSize.padStart(8);
  if (!options.compact) {
    process.stdout.write(
      `\r${dataFormat.padEnd(14)}\x1b[36m${formattedSize} KB      \x1b[0m${(
        Math.floor((currentSize / finalSize) * 1000) / 10
      ).toFixed(1)} %`
    );
  }
};

/**
 * Check the latest version available and display a message..
 */
const checkLatestVersion = async () => {
  try {
    // Need dynamic import because package-json is a ES module.
    const { default: packageJson } = await import('package-json');
    // Get latest version from the feed.
    const { version } = await packageJson(packageInfo.name);

    if (version === packageInfo.version) {
      return;
    }

    console.log();
    console.log('\x1b[33m**************************************************');
    console.log(`Your current version is out of date.`);
    console.log(
      `The latest version is \x1b[4m\x1b[32m${version}\x1b[0m\x1b[33m while you're on \x1b[4m${packageInfo.version}\x1b[0m\x1b[33m.`
    );
    console.log();
    console.log('To upgrade, run one of the following command:');
    console.log(' $ npm install -g @eclypse2/fetch-dcars');
    console.log(' $ yarn global add @eclypse2/fetch-dcars');
    console.log('**************************************************\x1b[0m');
  } catch (e) {
    // Do not block the download.
    console.log('\x1b[33mUnable to check the latest version available.\x1b[0m');
  }
};

module.exports = {
  replaceStrValue,
  getDate,
  getOutputPath,
  logDebug,
  logInfo,
  displayDownloadProgress,
  checkLatestVersion,
};
