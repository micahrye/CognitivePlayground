/*
Copyright (c) 2017 Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT. 
*/
const gameIcon = {
  name:"gameIcon",
  size: {width: 200, height: 200},
  animationTypes: [
    'GAME_1_UNLOCKED',
    'GAME_1_LOCKED',
    'GAME_2_UNLOCKED',
    'GAME_2_LOCKED',
    'GAME_3_UNLOCKED',
    'GAME_3_LOCKED',
    'GAME_4_UNLOCKED',
    'GAME_4_LOCKED',
    'GAME_5_UNLOCKED',
    'GAME_5_LOCKED',
    'GAME_6_UNLOCKED',
    'GAME_6_LOCKED',
    'GAME_7_UNLOCKED',
    'GAME_7_LOCKED',
    'ALL',
  ],
  all: [
    require("./game1_icon_bw.png"),
    require("./game1_icon_color.png"),
    require("./game2_icon_bw.png"),
    require("./game2_icon_color.png"),
    require("./game3_icon_bw.png"),
    require("./game3_icon_color.png"),
    require("./game4_icon_bw.png"),
    require("./game4_icon_color.png"),
    require("./game5_icon_bw.png"),
    require("./game5_icon_color.png"),
    require("./game6_icon_bw.png"),
    require("./game6_icon_color.png"),
    require("./game7_icon_bw.png"),
    require("./game7_icon_color.png"),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'GAME_1_LOCKED':
        return [0];
      case 'GAME_1_UNLOCKED':
        return [1];
      case 'GAME_2_LOCKED':
        return [2];
      case 'GAME_2_UNLOCKED':
        return [3];
      case 'GAME_3_LOCKED':
        return [4];
      case 'GAME_3_UNLOCKED':
        return [5];
      case 'GAME_4_LOCKED':
        return [6];
      case 'GAME_4_UNLOCKED':
        return [7];
      case 'GAME_5_LOCKED':
        return [8];
      case 'GAME_5_UNLOCKED':
        return [9];
      case 'GAME_6_LOCKED':
        return [10];
      case 'GAME_6_UNLOCKED':
        return [11];
      case 'GAME_7_LOCKED':
        return [12];
      case 'GAME_7_UNLOCKED':
        return [13];
      case 'ALL':
        return [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
    }
  },
};

export default gameIcon;
