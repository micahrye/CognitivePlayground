const ledCharacter = {
  name: "led",
  size: {width: 70, height: 120},
  animationTypes: ['ON', 'OFF', 'ALL'],
  all:[
    require ("./led_off.png"),
    require ("./led_on.png"),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'OFF':
        return [0];
      case 'ON':
        return [1];
      case 'ALL':
        return [0,1];
    }
  },
};

export default ledCharacter;
