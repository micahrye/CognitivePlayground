/*
Copyright (c) 2017 Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT. 
*/
import _ from 'lodash';
import randomstring from 'random-string';
import buttonSprite from "../../sprites/button/buttonCharacter";

function createTilesArray (activeTiles, sprites, frameKeys) {
  return _.map(activeTiles, (active, index) => ({
    sprite: sprites[index],
    frameKey: frameKeys[index],
    uid: randomstring({ length: 7 }),
    active,
  }));
}

function tileBlinkSequence (level, trialNumber) {
  let seq = [];
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        return seq = [1, 7, 4];
      case 2:
        return seq = [1, 7, 4, 7 ,7, 4];
      default:
        return seq = [1, 4, 7];
    }
  }
  return seq;
}

function gameBoardTilesForTrial (level, trialNumber) {
  let activeTiles;
  let frameKeys;
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        activeTiles = [false, true, false, false, true, false, false, true, false];
        frameKeys = ['', 'IDLE', '', '', 'IDLE', '', '', 'IDLE', ''];
        break;
      case 2:
        activeTiles = [false, true, false, false, true, false, false, true, false];
        frameKeys = ['', 'IDLE', '', '', 'IDLE', '', '', 'IDLE', ''];
        break;
      default:
        activeTiles = [false, true, false, false, true, false, false, true, false];
        frameKeys = ['', 'IDLE', '', '', 'IDLE', '', '', 'IDLE', ''];
    }

  }
  const sprites = _.fill(Array(activeTiles.length), buttonSprite);
  return createTilesArray(activeTiles, sprites, frameKeys);
}


export default {
  gameBoardTilesForTrial,
  tileBlinkSequence,
};
