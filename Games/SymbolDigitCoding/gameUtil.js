import appleSprite from "../../sprites/apple/appleCharacter";
import grassSprite from "../../sprites/grass/grassCharacter";
import canSprite from "../../sprites/can/canCharacter";
import bugSprite from '../../sprites/bug/bugCharacter';

function symbols (level, trialNumber) {
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        return ['CAN', 'FRUIT', 'BUG', 'GRASS'];
      case 2:
        return ['FRUIT', 'GRASS', 'BUG', 'CAN'];
    }
  }
}

function correctSymbol (level, trialNumber) {
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        return 'GRASS';
      case 2:
        return 'FRUIT';
    }
  }
}

function foodSprite (level, trial) {
  switch (correctSymbol(level, trial)) {
    case 'CAN':
      return canSprite;
    case 'FRUIT':
      return appleSprite;
    case 'BUG':
      return bugSprite;
    case 'GRASS':
      return grassSprite;
  }
}

export default {
  symbols,
  correctSymbol,
  foodSprite,
};
