
const litSprites = {
  name:"litSprites",
  size: (scale = 1) => {
    const size = {
      width: 200 * scale, 
      height: 200 * scale,
    };
    console.log(`LITSPRITE size = ${JSON.stringify(size)}`);
    return size;  
  },
  animationTypes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
                  '0', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  frames: [
    require('./letters/Letter_A.png'), require('./letters/Letter_B.png'),
    require('./letters/Letter_C.png'), require('./letters/Letter_D.png'),
    require('./letters/Letter_E.png'), require('./letters/Letter_F.png'),
    require('./letters/Letter_G.png'), require('./letters/Letter_H.png'),
    require('./letters/Letter_I.png'), require('./letters/Letter_J.png'),
    require('./letters/Letter_K.png'), require('./letters/Letter_L.png'),
    require('./letters/Letter_M.png'), require('./letters/Letter_N.png'),
    require('./letters/Letter_O.png'), require('./letters/Letter_P.png'),
    require('./letters/Letter_Q.png'), require('./letters/Letter_R.png'),
    require('./letters/Letter_S.png'), require('./letters/Letter_T.png'),
    require('./letters/Letter_U.png'), require('./letters/Letter_V.png'),
    require('./letters/Letter_W.png'), require('./letters/Letter_X.png'),
    require('./letters/Letter_Y.png'), require('./letters/Letter_Z.png'),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'A':
        return [0];
      case 'B':
        return [1];
      case 'C':
        return [2];
      case 'D':
        return [3];
      case 'E':
        return [4];
      case 'F':
        return [5];
      case 'G':
        return [6];
      case 'H':
        return [7];
      case 'I':
        return [8];
      case 'J':
        return [9];
      case 'K':
        return [10];
      case 'L':
        return [11];
      case 'M':
        return [12];
      case 'N':
        return [13];
      case 'O':
        return [14];
      case 'P':
        return [15];
      case 'Q':
        return [16];
      case 'R':
        return [17];
      case 'S':
        return [18];
      case 'T':
        return [19];
      case 'U':
        return [20];
      case 'V':
        return [21];
      case 'W':
        return [22];
      case 'X':
        return [23];
      case 'Y':
        return [24];
      case 'Z':
        return [25];
      case 'ALL':
        return [0, 1, 2, 3, 4];
    }
  },
};

export default litSprites;
