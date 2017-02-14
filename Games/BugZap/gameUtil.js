const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;



function getCoordinates (characterName, scaleHeight, scaleWidth, scaleImage) {
  switch (characterName) {
    case 'lever':
      return {top: SCREEN_HEIGHT - 220 * scaleHeight,
              left: SCREEN_WIDTH/2 - 100 * scaleWidth};
    case 'signRight':
      return {top: -300 * scaleImage,
              left: SCREEN_WIDTH/2 + (210 * scaleWidth)};
    case 'bugRight':
      return {top: 75 * scaleHeight,
              left: SCREEN_WIDTH/2 + (220 * scaleWidth)};
  }
}

function getSize (characterName, scaleImage) {
  switch (characterName) {
    case 'lever':
      return {width: 158 * scaleImage, height: 194 * scaleImage};
    case 'signRight':
      return {width: 140 * scaleImage, height: 230 * scaleImage};
    case 'bugRight':
      return {width: 120 * scaleImage,
        height: 120 * scaleImage};
  }
}

function getTweenOptions (characterName, tweenOn, scaleImage, scaleHeight, scaleWidth) {
  const startRight = SCREEN_WIDTH/2 + (210 * scaleWidth);
  const startLeft = SCREEN_WIDTH/2 - (360 * scaleWidth);
  switch (characterName) {
    case 'signRight' :
      if (tweenOn == 'on') {
        return {
          tweenType: "bounce-drop",
          startY: -300 * scaleImage,
          endY: -10 * scaleHeight,
          duration: 1500,
          repeatable: false,
          loop: false,
        };
      } else {
        return {
          tweenType: 'linear-move',
          startXY: [startRight, -10 * scaleHeight],
          endXY: [startRight, -300 * scaleImage],
          duration: 1000,
          loop: false,
        };
      }
  }
}


export default {
  getCoordinates,
  getSize,
  getTweenOptions,
};
