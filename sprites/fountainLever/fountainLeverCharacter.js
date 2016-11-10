
const fountainLeverCharacter = {
  name:"fauntainLever",
  size: {width: 128, height: 112},
  animationTypes: ['IDLE', 'ALL'],
  all:[
    require("./bubble_machine_handle.png"),
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

export default fountainLeverCharacter;
