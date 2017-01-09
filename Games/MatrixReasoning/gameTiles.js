import _ from 'lodash';
import randomstring from 'random-string';
import hookedCardSprite from '../../sprites/hookCard/hookCardCharacter';


function createTilesArray (activeTiles, sprites, frameKeys) {
  return _.map(activeTiles, (active, index) => ({
    sprite: sprites[index],
    frameKey: frameKeys[index],
    uid: randomstring({ length: 7 }),
    active,
  }));
}

function correctSelection (level, trialNumber) {
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        return 'TRIANGLE';
      case 2:
        return 'SQUARE';
      default:
        return 'CIRCLE';
    }
  }
}

function selectionTilesForTrial (level, trialNumber) {
  let activeTiles;
  let frameKeys;
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        activeTiles = [true, false, false, true, false, false, true, false, false];
        frameKeys = ['CIRCLE', '', '', 'DIMOND', '', '', 'TRIANGLE', '', ''];
        break;
      case 2:
        activeTiles = [true, false, false, true, false, false, true, false, false];
        frameKeys = ['SQUARE', '', '', 'DIMOND', '', '', 'CIRCLE', '', ''];
        break;
      default:
        activeTiles = [true, false, false, true, false, false, true, false, false];
        frameKeys = ['SQUARE', '', '', 'CIRCLE', '', '', 'DIMOND', '', ''];
    }
  }
  const sprites = _.fill(Array(activeTiles.length), hookedCardSprite);
  console.log('11111');
  return createTilesArray(activeTiles, sprites, frameKeys);
}

function gameBoardTilesForTrial (level, trialNumber) {
  let activeTiles;
  let frameKeys;
  if (level === 1) {
    switch (trialNumber) {
      case 1:
        activeTiles = [true, true, false, true, true, false, false, false, false];
        frameKeys = ['TRIANGLE', 'TRIANGLE', '', 'TRIANGLE', 'BLANK', '', '', '', ''];
        break;
      case 2:
        activeTiles = [true, true, false, true, true, false, false, false, false];
        frameKeys = ['SQUARE', 'SQUARE', '', 'BLANK', 'SQUARE', '', '', '', ''];
        break;
      default:
        activeTiles = [true, true, false, true, true, false, false, false, false];
        frameKeys = ['CIRCLE', 'BLANK', '', 'CIRCLE', 'CIRCLE', '', '', '', ''];
    }
  }
  const sprites = _.fill(Array(activeTiles.length), hookedCardSprite);
  console.log('2222');
  return createTilesArray(activeTiles, sprites, frameKeys);
}

function gameBoardTilesWithSelectionResult (level, trialNumber, selectionFrame) {
  const tiles = gameBoardTilesForTrial(level, trialNumber);
  tiles.frameKeys = _.map(tiles, (tile) => {
    if (tile.frameKey === 'BLANK') {
        tile.frameKey = selectionFrame;
        tile.activeTiles = true;
    }
    return tile;
  });
  return tiles;
}


export default {
  gameBoardTilesForTrial,
  selectionTilesForTrial,
  correctSelection,
  gameBoardTilesWithSelectionResult,
};
