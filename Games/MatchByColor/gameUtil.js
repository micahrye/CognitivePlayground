
import _ from 'lodash';
import blueMonster from '../../sprites/blueMonster/blueMonsterCharacter';
import redMonster from '../../sprites/redMonster/redMonsterCharacter';
import greenMonster from '../../sprites/greenMonster/greenMonsterCharacter';

import goat from '../../sprites/goat/goatCharacter';
import dog from '../../sprites/dog/dogCharacter';
import bird from '../../sprites/bird/birdCharacter';
import frog from '../../sprites/frog/frogCharacter';
// foods
import appleCharacter from "../../sprites/apple/appleCharacter";
import appleBlueSprite from "../../sprites/appleBlue/appleBlueSprite";
import appleGreenSprite from "../../sprites/appleGreen/appleGreenSprite";
import appleRedSprite from "../../sprites/appleRed/appleRedSprite";
import appleYellowSprite from "../../sprites/appleYellow/appleYellowSprite";


import bugCharacter from '../../sprites/bug/bugCharacter';
import grassCharacter from "../../sprites/grass/grassCharacter";
import canCharacter from "../../sprites/can/canCharacter";

import trials from './trials';

function getTrialObject (trialNumber) {
  let trialInfo;
  const numTrials = trials.length;
  console.log(`getTrialObject called with ${trialNumber} of numTrials ${numTrials}`);
  if (trialNumber >= numTrials) {
    trialNumber = 0;
    trialInfo = trials[trialNumber];
    return trialInfo;
  }
  if (trialNumber >= 20) {
    debugger;
  }
  trialInfo = trials[trialNumber];
  return trialInfo;
}

function getCorrectFoodSignId (trialNumber) {
  const trialInfo = getTrialObject(trialNumber-1);
  return trialInfo.correctLocation;
}

function getFoodForTrial (trialNumber, sign) {
  const trialInfo = getTrialObject(trialNumber-1);
  console.log(`TRIAL num ${trialNumber} FOOD ${trialInfo[sign]}`);
  switch (trialInfo[sign]) {
    case 'CAN':
      return {sprite: canCharacter, frameIndex: [0]};
    case 'FRUIT':
      return {sprite: appleCharacter, frameIndex: [0]};
    case 'GRASS':
      return {sprite: grassCharacter, frameIndex: [0]};
    case 'BUG':
      return {sprite: bugCharacter, frameIndex: [0]};

    
    case 'CAN_RED':
      return {sprite: canCharacter, frameIndex: [3]};
    case 'CAN_BLUE':
      return {sprite: canCharacter, frameIndex: [1]};
    case 'CAN_GREEN':
      return {sprite: canCharacter, frameIndex: [2]};
    case 'CAN_YELLOW':
      return {sprite: canCharacter, frameIndex: [4]};
      
    case 'GRASS_RED':
      return {sprite: grassCharacter, frameIndex: [3]};
    case 'GRASS_BLUE':
      return {sprite: grassCharacter, frameIndex: [1]};
    case 'GRASS_GREEN':
      return {sprite: grassCharacter, frameIndex: [2]};
    case 'GRASS_YELLOW':
      return {sprite: grassCharacter, frameIndex: [4]};

    case 'FRUIT_RED':
      return {sprite: appleRedSprite, frameIndex: [0]};
    case 'FRUIT_BLUE':
      return {sprite: appleBlueSprite, frameIndex: [0]};
    case 'FRUIT_GREEN':
      return {sprite: appleGreenSprite, frameIndex: [0]};
    case 'FRUIT_YELLOW':
      return {sprite: appleYellowSprite, frameIndex: [0]};
  
    case 'BUG_RED':
      return {sprite: bugCharacter, frameIndex: [3]};
    case 'BUG_BLUE':
      return {sprite: bugCharacter, frameIndex: [2]};
    case 'BUG_GREEN':
      return {sprite: bugCharacter, frameIndex: [1]};
    case 'BUG_YELLOW':
      return {sprite: bugCharacter, frameIndex: [4]};
      
    default:
      console.warn('Unknown food character requested');
  }
}

function getFoodForLeft (trialNumber) {
  return getFoodForTrial(trialNumber, 'leftSign');
}
function getFoodForRight (trialNumber) {
  return getFoodForTrial(trialNumber, 'rightSign');
}

