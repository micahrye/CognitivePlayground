"use strict"

const grassCharacter = {
  name:"grass",
  size: {width: 135, height: 135},
  animationTypes: ['IDLE', 'ALL'],
  all:[
    require("./grass.png"),
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

export default grassCharacter;
