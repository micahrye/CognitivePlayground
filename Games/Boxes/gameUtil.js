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

const createMoveSeq = function gameMoveSeq (clawLoc, scales) {
  tweenSequence = [
    {
      tweenType: "linear-move",
      startXY: [clawLoc.left, clawLoc.top],
      endXY: [400 * scales.image, clawLoc.top],
      duration: 500,
      loop: false,
    },
    {
      tweenType: "linear-move",
      startXY: [400 * scales.image, clawLoc.top],
      endXY: [620 * scales.image, clawLoc.top],
      duration: 500,
      loop: false,
    },
    {
      tweenType: "linear-move",
      startXY: [620 * scales.image, clawLoc.top],
      endXY: [840 * scales.image, clawLoc.top],
      duration: 500,
      loop: false,
    },
    {
      tweenType: "linear-move",
      startXY: [840 * scales.image, clawLoc.top],
      endXY: [1060 * scales.image, clawLoc.top],
      duration: 500,
      loop: false,
    },
    {
      tweenType: "linear-move",
      startXY: [1060 * scales.image, clawLoc.top],
      endXY: [clawLoc.left, clawLoc.top],
      duration: 500,
      loop: false,
    },
  ];
  return tweenSequence;
}

const getAllBoxAudioFor = function trialBoxAudio (trialNumber) {
  const trialIndex = getTrialIndex(trialNumber);
  const audioFiles = trials[trialIndex].boxAudioFiles;
  return audioFiles;
}

const getSpeakAudioFor = function SpeakAudio (trialNumber) {
  const trialIndex = getTrialIndex(trialNumber);
  const speakAudio = trials[trialIndex].speakAudio;
  return speakAudio;
}

const checkCorrectSelection = function correctSelection (trialNumber, selection) {
  const trialIndex = getTrialIndex(trialNumber);
  const correct = trials[trialIndex].correct;
  const selectedAudio = trials[trialIndex].boxAudioFiles[selection];
  const audioName = selectedAudio.split('.')[0];
  console.log(`BOX: correct = ${correct}, audioName = ${audioName}, same? = ${_.isEqual(correct, audioName)}`);
  return _.isEqual(correct, audioName);
}

const getThinkImage = function thinkImage (trialNumber) {
  const trialIndex = getTrialIndex(trialNumber);
  const thinkImageName = trials[trialIndex].thinkImage;
  return thinkImageName;
}

export default {
  getClawLocation,
  setScreenSize,
  createMoveSeq,
  getClawMoveSeq,
  getAllBoxAudioFor,
  getSpeakAudioFor,
  checkCorrectSelection,
  getThinkImage,
};
