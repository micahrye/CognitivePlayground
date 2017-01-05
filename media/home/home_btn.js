const home_btn = {
  name:"home",
  size: {width: 200, height: 200},
  animationTypes: ['UNLOCKED', 'LOCKED', 'ALL'],
  all: [
    require("./home_btn_bw.png"),
    require("./home_btn_color.png"),
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

export default home_btn;
