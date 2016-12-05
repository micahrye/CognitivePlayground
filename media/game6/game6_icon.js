const game6_icon = {
  name:"game6",
  size: {width: 200, height: 200},
  animationTypes: ['UNLOCKED', 'LOCKED', 'ALL'],
  all: [
    require("./game6_icon_bw.png"),
    require("./game6_icon_color.png"),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'LOCKED':
        return [0];
      case 'UNLOCKED':
        return [1];
      case 'ALL':
        return [0,1];
    }
  },
};

export default game6_icon;
