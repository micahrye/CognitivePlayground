import _ from 'lodash';

const buttonSprite = {
  name: "button",
  size: {width: 142, height: 180},
  animationTypes: ['IDLE', 'PRESSED', 'LIT', 'BLINK', 'ALL'],
  frames:[
    require ("./button_neutral.png"),
    require ("./button_lit.png"),
    require ("./button_pressed.png"),
    require ("./button_lit.png"),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'IDLE':
        return [0];
      case 'LIT':
        return [1];
      case 'PRESSED':
        return [2];
      case 'ALL':
        return [0,1,2];
      default:
        if (_.includes(animationType, 'BLINK_')) {
          const parts = _.split(animationType, '_');
          const seqNum = Number(_.last(parts));
          const seq = _.map(_.repeat('01110', seqNum).split(''), (x) => Number(x));
          return seq;
        }
        return [0];
    }
  },
};

export default buttonSprite;
