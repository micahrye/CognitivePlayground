
const bugCharacter = {
  name:"bug",
  animationTypes: ['GREEN','BLUE','RED','YELLOW', 'ALL'],
  all: [
    // require("./prettybug_idle03.png"),
    require("./bug_green.png"),
    require("./bug_blue.png"),
    require("./bug_red.png"),
    require("./bug_yellow.png"),
  ],
  animationIndex: function getAnimationIndex (animationType){
    switch (animationType) {
      case 'IDLE':
        return [0];
      case 'ALL':
        return [0,1,2,3];
    }
  }
};

export default bugCharacter;
