const foodMachineSprite = {
  name:"foodMachineSprite",
  
  size: function (scale = 1) {
    const size = {
      width: 295 * scale, 
      height: 261 * scale,
    };
    return size;  
  },
  
  animationTypes: ['IDLE', 'ALL'],
  frames: [
    require('./food-machine-avcues.png'),
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

export default foodMachineSprite;
