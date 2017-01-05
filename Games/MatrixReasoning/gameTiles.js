import _ from 'lodash';
import hookedCardSprite from '../../sprites/hookCard/hookCardCharacter';


function createTilesArray (activeTiles, sprites, frameKeys) {
  return _.map(activeTiles, (active, index) => ({
    sprite: sprites[index],
    frames: sprites[index].animationIndex(frameKeys[index]),
    frameKey: frameKeys[index],
    active,
  }));
}

function correctSelection (level, trialNumber) {
  if (level === 1 && trialNumber === 1) {
    return 'TRIANGLE';
  }
}

function selectionTilesForTrial (level, trialNumber) {
  let activeTiles;
  let frameKeys;
  let sprites;
  if (level === 1 && trialNumber === 1) {
    activeTiles = [true, false, false, true, false, false, true, false, false];
    frameKeys = ['CIRCLE', '', '', 'DIMOND', '', '', 'TRIANGLE', '', ''];
    sprites = _.fill(Array(activeTiles.length), hookedCardSprite);
  }

  return createTilesArray(activeTiles, sprites, frameKeys);
}

function gameBoardTilesForTrial (level, trialNumber) {
  let activeTiles;
  let frameKeys;
  let sprites;

  if (level === 1 && trialNumber === 1) {
    activeTiles = [true, true, false, true, true, false, false, false, false];
    frameKeys = ['TRIANGLE', 'TRIANGLE', '', 'TRIANGLE', 'BLANK', '', '', '', ''];
    sprites = _.fill(Array(activeTiles.length), hookedCardSprite);
  }

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
