const buttonCharacter = {
  name: "button",
  size: {width: 129, height: 129},
  animationTypes: ['IDLE', 'PRESSED', 'LIT', 'ALL'],
  all:[
    require ("./button_neutral.png"),
    require ("./button_lit.png"),
    require ("./button_pressed.png"),
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
    }
  },
};

export default buttonCharacter;
