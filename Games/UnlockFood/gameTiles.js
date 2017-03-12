import _ from 'lodash';
import randomstring from 'random-string';
import buttonSprite from "../../sprites/button/buttonCharacter";

import trials from './trials';

function createTilesArray (activeTiles, sprites, frameKeys) {
  return _.map(activeTiles, (active, index) => ({
    sprite: sprites[index],
    frameKey: frameKeys[index],
    uid: randomstring({ length: 7 }),
    active,
  }));
}

function tileBlinkSequence (trialNumber) {
  const trial = !trials[trialNumber] ? trials[0] : trials[trialNumber];
  const seq = trial.tileBlinkSequence
  return seq;
}

function gameBoardTilesForTrial (trialNumber) {
  const trial = !trials[trialNumber] ? trials[0] : trials[trialNumber];
  const frameKeys = trial.gameBoardTilesForTrial.frameKeys;
  const activeTiles = trial.gameBoardTilesForTrial.activeTiles;

  const sprites = _.fill(Array(activeTiles.length), buttonSprite);
  return createTilesArray(activeTiles, sprites, frameKeys);
}


function ledController () {
  const activeTiles = [true, true, true, false, false, false, false, false, false];
  const frameKeys = ["IDLE", "IDLE", "IDLE", "", "", "", "", "", ""];
  const sprites = _.fill(Array(activeTiles.length), buttonSprite);
  return createTilesArray(activeTiles, sprites, frameKeys);
}


export default {
  gameBoardTilesForTrial,
  tileBlinkSequence,
  ledController,
};
