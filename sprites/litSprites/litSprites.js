
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
  animatioOTypes: ['Letter_A', 'Letter_B', 'Letter_C', 'Letter_D', 'Letter_E', 'Letter_F', 'Letter_G', 'Letter_H', 'Letter_I', 'Letter_J', 'Letter_K', 'Letter_L', 'Letter_M', 'LetterLetter__N',
                  'Letter_O', 'Letter_P', 'Letter_Q', 'Letter_R', 'Letter_S', 'Letter_T', 'Letter_U', 'Letter_V', 'Letter_W', 'Letter_X', 'Letter_Y', 'Letter_Z'],
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
      case 'Letter_A':
        return [0];
      case 'Letter_B':
        return [1];
      case 'Letter_C':
        return [2];
      case 'Letter_D':
        return [3];
      case 'Letter_E':
        return [4];
      case 'Letter_F':
        return [5];
      case 'Letter_G':
        return [6];
      case 'Letter_H':
        return [7];
      case 'Letter_I':
        return [8];
      case 'Letter_J':
        return [9];
      case 'Letter_K':
        return [10];
      case 'Letter_L':
        return [11];
      case 'Letter_M':
        return [12];
      case 'Letter_N':
        return [13];
      case 'Letter_O':
        return [14];
      case 'Letter_P':
        return [15];
      case 'Letter_Q':
        return [16];
      case 'Letter_R':
        return [17];
      case 'Letter_S':
        return [18];
      case 'Letter_T':
        return [19];
      case 'Letter_U':
        return [20];
      case 'Letter_V':
        return [21];
      case 'Letter_W':
        return [22];
      case 'Letter_X':
        return [23];
      case 'Letter_Y':
        return [24];
      case 'Letter_Z':
        return [25];
      case 'ALL':
        return [0, 1, 2, 3, 4];
    }
  },
};

export default litSprites;
