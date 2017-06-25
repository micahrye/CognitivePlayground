
const clawSprite2 = {
  name:"clawSprite",
  size: function (scale = 1) {
    const size = {
      width: 236 * scale, 
      height: 888 * scale,
    };
    return size;  
  },
  animationTypes: ['IDLE', 'OPEN', 'CLOSE', 'GRAB', 
                  'BOX_CLOSED', 'BOX_OPENED',
                  'RETURN_TO_NETURAL', 'ALL',],
  frames: [
    require('./claw_neutral.png'),
    require('./claw_open.png'),
    require('./claw_close.png'),
    require('./claw_box_closed.png'),
    require('./claw_box_opened.png'),
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
      case 'BOX_CLOSED':
        return [3];
      case 'BOX_OPENED':
        return [4, 4, 4, 4, 4, 4, 4, 3];
      case 'RETURN_TO_NETURAL':
        return [1, 1, 1, 0];
      case 'ALL':
        return [0, 1, 2, 3, 4];
    }
  },
};

export default clawSprite2;
