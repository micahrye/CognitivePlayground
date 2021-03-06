import _ from 'lodash';

const button3Sprite = {
  name: "button",
  size: {width: 180, height: 142},
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
          const seq = _.concat(_.fill(Array(4 * seqNum), 0), [0, 1, 1, 0]);
          return seq;
        }
        return [0];
    }
  },
};

export default button3Sprite;
