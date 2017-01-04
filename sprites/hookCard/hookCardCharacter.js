"use strict";

const hookCardCharacter = {
  name:"hookCard",
  size: {width: 124, height: 142},
  animationTypes: ['HOOK', 'TRIANGLE', 'DIMOND', 'SQUARE', 'CIRCLE', 'ALL'],
  all: [
    require("./hook_and_card_small.png"),
    require("./hook_triangle.png"),
    require("./hook_square.png"),
    require("./hook_dimond.png"),
    require("./hook_circle.png"),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'HOOK':
        return [0];
      case 'TRIANGLE':
        return [1];
      case 'DIMOND':
        return [3];
      case 'SQUARE':
        return [3];
      case 'CIRCLE':
        return [4];
      case 'ALL':
        return [0, 1, 2, 3, 4];
    }
  },
};

export default hookCardCharacter;
