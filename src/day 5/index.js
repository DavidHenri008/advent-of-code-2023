const fs = require('fs');
const path = require('path');
const { loadInput } = require('../utils');

const input = loadInput(5);

/**** Part ONE ****/
const part1 = () => {
  const seedsColonIndex = input[0].indexOf(':');
  const seeds = input[0]
    .slice(seedsColonIndex + 2)
    .split(' ')
    .map(Number);

  const getMap = (lineMin, lineMax) => {
    const map = [];
    for (let i = lineMin; i < lineMax; i++) {
      const numbers = input[i].split(' ').map(Number);
      map.push({
        destinationStart: numbers[0],
        destinationEnd: numbers[0] + numbers[2],
        sourceStart: numbers[1],
        sourceEnd: numbers[1] + numbers[2],
      });
    }
    return map;
  };

  const seed2soilMap = getMap(3, 10);
  const soil2fertilizerMap = getMap(12, 58);
  const fertilizer2waterMap = getMap(60, 109);
  const water2lightMap = getMap(111, 134);
  const light2temperatureMap = getMap(136, 182);
  const temperature2humidityMap = getMap(182, 200);
  const humidity2locationMap = getMap(202, 226);

  let minSeedLocation = Number.MAX_SAFE_INTEGER;
  seeds.forEach((seed, i) => {
    const seed2soil = seed2soilMap.find((map) => map.sourceStart <= seed && map.sourceEnd >= seed);
    let soilValue = seed;
    if (seed2soil) {
      soilValue = seed - seed2soil.sourceStart + seed2soil.destinationStart;
    }
    const soil2fertilizer = soil2fertilizerMap.find(
      (map) => map.sourceStart <= soilValue && map.sourceEnd >= soilValue
    );
    let fertilizerValue = soilValue;
    if (soil2fertilizer) {
      fertilizerValue = soilValue - soil2fertilizer.sourceStart + soil2fertilizer.destinationStart;
    }
    const fertilizer2water = fertilizer2waterMap.find(
      (map) => map.sourceStart <= fertilizerValue && map.sourceEnd >= fertilizerValue
    );
    let waterValue = fertilizerValue;
    if (fertilizer2water) {
      waterValue =
        fertilizerValue - fertilizer2water.sourceStart + fertilizer2water.destinationStart;
    }
    const water2light = water2lightMap.find(
      (map) => map.sourceStart <= waterValue && map.sourceEnd >= waterValue
    );
    let lightValue = waterValue;
    if (water2light) {
      lightValue = waterValue - water2light.sourceStart + water2light.destinationStart;
    }
    const light2temperature = light2temperatureMap.find(
      (map) => map.sourceStart <= lightValue && map.sourceEnd >= lightValue
    );
    let temperatureValue = lightValue;
    if (light2temperature) {
      temperatureValue =
        lightValue - light2temperature.sourceStart + light2temperature.destinationStart;
    }
    const temperature2humidity = temperature2humidityMap.find(
      (map) => map.sourceStart <= temperatureValue && map.sourceEnd >= temperatureValue
    );
    let humidityValue = temperatureValue;
    if (temperature2humidity) {
      humidityValue =
        temperatureValue - temperature2humidity.sourceStart + temperature2humidity.destinationStart;
    }
    const humidity2location = humidity2locationMap.find(
      (map) => map.sourceStart <= humidityValue && map.sourceEnd >= humidityValue
    );
    let locationValue = humidityValue;
    if (humidity2location) {
      locationValue =
        humidityValue - humidity2location.sourceStart + humidity2location.destinationStart;
    }
    // console.log(
    //   seed,
    //   soilValue,
    //   fertilizerValue,
    //   waterValue,
    //   lightValue,
    //   temperatureValue,
    //   humidityValue,
    //   locationValue
    // );
    minSeedLocation = Math.min(minSeedLocation, locationValue);
  });
  console.log(minSeedLocation);
};

