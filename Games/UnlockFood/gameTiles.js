import _ from 'lodash';
import randomstring from 'random-string';
import buttonSprite from "../../sprites/button/buttonCharacter";

function createTilesArray (activeTiles, sprites, frameKeys) {
  return _.map(activeTiles, (active, index) => ({
    sprite: sprites[index],
    frameKey: frameKeys[index],
    uid: randomstring({ length: 7 }),
    active,
  }));
}

function tileBlinkSequence (level, trialNumber) {
  let seq = [];
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        return seq = [1, 7, 4];
      case 2:
        return seq = [1, 7, 4, 7 ,7, 4];
      default:
        return seq = [1, 4, 7];
    }
  }
  return seq;
}

function gameBoardTilesForTrial (level, trialNumber) {
  let activeTiles;
  let frameKeys;
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        activeTiles = [false, true, false, false, true, false, false, true, false];
        frameKeys = ['', 'IDLE', '', '', 'IDLE', '', '', 'IDLE', ''];
        break;
      case 2:
        activeTiles = [false, true, false, false, true, false, false, true, false];
        frameKeys = ['', 'IDLE', '', '', 'IDLE', '', '', 'IDLE', ''];
        break;
      default:
        activeTiles = [false, true, false, false, true, false, false, true, false];
        frameKeys = ['', 'IDLE', '', '', 'IDLE', '', '', 'IDLE', ''];
    }

  }
  const sprites = _.fill(Array(activeTiles.length), buttonSprite);
  return createTilesArray(activeTiles, sprites, frameKeys);
}


export default {
  gameBoardTilesForTrial,
  tileBlinkSequence,
};
