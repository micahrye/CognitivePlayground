const bubblesCharacter = {
  name:"bubble",
  size: {width: 200, height: 200},
  animationTypes: ['IDLE', 'ALL'],
  all:[
    require("./bubble_clockwise_large01.png"),
    require("./bubble_can01.png"),
    require("./bubble_fruit01.png"),
    require("./bubble_fly01.png"),
    require("./bubble_grass01.png"),
  ],
  animationIndex: function getAnimationIndex (animationType){
    switch (animationType) {
      case 'IDLE':
        return [0];
      case 'ALL':
        return [0,1,2,3,4];
    }
  },
};

export default bubblesCharacter;
