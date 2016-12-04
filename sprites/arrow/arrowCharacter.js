const arrowCharacter = {
  name: "arrow",
  size: {width: 110, height: 110},
  animationTypes: ['LEFT', 'RIGHT', 'ALL'],
  all:[
    require ("./directional_arrow_right.png"),
    require ("./directional_arrow_left.png"),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'RIGHT':
        return [0];
      case 'LEFT':
        return [1];
      case 'ALL':
        return [0,1];
    }
  },
};

export default arrowCharacter;
