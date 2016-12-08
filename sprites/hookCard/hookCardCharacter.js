"use strict";

const hookCardCharacter = {
  name:"hookCard",
  size: {width: 124, height: 142},
  animationTypes: ['HOOK', 'ALL'],
  all: [
    require("./hook_and_card_small.png"),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'HOOK':
        return [0];
      case 'ALL':
        return [0];
    }
  },
};

export default hookCardCharacter;
