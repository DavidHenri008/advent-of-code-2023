/**
 * This code fetch the latest version of dcars from published artifact of the listed build pipelines.
 *
 * The current PERSONAL_ACCESS_TOKEN is one form David Henri and has only the read access to the build functionalities.
 */

/* Access token with only Build-read access. */
const PERSONAL_ACCESS_TOKEN = 'bhs7fo7wdt35v5kshh7uqpu6bbfapdti5eokm2v7haxe5eypbrpq';

/* Package requirements */
const http = require('https');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const {
  replaceStrValue,
  getOutputPath,
  logDebug,
  logInfo,
  displayDownloadProgress,
  getDate,
  checkLatestVersion,
} = require('./utils');
const {
  BUILD_PIPELINE_ID,
  BUILD_ID,
  HOSTNAME,
  DEFAULT_EXTENSION,
  BUILD_LATEST_URL,
  ARTIFACT_URL,
  ARTIFACT_DCAR_ENDING,
  ARTIFACT_ECY10_ENDING,
  ARTIFACT_ECY20_ENDING,
  ARTIFACT_ECY20_UNSIGNED_ENDING,
  ARTIFACT_DCAF_DISTRIBUTION_ENDING,
  ARTIFACT_ECY10_DATA_FORMAT,
  ARTIFACT_ECY20_DATA_FORMAT,
  ARTIFACT_ECY20_UNSIGNED_DATA_FORMAT,
  BRANCH_NAME,
  DCAF_DISTRIBUTION_URL,
  DCARS_DEFINITION_URL,
  ARTIFACT_HORYZONC_ENDING,
  ARTIFACT_HORYZONC_DATA_FORMAT,
} = require('./constants');

/**
 * Fetch repository DCARS definition and DCAF distribution when downloadDistribution is true
 * @param {Object} options Application options.
 * @param {boolean} downloadDistribution
 * @returns
 */
async function getBuildPipelineInfos(options) {
  let buildPipelineData = [];

  const dcarsDefinitionUrl = replaceStrValue(DCARS_DEFINITION_URL, BRANCH_NAME, options.branchName);
  logDebug(options, 'DCARS build definition URL', dcarsDefinitionUrl);

  const dcarsBuilds = await getInfo(options, 'DCARS Build Definitions', dcarsDefinitionUrl);

  buildPipelineData = dcarsBuilds?.value.map((dcarsBuild) => {
    return {
      name: dcarsBuild.name,
      buildId: dcarsBuild.id,
    };
  });

  // Only fetching the DCAF Distribution infos when needed
  if (!options.noSoftEclypse) {
    const dcafDistributionUrl = replaceStrValue(
      DCAF_DISTRIBUTION_URL,
      BRANCH_NAME,
      options.branchName
    );
    logDebug(options, 'Latest DCAF distribution URL', dcafDistributionUrl);

    const dcafDistribution = await getInfo(options, 'DCAF Distribution', dcafDistributionUrl);
    dcafDistribution?.value.forEach((dcafDist) => {
      buildPipelineData.push({
        name: dcafDist.name,
        buildId: dcafDist.id,
        extension: 'zip',
      });
    });

    logDebug(options, 'All build infos', JSON.stringify(buildPipelineData));
  }

  /* List of build pipelines to fetch. The name must match the output file name from the yml (outputBaseName). */
  return buildPipelineData;
}

/**
 * Generates the HTTP query request options
 * @param {Object} reqOptions Additional options.
 * @param {String} urlPath Url where to get information.
 * @returns {Object}
 */
function getRequestOptions(reqOptions, urlPath) {
  return {
    hostname: reqOptions.hostname,
    path: urlPath,
    headers: {
      Accept: '*/*',
      Authorization: 'Basic ' + Buffer.from(':' + PERSONAL_ACCESS_TOKEN).toString('base64'),
      ...reqOptions.headers,
    },
  };
}

/**
 * Get information from REST API.
 * @param {Object} options Application options.
 * @param {String} buildPipelineName Name of the build pipeline.
 * @param {String} urlPath Url where to get information.
 * @param {Object} reqOptions Additional options.
 * @returns {Promise}
 */
