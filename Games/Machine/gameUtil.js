'use strict';

import _ from 'lodash';
import randomstring from 'random-string';

import litSprites from '../../sprites/litSprites';

import trials from './trials';

const getTrialIndex = function tiralIndex(trialNumber) {
  const numTrials = trials.length;
  const trialIndex = (!trialNumber || numTrials <= trialNumber) ? 0 : trialNumber;
  return trialIndex;
}

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
  const trialIndex = getTrialIndex(trialNumber);
  const activeCells = trials[trialIndex].activeCells;
  const animationKeys = trials[trialIndex].animationKeys;
  const loopAnimation = _.fill(Array(activeCells.length), false);
  const sprites = _.fill(Array(activeCells.length), litSprites);
  
  return createCellObjsArray(activeCells, animationKeys, loopAnimation, sprites)
}

function correctForTrial (trialNumber) {
  const trialIndex = getTrialIndex(trialNumber);
  const animationKeys = trials[trialIndex].animationKeys;
  const correctValue = trials[trialIndex].correct;
  const correctIndex = _.indexOf(animationKeys, correctValue);
  return correctIndex; 
}

const audioFileName = function getAudioFileName(trialNumber) {
  const trialIndex = getTrialIndex(trialNumber);
  const audioFileName = trials[trialIndex].audioFileName
  return audioFileName;
}

export default {
  cellsForTrial,
  correctForTrial,
  audioFileName,
};
