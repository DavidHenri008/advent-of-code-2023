const fs = require('fs');
const path = require('path');
const { loadInput } = require('../utils');

const input = loadInput(7);

/**** Part ONE ****/
const part1 = () => {
  const getCardValue = (card) => {
    if (card === '2') return 2;
    if (card === '3') return 3;
    if (card === '4') return 4;
    if (card === '5') return 5;
    if (card === '6') return 6;
    if (card === '7') return 7;
    if (card === '8') return 8;
    if (card === '9') return 9;
    if (card === 'T') return 10;
    if (card === 'J') return 11;
    if (card === 'Q') return 12;
    if (card === 'K') return 13;
    if (card === 'A') return 14;
  };
  const sampleHand = (cards) => {
    const sample = new Array(15).fill(0);
    cards.forEach((card) => (sample[getCardValue(card)] += 1));
    return sample;
  };
  const isFiveOfAKind = (cards) => {
    const sample = sampleHand(cards);
    const hasFive = sample.some((quantity) => quantity === 5);
    return hasFive;
  };
  const isFourOfAKind = (cards) => {
    const sample = sampleHand(cards);
    const hasFour = sample.some((quantity) => quantity === 4);
    return hasFour;
  };
  const isFullHouse = (cards) => {
    const sample = sampleHand(cards);
    const hasThree = sample.some((quantity) => quantity === 3);
    const hasTwo = sample.some((quantity) => quantity === 2);
    return hasThree && hasTwo;
  };
  const isThreeOfAKind = (cards) => {
    const sample = sampleHand(cards);
    const hasThree = sample.some((quantity) => quantity === 3);
    return hasThree;
  };
  const isTwoPairs = (cards) => {
    const sample = sampleHand(cards);
    let nbPair = 0;
    sample.forEach((quantity) => {
      if (quantity === 2) {
        nbPair += 1;
      }
    });
    return nbPair === 2;
  };
  const isPair = (cards) => {
    const sample = sampleHand(cards);
    let nbPair = 0;
    sample.forEach((quantity) => {
      if (quantity === 2) {
        nbPair += 1;
      }
    });
    return nbPair === 1;
  };
  const isHighCard = (cards) => {
    const sample = sampleHand(cards);
    const hasThree = sample.some((quantity) => quantity === 3);
    const hasTwo = sample.some((quantity) => quantity === 2);
    return !hasThree && !hasTwo;
  };
  const getLevel = (hand) => {
    const cards = hand.split('');
    if (isFiveOfAKind(cards)) {
      return 7;
    }
    if (isFourOfAKind(cards)) {
      return 6;
    }
    if (isFullHouse(cards)) {
      return 5;
    }
    if (isThreeOfAKind(cards)) {
      return 4;
    }
    if (isTwoPairs(cards)) {
      return 3;
    }
    if (isPair(cards)) {
      return 2;
    }
    if (isHighCard(cards)) {
      return 1;
    }
  };
  const hands = input
    .map((line) => {
      if (!line) return;
      const parts = line.split(' ');
      return { hand: parts[0], bid: parts[1], level: getLevel(parts[0]) };
    })
    .filter(Boolean);

  const sortHand = (a, b) => {
    if (a[0] === b[0]) {
      return sortHand(a.slice(1), b.slice(1));
    }
    return getCardValue(a[0]) - getCardValue(b[0]);
  };

  // Sort by level
  hands.sort((a, b) => {
    if (a.level === b.level) {
      return sortHand(a.hand, b.hand);
    }
    return a.level - b.level;
  });
  let result = 0;
  for (let i = 0; i < hands.length; i++) {
    result += hands[i].bid * (i + 1);
  }
  console.log(result);
};