const getInfo = (
  options,
  buildPipelineName,
  urlPath,
  reqOptions = { hostname: HOSTNAME, headers: {} }
) => {
  const requestOptions = getRequestOptions(reqOptions, urlPath);

  return new Promise((resolve, reject) => {
    const req = http.request(requestOptions, (res) => {
      let rawData;
      let rawDataSize = 0;

      if (res.statusCode >= 300) {
        return reject(
          `Invalid request ${buildPipelineName}. Status code ${res.statusCode}: ${res.statusMessage}`
        );
      }

      res.on('data', (chunk) => {
        if (res.headers['content-type'].indexOf('application/json') !== -1) {
          // Treat json data.
          if (rawData === undefined) {
            rawData = '';
          }
          rawData += chunk;
        } else {
          // Treat zip file data.
          if (rawData === undefined) {
            rawData = [];
          }
          rawData.push(chunk);
          rawDataSize += chunk.length;
          displayDownloadProgress(options, reqOptions.dataFormat, rawDataSize, reqOptions.dataSize);
        }
      });

      res.on('end', () => {
        try {
          let parsedData;
          if (res.headers['content-type'].indexOf('application/json') !== -1) {
            parsedData = JSON.parse(rawData);
          } else {
            // Force 100% since in some case the value ends at 99.8% or 100.1%.
            displayDownloadProgress(
              options,
              reqOptions.dataFormat,
              reqOptions.dataSize,
              reqOptions.dataSize
            );
            // Skip a line when file download is done.
            logInfo(options);
            // Convert data array to a buffer.
            parsedData = Buffer.concat(rawData);
          }
          resolve(parsedData);
        } catch (e) {
          reject(`Cannot parse response from request ${buildPipelineName}. ${e.message}`);
        }
      });
    });

    req.on('error', (e) => {
      reject(`An error occurred with request ${buildPipelineName}. ${e.message}`);
    });

    req.end();
  });
};

/**
 * Download latest build pipeline dcars.
 * @param {Object} options Application options.
 * @param {Object} buildPipeline Build pipeline information.
 */
const downloadDcar = async (options, buildPipeline) => {
  let zipEcy10 = options.distributionFileZipEcy10;
  let zipEcy20 = options.distributionFileZipEcy20;
  // Set true when the user asked for a specific platform (ecy10, ecy20 or horyzonc)
  const isSpecificPlatform = options.ecy10Only || options.ecy20Only || options.horyzonc;

  // Read latest build information.
  let url = replaceStrValue(BUILD_LATEST_URL, BUILD_PIPELINE_ID, buildPipeline.buildId);
  url = replaceStrValue(url, BRANCH_NAME, options.branchName);
  try {
    logInfo(
      options,
      `\x1b[32mDownloading ${buildPipeline.name} ${buildPipeline.extension} \x1b[35m(from ${options.branchName})\x1b[0m`,
      true
    );

    // Read latest build pipeline information.
    logDebug(options, 'Latest build url', url);
    const latestBuild = await getInfo(options, buildPipeline.name, url);
    logDebug(options, 'Latest build info', JSON.stringify(latestBuild));
    const buildId = latestBuild.id;
    const buildNumber = latestBuild.buildNumber;

    // Read artifacts list.
    url = replaceStrValue(ARTIFACT_URL, BUILD_ID, buildId);
    logDebug(options, 'Artifacts list url', url);
    const artifactsList = await getInfo(options, buildPipeline.name, url);
    const unsignedAvailable = artifactsList.value.some((artifact) =>
      artifact.name.endsWith(ARTIFACT_ECY20_UNSIGNED_ENDING)
    );

    // Download each artifact.
    for (const artifact of artifactsList.value) {
      logDebug(options, 'Artifact info', JSON.stringify(artifact));
      const artifactName = artifact.name;
      const artifactSize = artifact.resource.properties.artifactsize;
      let artifactType = '';

      // Validate if artefact name matches the pattern.
      if (options.pattern) {
        if (!artifactName.includes(options.pattern)) {
          continue;
        }
      }

      if (artifactName.endsWith(ARTIFACT_ECY10_ENDING)) {
        artifactType = ARTIFACT_ECY10_DATA_FORMAT;
        // Skip this file if the type is not needed.
        if (isSpecificPlatform && !options.ecy10Only) {
          continue;
        }
      }
      if (artifactName.endsWith(ARTIFACT_ECY20_ENDING)) {
        artifactType = ARTIFACT_ECY20_DATA_FORMAT;
        // Skip this file if the type is not needed or if an unsigned version is available and required.
        if ((isSpecificPlatform && !options.ecy20Only) || (options.unsigned && unsignedAvailable)) {
          continue;
        }
      }
      if (artifactName.endsWith(ARTIFACT_ECY20_UNSIGNED_ENDING)) {
        artifactType = ARTIFACT_ECY20_UNSIGNED_DATA_FORMAT;
        // Skip this file if the type is not needed.
        if (isSpecificPlatform && !options.unsigned) {
          continue;
        }
      }
      if (artifactName.endsWith(ARTIFACT_HORYZONC_ENDING)) {
        artifactType = ARTIFACT_HORYZONC_DATA_FORMAT;
        // Skip this file if the type is not needed.
        if (isSpecificPlatform && !options.horyzonc) {
          continue;
        }
      }
      // Skip this file if is not recognized.
      if (
        !artifactName.endsWith(ARTIFACT_DCAR_ENDING) &&
        !artifactName.endsWith(ARTIFACT_ECY10_ENDING) &&
        !artifactName.endsWith(ARTIFACT_ECY20_ENDING) &&
        !artifactName.endsWith(ARTIFACT_ECY20_UNSIGNED_ENDING) &&
        !artifactName.endsWith(ARTIFACT_HORYZONC_ENDING) &&
        !artifactName.endsWith(ARTIFACT_DCAF_DISTRIBUTION_ENDING)
      ) {
        continue;
      }

      // Split download url into hostname and path.
      let downloadUrl = artifact.resource.downloadUrl;
      downloadUrl = downloadUrl.replace('https://', '');
      const firstSlashIndex = downloadUrl.indexOf('/');
      const hostname = downloadUrl.slice(0, firstSlashIndex);
      downloadUrl = downloadUrl.slice(firstSlashIndex);

      // Read compressed artifact.
      logDebug(options, 'Download url', downloadUrl);
      const fileContent = await getInfo(options, buildPipeline.name, downloadUrl, {
        dataFormat: artifactType,
        dataSize: Number(artifactSize),
        hostname,
        headers: {},
      });

      // Unzip artifact.
      const zippedData = await JSZip.loadAsync(fileContent);
      for (const file of Object.values(zippedData.files)) {
        const fileInfo = path.parse(file.name);
        // Save only file with the desired extension.
        if (!buildPipeline.extension || fileInfo.ext.replace('.', '') === buildPipeline.extension) {
          const unzippedData = await zippedData.file(file.name).async('uint8array');
          // Write file on disk.
          fs.writeFileSync(path.join(options.output, fileInfo.base), unzippedData);
          // Add data to zip but skip distribution file.
          if (
            zipEcy10 &&
            (artifactName.endsWith(ARTIFACT_DCAR_ENDING) ||
              artifactName.endsWith(ARTIFACT_ECY10_ENDING))
          ) {
            zipEcy10.file(fileInfo.base, unzippedData);
          }
          if (
            zipEcy20 &&
            (artifactName.endsWith(ARTIFACT_DCAR_ENDING) ||
              artifactName.endsWith(ARTIFACT_ECY20_ENDING) ||
              artifactName.endsWith(ARTIFACT_ECY20_UNSIGNED_ENDING))
          ) {
            zipEcy20.file(fileInfo.base, unzippedData);
          }
        }
      }
    }
  } catch (error) {
    // Skip line.
    logInfo(options);
    logInfo(options, error, true, true);
  }
};

