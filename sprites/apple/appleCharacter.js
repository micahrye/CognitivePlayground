"use strict";

const appleCharacter = {
  name:"apple",
  size: {width: 135, height: 146},
  animationTypes: ['IDLE', 'ALL'],
  frames: [
    require("./apple.png"),
    require("./apple_blue.png"),
    require("./apple_red.png"),
    require("./apple_green.png"),
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

export default appleCharacter;