/**** Part TWO ****/
const part2 = () => {
  const getCardValue = (card) => {
    if (card === 'J') return 1;
    if (card === '2') return 2;
    if (card === '3') return 3;
    if (card === '4') return 4;
    if (card === '5') return 5;
    if (card === '6') return 6;
    if (card === '7') return 7;
    if (card === '8') return 8;
    if (card === '9') return 9;
    if (card === 'T') return 10;
    if (card === 'Q') return 12;
    if (card === 'K') return 13;
    if (card === 'A') return 14;
  };
  const sampleHand = (cards) => {
    const sample = new Array(15).fill(0);
    cards.forEach((card) => (sample[getCardValue(card)] += 1));
    return sample;
  };
  const isFiveOfAKind = (cards) => {
    const sample = sampleHand(cards);
    const hasFive = sample.some((quantity) => quantity === 5);
    const hasFourAndJoker = sample.some((quantity) => quantity === 4) && sample[1] === 1;
    const hasThreeAndJoker = sample.some((quantity) => quantity === 3) && sample[1] === 2;
    const hasTwoAndJoker = sample.some((quantity) => quantity === 2) && sample[1] === 3;
    const hasFourJoker = sample[1] === 4;
    return hasFive || hasFourAndJoker || hasThreeAndJoker || hasTwoAndJoker || hasFourJoker;
  };
  const isFourOfAKind = (cards) => {
    const sample = sampleHand(cards);
    const hasFour = sample.some((quantity) => quantity === 4);
    const hasThreeAndJoker = sample.some((quantity) => quantity === 3) && sample[1] === 1;
    let nbPair = 0;
    sample.forEach((quantity, index) => {
      if (quantity === 2 && index !== 1) {
        nbPair += 1;
      }
    });
    const hasTwoAndJoker = nbPair === 1 && sample[1] === 2;
    const hasThreeJoker = sample[1] === 3;
    return hasFour || hasThreeAndJoker || hasTwoAndJoker || hasThreeJoker;
  };
  const isFullHouse = (cards) => {
    const sample = sampleHand(cards);
    const hasThree = sample.some((quantity) => quantity === 3);
    let nbPair = 0;
    sample.forEach((quantity, index) => {
      if (quantity === 2 && index !== 1) {
        nbPair += 1;
      }
    });
    const hasTwoPairAndJoker = nbPair === 2 && sample[1] === 1;
    const hasOnePairAndJoker = nbPair === 1 && sample[1] === 2;
    return (hasThree && nbPair === 1) || hasTwoPairAndJoker || hasOnePairAndJoker;
  };
  const isThreeOfAKind = (cards) => {
    const sample = sampleHand(cards);
    const hasThree = sample.some((quantity) => quantity === 3);
    const hasTwoAndJoker = sample.some((quantity) => quantity === 2) && sample[1] === 1;
    const hasTwoJoker = sample[1] === 2;
    return hasThree || hasTwoAndJoker || hasTwoJoker;
  };
  const isTwoPairs = (cards) => {
    const sample = sampleHand(cards);
    let nbPair = 0;
    sample.forEach((quantity) => {
      if (quantity === 2) {
        nbPair += 1;
      }
    });
    const hasTwoPair = nbPair === 2;
    return hasTwoPair;
  };
  const isPair = (cards) => {
    const sample = sampleHand(cards);
    let nbPair = 0;
    sample.forEach((quantity) => {
      if (quantity === 2) {
        nbPair += 1;
      }
    });
    const hasOnePair = nbPair === 1;
    const hasJoker = sample[1] === 1;
    return hasOnePair || hasJoker;
  };
  const isHighCard = (cards) => {
    const sample = sampleHand(cards);
    const hasThree = sample.some((quantity) => quantity === 3);
    const hasTwo = sample.some((quantity) => quantity === 2);
    return !hasThree && !hasTwo;
  };
  const getLevel = (hand) => {
    const cards = hand.split('');
    if (isFiveOfAKind(cards)) {
      return 7;
    }
    if (isFourOfAKind(cards)) {
      return 6;
    }
    if (isFullHouse(cards)) {
      return 5;
    }
    if (isThreeOfAKind(cards)) {
      return 4;
    }
    if (isTwoPairs(cards)) {
      return 3;
    }
    if (isPair(cards)) {
      return 2;
    }
    if (isHighCard(cards)) {
      return 1;
    }
  };
  const hands = input
    .map((line) => {
      if (!line) return;
      const parts = line.split(' ');
      return { hand: parts[0], bid: parts[1], level: getLevel(parts[0]) };
    })
    .filter(Boolean);

  const sortHand = (a, b) => {
    if (a[0] === b[0]) {
      return sortHand(a.slice(1), b.slice(1));
    }
    return getCardValue(a[0]) - getCardValue(b[0]);
  };

  // Sort by level
  hands.sort((a, b) => {
    if (a.level === b.level) {
      return sortHand(a.hand, b.hand);
    }
    return a.level - b.level;
  });
  let result = 0;
  for (let i = 0; i < hands.length; i++) {
    // console.log(hands[i].hand, hands[i].level, hands[i].hand.includes('J') ? ' <<<' : '');
    result += hands[i].bid * (i + 1);
  }
  console.log(result);
};

part1();
part2();
