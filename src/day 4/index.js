const fs = require('fs');
const path = require('path');
const { loadInput } = require('../utils');

const input = loadInput(4);
const NB_CARDS = input.length - 1;

/**** Part ONE ****/
const part1 = () => {
  let sum = 0;
  input.forEach((line, index) => {
    if (!line) {
      return;
    }
    const colonIndex = line.indexOf(':');
    const numbers = line.slice(colonIndex + 1).split('|');
    const winningNumbers = numbers[0]
      .trim()
      .split(' ')
      .filter((n) => n !== '');
    const playingNumbers = numbers[1]
      .trim()
      .split(' ')
      .filter((n) => n !== '');
    let nbWin = 0;
    for (let i = 0; i < winningNumbers.length; i++) {
      if (playingNumbers.includes(winningNumbers[i])) {
        nbWin += 1;
      }
    }
    // console.log(index, sum, nbWin, Math.pow(2, nbWin - 1));
    if (nbWin > 0) {
      sum += Math.pow(2, nbWin - 1);
    }
  });

  console.log(sum);
};

/**** Part TWO ****/
const part2 = () => {
  const cards = new Array(NB_CARDS);
  cards.fill(1, 0, NB_CARDS);
  input.forEach((line, index) => {
    if (!line) {
      return;
    }
    const colonIndex = line.indexOf(':');
    const numbers = line.slice(colonIndex + 1).split('|');
    const winningNumbers = numbers[0]
      .trim()
      .split(' ')
      .filter((n) => n !== '');
    const playingNumbers = numbers[1]
      .trim()
      .split(' ')
      .filter((n) => n !== '');
    let nbWin = 0;
    for (let i = 0; i < winningNumbers.length; i++) {
      if (playingNumbers.includes(winningNumbers[i])) {
        nbWin += 1;
        cards[index + nbWin] += cards[index];
      }
    }
    // console.log(cards, nbWin);
  });

  const nbCards = cards.reduce((acc, card) => acc + card, 0);
  console.log(nbCards);
};

part1();
part2();
