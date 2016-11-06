
const monsterCharacter = {
  name:"monsterCharacter",
  size: {width: 220, height: 220},
  animationTypes: ['IDLE', 'WALK', 'EAT', 'CELEBRATE', 'DISGUST', 'ALL'],
  all: [
    require('./monster_idle.png'),
    require('./monster_walk01.png'),
    require('./monster_walk02.png'),
    require('./monster_walk03.png'),
    require('./monster_eat01.png'),
    require('./monster_eat02.png'),
    require('./monster_celebrate01.png'),
    require('./monster_celebrate02.png'),
    require('./monster_disgust01.png'),
  ],
  animationIndex: function getAnimationIndex (animationType){
    switch (animationType) {
      case 'IDLE':
        return [0];
      case 'WALK':
        return [1,2,3,0];
    }
  },
};

export default monsterCharacter;
