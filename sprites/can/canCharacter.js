"use strict";

const canCharacter = {
  name:"can",
  size: {width: 135, height: 144},
  animationTypes: ['IDLE', 'ALL'],
  frames: [
    require("./can.png"),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'IDLE':
        return [0];
      case 'ALL':
        return [0];
    }
  },
};

export default canCharacter;
