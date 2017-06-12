const foodMachineCharacter = {
  name: "foodMachine",
  size: {width: 493, height: 590},
  animationTypes: ['IDLE', 'REVERSE', 'ALL'],
  frames: [
    require ("./food_machine.png"),
    require ("./food_machine_reverse.png"),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'IDLE':
        return [0];
      case 'REVERSE':
        return [1];
      case 'ALL':
        return [0, 1];
    }
  },
};

export default foodMachineCharacter;
