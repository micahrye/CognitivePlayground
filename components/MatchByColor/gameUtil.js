
import monsterCharacter from '../../sprites/monster/monsterCharacter';
import goatCharacter from '../../sprites/goat/goatCharacter';
import dogCharacter from '../../sprites/dog/dogCharacter';

const getCharacter = function chooseCharacter (characterName) {
  switch (characterName) {
    case 'monster':
      return monsterCharacter;
    case 'goat':
      return goatCharacter;
    case 'dog':
      return dogCharacter;
  }
}

export default {
  getCharacter,
};
