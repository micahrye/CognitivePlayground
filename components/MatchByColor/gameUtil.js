
import _ from 'lodash';
import monster from '../../sprites/monster/monsterCharacter';
import goat from '../../sprites/goat/goatCharacter';
import dog from '../../sprites/dog/dogCharacter';

function getCharacterObject (characterName) {
  switch (characterName) {
    case 'monster':
    // TODO: make this Object.assign do not mutate.
      monster.rotate = [{rotateY:'180deg'}];
      return monster;
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
      const names = [monster.name, goat.name, dog.name];
      index = _.random(0, names.length-1);
      return names[index];
  }
}

function getFoodsToDisplay () {
  // return array of foods to show.
  return [];
}

export default {
  getCharacterObject,
  getValidCharacterNameForLevel,
};
