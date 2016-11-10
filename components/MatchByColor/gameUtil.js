
import monsterCharacter from '../../sprites/monster/monsterCharacter';
import goatCharacter from '../../sprites/goat/goatCharacter';
import dogCharacter from '../../sprites/dog/dogCharacter';

const getCharacter = function chooseCharacter (characterName) {
  switch (characterName) {
    case 'monster':
    // TODO: make this Object.assign do not mutate.
      monsterCharacter.rotate = [{rotateY:'180deg'}];
      return monsterCharacter;
    case 'goat':
      goatCharacter.rotate = [{rotateY:'0deg'}];
      return goatCharacter;
    case 'dog':
      dogCharacter.rotate = [{rotateY:'180deg'}];
      return dogCharacter;
  }
}

export default {
  getCharacter,
};
