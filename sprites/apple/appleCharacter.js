"use strict";

const appleCharacter = {
  name:"apple",
  size: {width: 200, height: 216},
  animationTypes: ['IDLE', 'ALL'],
  all: [
    require("./apple.png"),
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

export default appleCharacter;
