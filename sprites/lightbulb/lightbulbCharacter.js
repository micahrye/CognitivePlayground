"use strict";

const lightbulbCharacter = {
  name:"lightbulb",
  size: {width: 170, height: 100},
  animationTypes: ['ON', 'OFF'],
  frames:[
    require("./lightbulb_on.png"),
    require("./lightbulb_off.png"),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'ON':
        return [0];
      case 'OFF':
        return [1];
    }
  },
};

export default lightbulbCharacter;