/**
 * Asynchronous function to download dcars of each pipeline.
 */
const run = async (options) => {
  const outputPath = getOutputPath(options);
  await checkLatestVersion();

  // Prepare folder
  if (!fs.existsSync(outputPath)) {
    fs.mkdir(outputPath, { recursive: true }, (err) => {
      if (err) logInfo(options, err, true, true);
    });
  }

  let zipEcy10;
  let zipEcy20;
  // Create distribution file if needed.
  if (options.distributionFile) {
    if (!options.ecy20Only) {
      zipEcy10 = new JSZip();
    }
    if (!options.ecy10Only) {
      zipEcy20 = new JSZip();
    }
  }

  // Dynamically Fetch and rebuild BUILD_PIPELINES
  const buildPipelineData = await getBuildPipelineInfos(options);

  // Skip line.
  logInfo(options);
  for (let buildPipeline of buildPipelineData) {
    const startTime = new Date();
    await downloadDcar(
      {
        ...options,
        output: outputPath,
        distributionFileZipEcy10: zipEcy10,
        distributionFileZipEcy20: zipEcy20,
      },
      {
        ...buildPipeline,
        extension: buildPipeline.extension || DEFAULT_EXTENSION,
      }
    );
    // Skip line.
    const endTime = new Date();
    var timeDiff = Math.round((endTime - startTime) / 10) / 100;
    logInfo(options, `\x1b[33m${timeDiff} s\x1b[0m`);
    // Skip line.
    logInfo(options);
  }

  // Write distribution file if needed.
  if (zipEcy10) {
    logInfo(options, `\x1b[32mCreating distribution file for ECY 1.0\x1b[0m`, true);
    await zipEcy10.generateAsync({ type: 'nodebuffer' }).then(function (content) {
      const timestamp = new Date();
      const zipFilePath = path.join(outputPath, `Eclypse_Distribution_ECY10_${getDate()}.zip`);
      fs.writeFileSync(zipFilePath, content, function (error) {
        logInfo(options, error, true, true);
      });
    });
    // Skip line.
    logInfo(options);
  }
  if (zipEcy20) {
    logInfo(options, `\x1b[32mCreating distribution file for ECY 2.0\x1b[0m`, true);
    await zipEcy20.generateAsync({ type: 'nodebuffer' }).then(function (content) {
      const timestamp = new Date();
      const zipFilePath = path.join(outputPath, `Eclypse_Distribution_ECY20_${getDate()}.zip`);
      fs.writeFileSync(zipFilePath, content, function (error) {
        logInfo(options, error, true, true);
      });
    });
    // Skip line.
    logInfo(options);
  }

  // Display destination folder.
  logInfo(options, `Downloaded in \x1b[36m${outputPath}\x1b[0m`, true);
  // Skip line.
  logInfo(options);
};

module.exports = run;
