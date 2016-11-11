const splashCharacter = {
  name:"splashCharacter",
  size: {width: 170, height: 100},
  animationTypes: ['RIPPLE', 'SPLASH'],
  all: [
    require('./ripple01.png'),
    require('./ripple02.png'),
    require('./ripple03.png'),
    require('./splash01.png'),
    require('./splash02.png'),
  ],
  animationIndex: function getAnimationIndex (animationType){
    switch (animationType) {
      case 'RIPPLE':
        return [0,1,0];
      case 'SPLASH':
        return [0,3,4,0];
    }
  },
};

export default splashCharacter;
