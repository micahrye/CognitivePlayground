'use strict';

const bugfoodCharacter = {
  name:"bugfood",
  size: {width: 192, height: 192},
  animationTypes: ['IDLE', 'ALL'],
  frames:[
    require("./bug_idle01.png"),
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

export default bugfoodCharacter;
