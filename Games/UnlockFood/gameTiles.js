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

function correctSelection (level, trialNumber) {
  if (level === 1 && trialNumber === 1) {
    return 'IDLE';
  }
}

function tileBlinkSequence (level, trialNumber) {
  let seq = [];
  if (level === 1 && trialNumber === 1) {
    seq = [1, 7, 4, 7 ,7, 4];
  }
  return seq;
}

function gameBoardTilesForTrial (level, trialNumber) {
  let activeTiles;
  let frameKeys;
  let sprites;
  if (level === 1 && trialNumber === 1) {
    activeTiles = [false, true, false, false, true, false, false, true, false];
    frameKeys = ['', 'IDLE', '', '', 'IDLE', '', '', 'IDLE', ''];
    sprites = _.fill(Array(activeTiles.length), buttonSprite);
  }
  return createTilesArray(activeTiles, sprites, frameKeys);
}


export default {
  gameBoardTilesForTrial,
  correctSelection,
  tileBlinkSequence,
};
