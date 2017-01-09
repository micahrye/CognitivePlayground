import _ from 'lodash';
import randomstring from 'random-string';
import appleSprite from "../../sprites/apple/appleCharacter";
import grassSprite from "../../sprites/grass/grassCharacter";
import canSprite from "../../sprites/can/canCharacter";
import bugSprite from '../../sprites/bug/bugCharacter';
import shapeKeyCharacter from '../../sprites/shapeKey/shapeKeyCharacter';

const SCALES = [0.4, 0.5, 0.8, 1, 1, 1, 1, 1, 1];

function createTilesArray (activeTiles, sprites, frameKeys) {
  return _.map(activeTiles, (active, index) => ({
    active,
    sprite: sprites[index],
    frameKey: frameKeys[index],
    uid: randomstring({ length: 7 }),
    scale: SCALES[index],
  }));
}


function selectionTilesForTrial (level, trialNumber) {
  let frameKeys;
  const activeTiles = [true, true, true, false, false, false, false, false, false];
  const sprites = _.fill(Array(activeTiles.length), shapeKeyCharacter);
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        frameKeys = ['CAN', 'FRUIT', 'GRASS', '', '', '', '', '', ''];
        break;
      case 2:
        frameKeys = ['BUG', 'CAN', 'FRUIT', '', '', '', '', '', ''];
        break;
      default:
        frameKeys = ['GRASS', 'BUG', 'CAN', '', '', '', '', '', ''];
    }

  }

  return createTilesArray(activeTiles, sprites, frameKeys);
}

function symbols (level, trialNumber) {
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        return ['CAN', 'FRUIT', 'BUG', 'GRASS'];
      case 2:
        return ['FRUIT', 'BUG', 'CAN', 'GRASS'];
      default:
        return ['GRASS', 'BUG', 'FRUIT', 'CAN'];
    }
  }
}

function correctSymbol (level, trialNumber) {
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        return 'GRASS';
      case 2:
        return 'FRUIT';
      default:
        return 'CAN';
    }
  }
}

function foodSprite (level, trial) {
  switch (correctSymbol(level, trial)) {
    case 'CAN':
      return canSprite;
    case 'FRUIT':
      return appleSprite;
    case 'BUG':
      return bugSprite;
    case 'GRASS':
      return grassSprite;
  }
}

export default {
  symbols,
  correctSymbol,
  foodSprite,
  selectionTilesForTrial,
};
