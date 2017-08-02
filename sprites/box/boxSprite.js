
const boxSprite = {
  name:"boxSprite",
  size: function (scale = 1) {
    const size = {
      width: 225 * scale, 
      height: 260 * scale,
    };
    return size;  
  },
  animationTypes: ['IDLE', 'SQUEEZE', 'OPEN', 'ALL'],
  frames: [
    require('./box_neutral.png'),
    require('./box_squeeze.png'),
    require('./box_open.png'),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'IDLE':
        return [0];
      case 'SQUEEZE':
        return [1];
      case 'OPEN':
        return [2];
      case 'ALL':
        return [0, 1, 2];
    }
  },
};

export default boxSprite;
