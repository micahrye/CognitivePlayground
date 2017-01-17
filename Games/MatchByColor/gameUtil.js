
import _ from 'lodash';
import blueMonster from '../../sprites/blueMonster/blueMonster';
import redMonster from '../../sprites/redMonster/redMonster';
import greenMonster from '../../sprites/greenMonster/greenMonster';
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
    // TODO: make this Object.assign do not mutate.
      blueMonster.rotate = [{rotateY:'180deg'}];
      return blueMonster;
    case 'greenMonster':
    // TODO: make this Object.assign do not mutate.
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
  switch (level) {
    case 1:
    case 2:
    case 3:
      const names = [blueMonster.name, redMonster.name, greenMonster.name, goat.name, dog.name];
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
    case 'monster':
      // top, left
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
      // top, left
      return 400;
    case 'greenMonster':
      // top, left
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
