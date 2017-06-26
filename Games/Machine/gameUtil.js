'use strict';

import _ from 'lodash';
import randomstring from 'random-string';

import litSprites from '../../sprites/litSprites';

import trials from './trials';

function createCellObjsArray (activeCells, animationKeys, loopAnimation, sprites) {
  const cells = _.map(activeCells , (active, index) => ({
    active,
    sprite: sprites[index],
    animationKey: animationKeys[index],
    loopAnimation: loopAnimation[index],
    uid: randomstring({ length: 7 }),
  }));
  return cells;
}

function cellsForTrial (trialNumber) {
  const numTrials = trials.length;
  const trialIndex = (!trialNumber || numTrials <= trialNumber) ? 0 : trialNumber;
  
  const activeCells = trials[trialIndex].activeCells;
  const animationKeys = trials[trialIndex].animationKeys;
  const loopAnimation = _.fill(Array(activeCells.length), false);
  const sprites = _.fill(Array(activeCells.length), litSprites);
  
  return createCellObjsArray(activeCells, animationKeys, loopAnimation, sprites)
}

function correctForTrial (trialNumber) {
  // TODO: implement
}

export default {
  cellsForTrial,
  correctForTrial,
};
