"use strict"

const leverCharacter = {
  name:"lever",
  size: {width: 213, height: 189},
  animationTypes: ['IDLE', 'ALL'],
  all:[
    require("./lever.png"),
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

export default leverCharacter;