/**** Part TWO ****/
const part2 = () => {
  const seedsColonIndex = input[0].indexOf(':');
  const seeds = input[0]
    .slice(seedsColonIndex + 2)
    .split(' ')
    .map(Number);

  const getMap = (lineMin, lineMax) => {
    const map = [];
    for (let i = lineMin; i < lineMax; i++) {
      const numbers = input[i].split(' ').map(Number);
      map.push({
        destinationStart: numbers[0],
        destinationEnd: numbers[0] + numbers[2] - 1,
        sourceStart: numbers[1],
        sourceEnd: numbers[1] + numbers[2] - 1,
      });
    }
    return map;
  };

  const seed2soilMap = getMap(3, 10);
  const soil2fertilizerMap = getMap(12, 58);
  const fertilizer2waterMap = getMap(60, 109);
  const water2lightMap = getMap(111, 134);
  const light2temperatureMap = getMap(136, 182);
  const temperature2humidityMap = getMap(182, 200);
  const humidity2locationMap = getMap(202, 226);

  let minSeedLocation = Number.MAX_SAFE_INTEGER;
  let nbcalc = 0;
  const reverse = (locationValue) => {
    const humidity2location = humidity2locationMap.find(
      (map) => map.destinationStart <= locationValue && map.destinationEnd >= locationValue
    );

    let humidityValue = locationValue;
    if (humidity2location) {
      humidityValue =
        locationValue - humidity2location.destinationStart + humidity2location.sourceStart;
    }
    const temperature2humidity = temperature2humidityMap.find(
      (map) => map.destinationStart <= humidityValue && map.destinationEnd >= humidityValue
    );
    let temperatureValue = humidityValue;
    if (temperature2humidity) {
      temperatureValue =
        humidityValue - temperature2humidity.destinationStart + temperature2humidity.sourceStart;
    }
    const light2temperature = light2temperatureMap.find(
      (map) => map.destinationStart <= temperatureValue && map.destinationEnd >= temperatureValue
    );
    const lightValue =
      temperatureValue - light2temperature.destinationStart + light2temperature.sourceStart;
    const water2light = water2lightMap.find(
      (map) => map.destinationStart <= lightValue && map.destinationEnd >= lightValue
    );
    const waterValue = lightValue - water2light.destinationStart + water2light.sourceStart;
    const fertilizer2water = fertilizer2waterMap.find(
      (map) => map.destinationStart <= waterValue && map.destinationEnd >= waterValue
    );
    const fertilizerValue =
      waterValue - fertilizer2water.destinationStart + fertilizer2water.sourceStart;
    const soil2fertilizer = soil2fertilizerMap.find(
      (map) => map.destinationStart <= fertilizerValue && map.destinationEnd >= fertilizerValue
    );
    const soilValue =
      fertilizerValue - soil2fertilizer.destinationStart + soil2fertilizer.sourceStart;
    const seed2soil = seed2soilMap.find(
      (map) => map.destinationStart <= soilValue && map.destinationEnd >= soilValue
    );
    const seed = soilValue - seed2soil.destinationStart + seed2soil.sourceStart;
    console.log(
      `SEED reverse`,
      seed,
      soilValue,
      fertilizerValue,
      waterValue,
      lightValue,
      temperatureValue,
      humidityValue,
      locationValue
    );
  };
  reverse(12634632);

  for (let i = 0; i < seeds.length; i += 2) {
    console.log(i, seeds[i], seeds[i + 1]);
    for (let j = 0; j < seeds[i + 1]; j++) {
      const seed = seeds[i] + j;
      const seed2soil = seed2soilMap.find(
        (map) => seed >= map.sourceStart && seed <= map.sourceEnd
      );
      let soilValue = seed;
      if (seed2soil) {
        soilValue = seed - seed2soil.sourceStart + seed2soil.destinationStart;
      }
      const soil2fertilizer = soil2fertilizerMap.find(
        (map) => map.sourceStart <= soilValue && map.sourceEnd >= soilValue
      );
      let fertilizerValue = soilValue;
      if (soil2fertilizer) {
        fertilizerValue =
          soilValue - soil2fertilizer.sourceStart + soil2fertilizer.destinationStart;
      }
      const fertilizer2water = fertilizer2waterMap.find(
        (map) => map.sourceStart <= fertilizerValue && map.sourceEnd >= fertilizerValue
      );
      let waterValue = fertilizerValue;
      if (fertilizer2water) {
        waterValue =
          fertilizerValue - fertilizer2water.sourceStart + fertilizer2water.destinationStart;
      }
      const water2light = water2lightMap.find(
        (map) => map.sourceStart <= waterValue && map.sourceEnd >= waterValue
      );
      let lightValue = waterValue;
      if (water2light) {
        lightValue = waterValue - water2light.sourceStart + water2light.destinationStart;
      }
      const light2temperature = light2temperatureMap.find(
        (map) => map.sourceStart <= lightValue && map.sourceEnd >= lightValue
      );
      let temperatureValue = lightValue;
      if (light2temperature) {
        temperatureValue =
          lightValue - light2temperature.sourceStart + light2temperature.destinationStart;
      }
      const temperature2humidity = temperature2humidityMap.find(
        (map) => map.sourceStart <= temperatureValue && map.sourceEnd >= temperatureValue
      );
      let humidityValue = temperatureValue;
      if (temperature2humidity) {
        humidityValue =
          temperatureValue -
          temperature2humidity.sourceStart +
          temperature2humidity.destinationStart;
      }
      const humidity2location = humidity2locationMap.find(
        (map) => map.sourceStart <= humidityValue && map.sourceEnd >= humidityValue
      );
      let locationValue = humidityValue;
      if (humidity2location) {
        locationValue =
          humidityValue - humidity2location.sourceStart + humidity2location.destinationStart;
      }
      // console.log(
      //   seed,
      //   soilValue,
      //   fertilizerValue,
      //   waterValue,
      //   lightValue,
      //   temperatureValue,
      //   humidityValue,
      //   locationValue
      // );
      nbcalc++;
      minSeedLocation = Math.min(minSeedLocation, locationValue);
    }
  }
  console.log(minSeedLocation);
  console.log('nbrun:', nbcalc);
};

part1();
part2();
