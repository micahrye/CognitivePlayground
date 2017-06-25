'use strict';

let SCREEN_WIDTH;
let SCREEN_HEIGHT;

function getClawLocation (clawSprite, clawScale, gameScale) {
  const size = clawSprite.size(clawScale * gameScale.image);
  const top = 0 - size.height/2;
  const left = 200 * gameScale.screenWidth; 
  return {top, left};
}

function setScreenSize(width, height) {
  SCREEN_WIDTH = width;
  SCREEN_HEIGHT = height;
}

export default {
  getClawLocation,
  setScreenSize,
};
