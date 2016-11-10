"use strict";

const canCharacter = {
  name:"can",
  size: {width: 200, height: 214},
  animationTypes: ['IDLE', 'ALL'],
  all: [
    require("./can.png"),
  ],
  animationIndex: function getAnimationIndex (animationType){
    switch (animationType) {
      case 'IDLE':
        return [0];
      case 'ALL':
        return [0];
    }
  },
};

export default canCharacter;
