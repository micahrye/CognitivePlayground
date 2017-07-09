'use strict';

import _ from 'lodash';
import trials from './trials';

let SCREEN_WIDTH;
let SCREEN_HEIGHT;

const getTrialIndex = function tiralIndex(trialNumber) {
  const numTrials = trials.length;
  const trialIndex = (!trialNumber || numTrials <= trialNumber) ? 0 : trialNumber;
  return trialIndex;
}

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

let tweenSequence;

const getClawMoveSeq = function clawMoveSeq (index) {
  if (!tweenSequence) {
    console.error("tweenSequence not initalized");
  }
  return tweenSequence;
}

const createMoveSeq = function gameMoveSeq (clawLoc) {
  tweenSequence = [
    {
      tweenType: "linear-move",
      startXY: [clawLoc.left, clawLoc.top],
      endXY: [400, clawLoc.top],
      duration: 500,
      loop: false,
    },
    {
      tweenType: "linear-move",
      startXY: [400, clawLoc.top],
      endXY: [600, clawLoc.top],
      duration: 500,
      loop: false,
    },
    {
      tweenType: "linear-move",
      startXY: [600, clawLoc.top],
      endXY: [800, clawLoc.top],
      duration: 500,
      loop: false,
    },
    {
      tweenType: "linear-move",
      startXY: [800, clawLoc.top],
      endXY: [1000, clawLoc.top],
      duration: 500,
      loop: false,
    },
    {
      tweenType: "linear-move",
      startXY: [1000, clawLoc.top],
      endXY: [clawLoc.left, clawLoc.top],
      duration: 500,
      loop: false,
    },
  ];
  return tweenSequence;
}

const getBoxAudioFor = function trialBoxAudio (trialNumber) {
  const trialIndex = getTrialIndex(trialNumber);
  const audioFiles = trials[trialIndex].boxAudioFiles;
  return audioFiles;
}

const getSpeakAudioFor = function SpeakAudio (trialNumber) {
  const trialIndex = getTrialIndex(trialNumber);
  const speakAudio = trials[trialIndex].speakAudio;
  return speakAudio;
}

export default {
  getClawLocation,
  setScreenSize,
  createMoveSeq,
  getClawMoveSeq,
  getBoxAudioFor,
  getSpeakAudioFor,
};
