
import _ from 'lodash';
import blueMonster from '../../sprites/blueMonster/blueMonsterCharacter';
import redMonster from '../../sprites/redMonster/redMonsterCharacter';
import greenMonster from '../../sprites/greenMonster/greenMonsterCharacter';
import goat from '../../sprites/goat/goatCharacter';
import dog from '../../sprites/dog/dogCharacter';
// foods
import appleCharacter from "../../sprites/apple/appleCharacter";
import grassCharacter from "../../sprites/grass/grassCharacter";
import canCharacter from "../../sprites/can/canCharacter";

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
  }
}

function getValidCharacterNameForLevel (level) {
  let index;
  const names = [blueMonster.name, redMonster.name, greenMonster.name, goat.name, dog.name];
  switch (level) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      index = _.random(0, names.length-1);
      return names[index];
  }
}

function getFoodsToDisplay (characterName) {
  // return array of foods to show.
  switch (characterName) {
    case 'blueMonster':
      return _.shuffle([appleCharacter, grassCharacter, canCharacter]);
    case 'redMonster':
      return _.shuffle([appleCharacter, grassCharacter, canCharacter]);
    case 'greenMonster':
      return _.shuffle([appleCharacter, grassCharacter, canCharacter]);
    case 'goat':
      return _.shuffle([appleCharacter, grassCharacter, canCharacter]);
    case 'dog':
      return _.shuffle([appleCharacter, grassCharacter, canCharacter]);
  }
}

function favoriteFood (characterName) {
  let food = "";
  switch (characterName) {
    case 'blueMonster':
        food = _.shuffle([appleCharacter, grassCharacter, canCharacter])[0];
        return food.name;
    case 'redMonster':
        food = _.shuffle([appleCharacter, grassCharacter, canCharacter])[0];
        return food.name;
    case 'greenMonster':
        food = _.shuffle([appleCharacter, grassCharacter, canCharacter])[0];
        return food.name;
    case 'goat':
      return canCharacter.name;
    case 'dog':
      return grassCharacter.name;
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
  }
}

export default {
  getCharacterObject,
  getValidCharacterNameForLevel,
  getFoodsToDisplay,
  favoriteFood,
  characterMouthLocation,
  startEatingPriorToFoodDropEnd,
};
