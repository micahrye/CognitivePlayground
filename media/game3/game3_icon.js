const game3_icon = {
  name:"game3",
  size: {width: 200, height: 200},
  animationTypes: ['UNLOCKED', 'LOCKED', 'ALL'],
  all: [
    require("./game3_icon_bw.png"),
    require("./game3_icon_color.png"),
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

export default game3_icon;
