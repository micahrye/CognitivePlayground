"use strict";

const appleCharacter = {
  name:"apple",
  size: {width: 135, height: 146},
  animationTypes: ['IDLE', 'ALL'],
  frames: [
    require("./apple.png"),
    require("./apple_blue.png"),
    require("./apple_green.png"),
    require("./apple_red.png"),
    require("./apple_yellow.png"),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'IDLE':
        return [0];
      case 'BLUE':
        return [1];
      case 'GREEN':
        return [2];
      case 'RED':
        return [3];
      case 'YELLOW':
        return [4];
      case 'ALL':
        return [0,1,2,3,4];
    }
  },
};

export default appleCharacter;
