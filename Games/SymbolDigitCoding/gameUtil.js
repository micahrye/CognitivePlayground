/*
Copyright (c) 2017 Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT. 
*/
import _ from 'lodash';
import randomstring from 'random-string';
import appleSprite from "../../sprites/apple/appleCharacter";
import grassSprite from "../../sprites/grass/grassCharacter";
import canSprite from "../../sprites/can/canCharacter";
import bugSprite from '../../sprites/bug/bugCharacter';
import shapeKeyCharacter from '../../sprites/shapeKey/shapeKeyCharacter';

const SCALES = [0.4, 0.5, 0.8, 1, 1, 1, 1, 1, 1];

function createTilesArray (activeTiles, sprites, frameKeys) {
  return _.map(activeTiles, (active, index) => ({
    active,
    sprite: sprites[index],
    frameKey: frameKeys[index],
    uid: randomstring({ length: 7 }),
    scale: SCALES[index],
  }));
}


function selectionTilesForTrial (level, trialNumber) {
  let frameKeys;
  const activeTiles = [true, true, true, false, false, false, false, false, false];
  const sprites = _.fill(Array(activeTiles.length), shapeKeyCharacter);
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        frameKeys = ['CAN', 'FRUIT', 'GRASS', '', '', '', '', '', ''];
        break;
      case 2:
        frameKeys = ['BUG', 'CAN', 'FRUIT', '', '', '', '', '', ''];
        break;
      default:
        frameKeys = ['GRASS', 'BUG', 'CAN', '', '', '', '', '', ''];
    }

  }

  return createTilesArray(activeTiles, sprites, frameKeys);
}

function symbols (level, trialNumber) {
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        return ['CAN', 'FRUIT', 'BUG', 'GRASS'];
      case 2:
        return ['FRUIT', 'BUG', 'CAN', 'GRASS'];
      default:
        return ['GRASS', 'BUG', 'FRUIT', 'CAN'];
    }
  }
}

function correctSymbol (level, trialNumber) {
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        return 'GRASS';
      case 2:
        return 'FRUIT';
      default:
        return 'CAN';
    }
  }
}

function foodSprite (level, trial) {
  switch (correctSymbol(level, trial)) {
    case 'CAN':
      return canSprite;
    case 'FRUIT':
      return appleSprite;
    case 'BUG':
      return bugSprite;
    case 'GRASS':
      return grassSprite;
  }
}

export default {
  symbols,
  correctSymbol,
  foodSprite,
  selectionTilesForTrial,
};
