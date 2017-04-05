const beeSprite = {
  name: "bee",
  size: {width: 100, height: 100},
  animationTypes: ['IDLE', 'ALL'],
  frames:[
    require ("./bee_idle.png"),
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

export default beeSprite;
