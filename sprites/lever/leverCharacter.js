"use strict";

const leverCharacter = {
  name:"lever",
  size: {width: 160, height: 350},
  animationTypes: ['IDLE', 'ALL', 'SWITCH'],
  frames:[
    require("./lever_up.png"),
    require("./lever_wiggle.png"),
    require("./lever_down.png"),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'IDLE':
        return [0];
      case 'ALL':
        return [0];
      case 'SWITCH_ON':
        return [2];
      case 'SWITCH_OFF':
        return [0];
      case 'WIGGLE':
        return [0, 1, 0, 1, 0];
    }
  },
};

export default leverCharacter;