function getCharacterForTrial (trialNumber) {
  const trialInfo = getTrialObject(trialNumber);
  console.log(`GET CHARACTER for trial ${trialNumber} trialinfo = ${JSON.stringify(trialInfo)}`);
  debugger;
  switch (trialInfo.characterName) {
    case 'RED_MONSTER':
    // TODO: make this Object.assign do not mutate.
      redMonster.rotate = [{rotateY:'180deg'}];
      return redMonster;
    case 'BLUE_MONSTER':
      blueMonster.rotate = [{rotateY:'180deg'}];
      return blueMonster;
    case 'GREEN_MONSTER':
      greenMonster.rotate = [{rotateY:'180deg'}];
      return greenMonster;
    case 'YELLOW_MONSTER':
      greenMonster.rotate = [{rotateY:'180deg'}];
      return greenMonster;
    case 'GOAT':
      goat.rotate = [{rotateY:'0deg'}];
      return goat;
    case 'DOG':
      dog.rotate = [{rotateY:'180deg'}];
      return dog;
    case 'BIRD':
      bird.rotate = [{rotateY:'0deg'}];
      return bird;
    case 'FROG':
      bird.rotate = [{rotateY:'0deg'}];
      return frog;
    default:
      console.error('Unknown character requested');
  }
  
}

function getCharacterObject (characterName) {
  switch (characterName) {
    case 'redMonster':
    // TODO: make this Object.assign do not mutate.
      redMonster.rotate = [{rotateY:'180deg'}];
      return redMonster;
    case 'blueMonster':
      blueMonster.rotate = [{rotateY:'180deg'}];
      return blueMonster;
    case 'greenMonster':
      greenMonster.rotate = [{rotateY:'180deg'}];
      return greenMonster;
    case 'goat':
      goat.rotate = [{rotateY:'0deg'}];
      return goat;
    case 'dog':
      dog.rotate = [{rotateY:'180deg'}];
      return dog;
    case 'bird':
      bird.rotate = [{rotateY:'0deg'}];
      return bird;
    default:
      console.error('Unknown character requested');
  }
}

function getValidCharacterNameForLevel (level) {
  const names = [
    blueMonster.name,
    redMonster.name,
    greenMonster.name,
    goat.name,
    dog.name,
    bird.name,
  ];
  switch (level) {
    case 1:
    case 2:
    case 3:
      return names[Math.floor(Math.random() * 6)];
  }
}

function getFoodsToDisplay (characterName) {
  // NOTE: if character red/green/blue
  // return array of foods to show.
  //TODO: should have target food and random other foods.
  switch (characterName) {
    case 'blueMonster':
      return _.shuffle([appleBlueSprite, grassCharacter, canCharacter]);
    case 'redMonster':
      return _.shuffle([appleRedSprite, grassCharacter, canCharacter]);
    case 'greenMonster':
      return _.shuffle([appleGreenSprite, grassCharacter, canCharacter]);
    case 'goat':
      return _.shuffle([appleCharacter, grassCharacter, canCharacter]);
    case 'dog':
      return _.shuffle([appleCharacter, grassCharacter, canCharacter]);
    case 'bird':
      return _.shuffle([appleCharacter, grassCharacter, canCharacter]);
  }
}

function favoriteFood (characterName) {
  switch (characterName) {
    case 'blueMonster':
        return appleBlueSprite.name;
    case 'redMonster':
        return appleRedSprite.name;
    case 'greenMonster':
        return appleGreenSprite.name;
    case 'goat':
      return canCharacter.name;
    case 'dog':
      return grassCharacter.name;
    case 'bird':
      return appleCharacter.name;
  }
}

function characterMouthLocation (characterComponent) {
  const width = characterComponent.props.size.width;
  const height = characterComponent.props.size.height;
  switch (characterComponent.props.sprite.name) {
    case 'redMonster':
      // top, left
      return [(height * 0.5), (width * 0.40)];
    case 'blueMonster':
      return [(height * 0.5), (width * 0.40)];
    case 'greenMonster':
      return [(height * 0.5), (width * 0.40)];
    case 'goat':
      return [(height * 0.35), (width * 0.65)];
    case 'dog':
      return [(height * 0.2), (width * 0.5)];
    case 'bird':
      return [(height * 0.2), (width * 0.5)];
  }
}

function startEatingPriorToFoodDropEnd (characterName) {
  switch (characterName) {
    case 'blueMonster':
      // top, left
      return 400;
    case 'redMonster':
      return 400;
    case 'greenMonster':
      return 400;
    case 'goat':
      return 350;
    case 'dog':
      return 300;
    case 'bird':
      return 300;
  }
}

const totalNumberTrials = function () {
  return trials.length;
}

export default {
  getCharacterObject,
  getValidCharacterNameForLevel,
  getFoodsToDisplay,
  favoriteFood,
  characterMouthLocation,
  startEatingPriorToFoodDropEnd,
  totalNumberTrials,
  
  getCharacterForTrial,
  getFoodForLeft,
  getFoodForRight,
  getCorrectFoodSignId,
};
