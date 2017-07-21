"use strict";

const appleYellowSprite = {
  name:"appleYellow",
  size: {width: 135, height: 146},
  animationTypes: ['IDLE', 'ALL'],
  frames: [
    require("./apple_yellow.png"),
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

export default appleYellowSprite;
