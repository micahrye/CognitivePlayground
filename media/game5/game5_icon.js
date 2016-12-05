const game5_icon = {
  name:"game5",
  size: {width: 200, height: 200},
  animationTypes: ['UNLOCKED', 'LOCKED', 'ALL'],
  all: [
    require("./game5_icon_bw.png"),
    require("./game5_icon_color.png"),
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

export default game5_icon;
