const symbolTableCharacter = {
  name:"splashCharacter",
  size: {width: 400, height: 203},
  animationTypes: ['ALL', 'IDLE'],
  all: [
    require('./symbol_table.png'),
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

export default symbolTableCharacter;
