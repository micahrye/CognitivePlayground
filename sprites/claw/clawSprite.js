
const clawSprite = {
  name:"clawSprite",
  size: function (scale = 1) {
    const size = {
      width: 284 * scale, 
      height: 700 * scale,
    };
    return size;  
  },
  animationTypes: ['IDLE', 'OPEN', 'CLOSE', 'GRAB', 'ALL'],
  frames: [
    require('./claw_neutral.png'),
    require('./claw_open.png'),
    require('./claw_close.png'),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'IDLE':
        return [0];
      case 'OPEN':
        return [1];
      case 'CLOSE':
        return [2];
      case 'GRAB':
        return [0, 0, 1];
      case 'ALL':
        return [0, 1, 2];
    }
  },
};

export default clawSprite;
