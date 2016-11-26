import React from 'react';
import {
  Image,
  View,
  PixelRatio,
} from 'react-native';

import _ from 'lodash';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from '../AnimatedSprite/AnimatedSprite';
import HomeButton from '../HomeButton/HomeButton';
// props
import leverSprite from '../../sprites/lever/leverCharacter';
import signSprite from '../../sprites/sign/signCharacter';
// game character related utils
import gameUtil from './gameUtil';
// styles
import styles from './styles';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const PIXEL_RATIO = 1 / PixelRatio.get();
//import { screen } from '../../screenService';

const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;
const TRIAL_TIMEOUT = 15000;

const LEVEL01 = 1;
const LEVEL02 = 2;
const LEVEL03 = 3;
const DONE = 4;
const LEVEL01_TRAILS = 6;
const LEVEL02_TRIALS = 6;
const LEVEL03_TRIALS = 6;

class MatchByColorGame extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      character: null,
      characterAnimationIndex: [0],
      leverAnimationIndex: [0],
      loadingCharacter: false,
      dropFood: false,
      signsVisable: false,
      foodDisplayed: false,
      level: LEVEL01,
    };
    this.numTrialsForCurrentLevel = 0;
    this.level = LEVEL01;
    this.scale = this.props.scale;
    this.activeCharacter;
    this.foodActive;

    this.leftSign = {tweenOptions: {}};
    this.middleSign = {tweenOptions: {}};
    this.rightSign = {tweenOptions: {}};
    this.leftFood = {tweenOptions: {}};
    this.middleFood = {tweenOptions: {}};
    this.rightFood = {tweenOptions: {}};
    this.targetFoodPosition;
    this.signDropTime = 1500 * this.props.scale.screenHeight;

    this.showFoodTimeout;
    this.signTimeout;
    this.trialTimer;
    this.setDefaultAnimationState;
    this.eatTimeout;
    this.switchCharacterTimeout;
    this.clearingScene = false;

    // SCREEN_HEIGHT = SCREEN_HEIGHT * PIXEL_RATIO;
    // SCREEN_WIDTH = SCREEN_WIDTH * PIXEL_RATIO;

    // const scaleWidth =  1280 / SCREEN_WIDTH;
    // const scaleHeight =  800 / SCREEN_HEIGHT;
    // this.scale = {
    //   screenWidth: scaleWidth,
    //   screenHeight: scaleHeight,
    //   image: scaleHeight > scaleWidth ? scaleWidth : scaleHeight,
    // };
  }

  componentWillMount () {
    this.characterUIDs = {
      lever: randomstring({ length: 7 }),
    };

    const name = gameUtil.getValidCharacterNameForLevel(this.level);
    this.loadCharacter(name);
    // set offscreen
    this.leftFood.coords = this.foodStartLocation('left', this.scale);
    this.middleFood.coords = this.foodStartLocation('middle', this.scale);
    this.rightFood.coords = this.foodStartLocation('right', this.scale);

    this.leverSprite = leverSprite;
    this.leverSprite.tweenOptions = {tweenOptions: {}};
  }

  componentDidMount () {
    console.log('HEIGH = ', SCREEN_HEIGHT);
    console.log('WIDTH = ', SCREEN_WIDTH);
    console.log(`scale = ${JSON.stringify(this.scale, null, 2)}`);
    console.log(`PIXEL_RATIO ${PIXEL_RATIO}`);
  }

  componentWillUnmount () {
    clearTimeout(this.showFoodTimeout);
    clearTimeout(this.signTimeout);
    clearTimeout(this.trialTimer);
    clearTimeout(this.setDefaultAnimationState);
    clearTimeout(this.eatTimeout);
    clearTimeout(this.switchCharacterTimeout);
  }

  /**
   * used to load character image frames off screen so that image
   * frames are in memory.
   */
  loadCharacter (characterName) {
    this.level = this.currentLevel(this.numTrialsForCurrentLevel);
    if (this.level === DONE) {
      this.homeButtonPressed();
      return;
    }
    this.characterUIDs.character = randomstring({ length: 7 });
    this.activeCharacter = gameUtil.getCharacterObject(characterName);

    this.activeCharacter.tweenOptions = {tweenOptions: {}};
    this.setState({
      character: this.activeCharacter,
      characterAnimationIndex: this.activeCharacter.animationIndex('ALL'),
      loadingCharacter: true,
      characterAnimationLoop: false,
    }, () => {
      clearTimeout(this.setDefaultAnimationState);
      this.setDefaultAnimationState = setTimeout(() => {
        this.setState({
          leverAnimationIndex: this.leverSprite.animationIndex('WIGGLE'),
          characterAnimationIndex: this.activeCharacter.animationIndex('IDLE'),
          loadingCharacter: false,
        });
      }, 1200);
    });
  }

  makeMoveTween (startXY=[40, 400], endXY=[600, 400], duration=1500) {
    // WILL NEED to pass character info to since size characters diff etc.
    return (
      {
        tweenType: "linear-move",
        startXY: [startXY[0], startXY[1]],
        endXY: [endXY[0], endXY[1]],
        duration: duration,
        loop: false,
      }
      // {
      //   tweenType: "linear-move",
      //   startXY: [startXY[0] * this.scale.screenWidth, startXY[1] * this.scale.screenHeight],
      //   endXY: [endXY[0] * this.scale.screenWidth, endXY[1] * this.scale.screenHeight],
      //   duration: duration,
      //   loop: false,
      // }
    );
  }

  onCharacterTweenFinish (characterUID) {
    switch (characterUID) {
      case this.characterUIDs.character:
        this.setState({
          characterAnimationIndex: this.activeCharacter.animationIndex('IDLE'),
          characterAnimationLoop: false,
        });
        break;
    }
  }

  onFoodTweenFinish (foodCharacter) {
    switch (foodCharacter) {
      case LEFT:
        this.leftFood.character = null;
        break;
      case MIDDLE:
        this.middleFood.character = null;
        break;
      case RIGHT:
        this.rightFood.character = null;
        break;
    }
    this.setState({});
  }

  foodSignDisplayLocations (scale = true, top = 140, left = 400, shift = 200) {
    if (scale) {
      return {
        top: top * this.scale.screenHeight,
        leftLeft: left * this.scale.screenWidth,
        middleLeft: (left + shift) * this.scale.screenWidth,
        rightLeft: (left + 2 * shift) * this.scale.screenWidth,
      };
    }
    return {
      top: top,
      leftLeft: left,
      middleLeft: (left + shift),
      rightLeft: (left + 2 * shift),
    };
  }

  signDropTween () {
    return {
      tweenType: "bounce-drop",
      startY: -300,
      endY: -10 * this.props.scale.screenHeight,
      duration: this.signDropTime,
      repeatable: false,
      loop: false,
    };
  }

  initializeSignsDropTween () {
    this.leftSign.tweenOptions = this.signDropTween();
    this.middleSign.tweenOptions = this.signDropTween();
    this.rightSign.tweenOptions = this.signDropTween();
  }

  initializeMoveUpTweensForSigns () {
    // get end location, get start location
    const leftStart = this.signStartLocation('left', this.scale);
    const middleStart = this.signStartLocation('middle', this.scale);
    const rightStart = this.signStartLocation('right', this.scale);
    const top = leftStart.top;
    this.leftSign.tweenOptions = this.makeMoveTween(
      [leftStart.left, 0], [leftStart.left, top], 800);
    this.middleSign.tweenOptions = this.makeMoveTween(
      [middleStart.left, 0], [middleStart.left, top], 800);
    this.rightSign.tweenOptions = this.makeMoveTween(
      [rightStart.left, 0], [rightStart.left, top], 800);
  }

  startSignsTween (level) {
    switch (level) {
      case 1:
      case 2:
        this.refs.leftSign.startTween();
        this.refs.middleSign.startTween();
        // this.refs.rightSign.startTween();
        break;
      case 3:
        this.refs.leftSign.startTween();
        this.refs.middleSign.startTween();
        this.refs.rightSign.startTween();
        break;
    }
  }
  startTrialTimer () {
    clearTimeout(this.trialTimer);
    this.trialTimer = setTimeout(()=>{
      this.clearScene();
    }, TRIAL_TIMEOUT);
  }

  leverPress () {
    // console.log('leverPressIn');
  }

  incrementTrialCount (trialCount) {
    return trialCount + 1;
  }

  currentLevel (currentTrialNumber) {
    // starts in level 1
    const maxNumTrials = LEVEL01_TRAILS + LEVEL02_TRIALS + LEVEL03_TRIALS;
    const levelTwo = LEVEL01_TRAILS + LEVEL02_TRIALS;
    const levelThree = LEVEL01_TRAILS + LEVEL02_TRIALS + LEVEL03_TRIALS;

    if ((currentTrialNumber >= LEVEL01_TRAILS)
    && (currentTrialNumber < levelTwo)) {
      if (currentTrialNumber === LEVEL01_TRAILS-1) return;
      return LEVEL02;
    } else if ((currentTrialNumber >= levelTwo) &&
    (currentTrialNumber < levelThree)) {
      if (currentTrialNumber === levelTwo-1) return;
      return LEVEL03;
    } else if (currentTrialNumber >= maxNumTrials) {
      return DONE;
    }
    return LEVEL01;
  }

  leverPressIn () {
    if (this.state.loadingCharacter
      || this.state.signsVisable || this.clearingScene) {
      return;
    }
    this.numTrialsForCurrentLevel = this.incrementTrialCount(this.numTrialsForCurrentLevel);

    clearTimeout(this.trialTimer);
    // creature enter from left
    const startLocation = this.characterStartLocation(this.activeCharacter, this.scale);
    const moveFrom = [startLocation.left, startLocation.top]; //[startLocation[1], startLocation[0]]; //[startLocation[1], startLocation[0]];
    const waitLocation = this.characterWaitForFoodAt(this.activeCharacter, this.scale);
    const moveTo = [waitLocation.left, waitLocation.top];
    console.log(`from ${JSON.stringify(moveFrom, null, 2)}`);
    console.log(`to ${JSON.stringify(moveTo, null, 2)}`);
    this.activeCharacter.tweenOptions = this.makeMoveTween(moveFrom, moveTo);

    this.initializeSignsDropTween();

    this.setState({
      leverAnimationIndex: this.leverSprite.animationIndex('SWITCH_ON'),
      characterAnimationIndex: this.activeCharacter.animationIndex('WALK'),
      signsVisable: true,
      characterAnimationLoop: true,
    }, () => {
      this.startSignsTween(this.level);
      this.refs.characterRef.startTween();
      // then interval to make food appear on sign.
      clearTimeout(this.showFoodTimeout);
      this.showFoodTimeout = setTimeout(() => {
        // const coords = this.foodSignDisplayLocations();
        // this.showFoods(coords, true, true);
        this.displayFoods();
        this.foodActive = true;
        this.startTrialTimer();
      }, this.signDropTime);
    });
  }

  leverPressOut () {
    // console.log('leverPressOut');
  }

  displayFoodsLocations (position) {
    const leftSign = this.signStartLocation('left', this.scale);
    const baseLeft = leftSign.left + 40 * this.scale.screenWidth;
    const shift = 200 * this.scale.screenWidth;
    const top = 140 * this.scale.screenHeight;
    switch (position) {
      case 'left':
        return {top, left: baseLeft};
      case 'middle':
        return {top, left: (baseLeft + shift)};
      case 'right':
        return {top, left: (baseLeft + 2 * shift)};
    }
  }

  displayFoods () {
    const foods = gameUtil.getFoodsToDisplay(this.activeCharacter.name);
    const foodPref = gameUtil.favoriteFood(this.activeCharacter.name);
    const targetFoodIndex = _.findIndex(foods, (food) => food.name === foodPref);
    const numFoods = this.level === 3 ? 3 : 2;
    let order = _.shuffle([0, 1, 2]);
    if (this.level < 3) {
      const index = _([0, 1, 2]).difference([targetFoodIndex]).shuffle().value().pop();
      order = _.shuffle([index, targetFoodIndex]);
    } else {
      order = _.shuffle([0, 1, 2]);
    }
    this.targetFoodPosition = _.findIndex(order, (val) => val === targetFoodIndex);
    this.leftFood.character = foods[order[0]];
    this.middleFood.character = foods[order[1]];

    this.leftFood.key = randomstring({length: 7});
    this.middleFood.key = randomstring({length: 7});
    this.leftFood.coords = this.displayFoodsLocations('left');
    this.middleFood.coords = this.displayFoodsLocations('middle');
    if (numFoods === 3) {
      this.rightFood.coords = this.displayFoodsLocations('right');
      this.rightFood.character = foods[order[2]];
      this.rightFood.key = randomstring({length: 7});
    }
    this.setState({foodDisplayed: true});
  }

  hideFoods () {
    this.leftFood.coords = this.foodStartLocation('left', this.scale);
    this.middleFood.coords = this.foodStartLocation('middle', this.scale);
    this.rightFood.coords = this.foodStartLocation('right', this.scale);
    this.leftFood.key = randomstring({length: 7});
    this.middleFood.key = randomstring({length: 7});
    this.rightFood.key = randomstring({length: 7});
    this.setState({foodDisplayed: false});
  }

  showFoods (coords, displayFood, setState = true) {
    // can be case that this.setState is beeing called and setting
    // food key and location is suffecient. In other cases want to explicitly
    // call this.setState.
    const foods = gameUtil.getFoodsToDisplay(this.activeCharacter.name);
    const foodPref = gameUtil.favoriteFood(this.activeCharacter.name);
    const targetFoodIndex = _.findIndex(foods, (food) => food.name === foodPref);
    const numFoods = this.level === 3 ? 3 : 2;
    let order = _.shuffle([0, 1, 2]);
    if (this.level < 3) {
      const index = _([0, 1, 2]).difference([targetFoodIndex]).shuffle().value().pop();
      order = _.shuffle([index, targetFoodIndex]);
    } else {
      order = _.shuffle([0, 1, 2]);
    }
    this.targetFoodPosition = _.findIndex(order, (val) => val === targetFoodIndex);
    this.leftFood.character = foods[order[0]];
    this.middleFood.character = foods[order[1]];

    this.leftFood.key = randomstring({length: 7});
    this.middleFood.key = randomstring({length: 7});
    // only set those foods that will show.
    this.leftFood.coords = {top: coords.top, left: coords.leftLeft};
    this.middleFood.coords = {top: coords.top, left: coords.middleLeft};
    if (numFoods === 3) {
      this.rightFood.coords = {top: coords.top, left: coords.rightLeft};
      this.rightFood.character = foods[order[2]];
      this.rightFood.key = randomstring({length: 7});
    }
    if (setState) {
      this.setState({foodDisplayed: displayFood});
    }
  }

  foodDropToCharacter (food, foodStartAt, dropTimeDuration) {
    // get the x,y of mout location withing image
    const waitForFoodAt = this.characterWaitForFoodAt(this.activeCharacter, this.scale);
    const mouthLocation = gameUtil.characterMouthLocation(this.refs.characterRef);
    const endCoords = [(waitForFoodAt.left + mouthLocation[1]), (waitForFoodAt.top + mouthLocation[0])];
    this.foodDrop(food, foodStartAt, endCoords, dropTimeDuration);
  }

  // food drop then creature eat.
  foodDrop (food, starXY, endXY, duration) {
    this.foodActive = false;
    this[food].tweenOptions = this.makeMoveTween(
      starXY, endXY, duration);
    this.setState({dropFood: true}, () => {
      this['refs'][food].startTween();
    });
    const waitToEatTime = duration - gameUtil.startEatingPriorToFoodDropEnd(this.activeCharacter.name);
    const joyfulEatingIndex = _.concat(
      this.activeCharacter.animationIndex('EAT'),
      this.activeCharacter.animationIndex('CELEBRATE')
    );
    clearTimeout(this.eatTimeout);
    this.eatTimeout = setTimeout(() => {
      this.setState({
        dropFood: false,
        characterAnimationIndex: joyfulEatingIndex,
        characterAnimationLoop: false,
      }, () => {
        this.eatTimeout = setTimeout(() => {
          this.clearScene();
        }, 500);
      });
    }, waitToEatTime);

  }

  unhappyAndLeaving () {
    this.foodActive = false;
    const unhappy = _.concat(
      this.activeCharacter.animationIndex('DISGUST'),
      this.activeCharacter.animationIndex('DISGUST')
    );
    this.setState({
      dropFood: false,
      characterAnimationIndex: unhappy,
      characterAnimationLoop: false,
    }, () => {
      clearTimeout(this.eatTimeout);
      this.eatTimeout = setTimeout(() => {
        this.clearScene();
      }, 500);
    });
  }

  foodPressed (foodId) {
    if (this.state.dropFood || !this.foodActive || this.clearingScene) {
      return;
    }
    if (!(foodId === this.targetFoodPosition)) {
      this.unhappyAndLeaving();
      return;
    }
    clearTimeout(this.trialTimer);

    const foodDropTime = 800;
    let coords;
    let foodCoord;
    switch (this.targetFoodPosition) {
      case LEFT:
        coords = this.displayFoodsLocations('left');
        foodCoord = [coords.left, coords.top];
        this.foodDropToCharacter('leftFood', foodCoord, foodDropTime);
        break;
      case MIDDLE:
        coords = this.displayFoodsLocations('middle');
        foodCoord = [coords.left, coords.top];
        this.foodDropToCharacter('middleFood', foodCoord, foodDropTime);
        break;
      case RIGHT:
        coords = this.displayFoodsLocations('right');
        foodCoord = [coords.left, coords.top];
        this.foodDropToCharacter('rightFood', foodCoord, foodDropTime);
        break;
    }
  }

  clearScene () {
    this.clearingScene = true;
    clearTimeout(this.trialTimer);
    this.initializeMoveUpTweensForSigns();

    const timeToExit = 2000;
    const characterAt = this.characterWaitForFoodAt(this.activeCharacter, this.scale);
    const startFrom = [characterAt.left, characterAt.top];
    const exitTo = [SCREEN_WIDTH, characterAt.top];
    this.activeCharacter.tweenOptions = this.makeMoveTween(
      startFrom,
      exitTo,
      timeToExit);

    clearTimeout(this.signTimeout);
    this.signTimeout = setTimeout(() => {
      this.setState({
        leverAnimationIndex: this.leverSprite.animationIndex('SWITCH_OFF'),
        characterAnimationIndex: this.activeCharacter.animationIndex('WALK'),
        signsVisable: false,
        characterAnimationLoop: true,
      }, () => {
        this.hideFoods();
        this.startSignsTween(this.level);
        this.refs.characterRef.startTween();
        clearTimeout(this.switchCharacterTimeout);
        this.switchCharacterTimeout = setTimeout(() => {
          this.clearingScene = false;
          const name = gameUtil.getValidCharacterNameForLevel(this.level);
          this.loadCharacter(name);
        }, timeToExit);
      });
    }, 1500);
  }

  foodSize (food) {
    // scale to 120 x 120 or closest.
    const widthScale = 120/food.size.width;
    const heightScale = 120/food.size.height;
    const scale = widthScale > heightScale ? heightScale : widthScale;
    const width = Math.floor((food.size.width * scale) * this.scale.image);
    const height = Math.floor((food.size.height * scale) * this.scale.image);
    return {width, height};
  }

  foodStartLocation (position, scale) {
    const top = -150 * scale.screenHeight;
    const baseLeft = 450;
    switch (position) {
      case 'left':
        return {top, left: baseLeft * scale.screenWidth};
      case 'middle':
        return {top, left: (baseLeft + 200) * scale.screenWidth};
      case 'right':
        return {top, left: (baseLeft + 400) * scale.screenWidth};
    }
  }

  characterSize (character, scale) {
    const widthScale = 340/character.size.width;
    const heightScale = 340/character.size.height;
    const sizeScale = widthScale > heightScale ? heightScale : widthScale;
    const width = Math.floor((character.size.width * sizeScale) * scale.image);
    const height = Math.floor((character.size.height * sizeScale) * scale.image);
    return {width, height};
  }

  characterStartLocation (character, scale) {
    const size = this.characterSize(character, scale);
    const top = SCREEN_HEIGHT - (size.height + SCREEN_HEIGHT * 0.08);
    const left = -size.width;
    // console.log( `charSize = ${JSON.stringify(size, null, 2)}`);
    console.log(`char top = ${top}`);
    return {top, left};
  }

  characterWaitForFoodAt (character, scale) {
    const top = this.characterStartLocation(character, scale).top;
    console.log(`CWFFA char top = ${top}`);
    const left = 150 * scale.screenWidth;
    return {top, left};
  }

  leverSize () {
    return {
      width: leverSprite.size.width * this.scale.image,
      height: leverSprite.size.height * this.scale.image};
  }

  leverLocation () {
    const size = this.leverSize();
    console.log( `leverSize = ${JSON.stringify(size, null, 2)}`);
    const left = SCREEN_WIDTH - size.width;
    const top = (SCREEN_HEIGHT - size.height) / 2;
    return {top, left};
  }

  signSize (sign, scale) {
    return {width: sign.size.width * scale.image,
      height: sign.size.height * scale.image,
    };
  }

  signStartLocation (position, scale) {
    const top = -350 * scale.screenHeight;
    const baseLeft = 400;
    switch (position) {
      case 'left':
        return {top, left: baseLeft * scale.screenWidth};
      case 'middle':
        return {top, left: (baseLeft + 200) * scale.screenWidth};
      case 'right':
        return {top, left: (baseLeft + 400) * scale.screenWidth};
    }
  }

  homeButtonPressed () {
    this.props.navigator.replace({ id: 'Main' });
  }

  render () {
    return (
      <View style={styles.container}>
        <Image source={require('../../media/backgrounds/Game_2_Background_1280.png')}
          style={{width: 1280 * this.scale.screenWidth,
          height: 800 * this.scale.screenHeight, flex: 1}}
        />
        <AnimatedSprite
          character={leverSprite}
          characterUID={this.characterUIDs.lever}
          animationFrameIndex={this.state.leverAnimationIndex}
          loopAnimation={false}
          tweenOptions={this.leverSprite.tweenOptions}
          tweenStart={'fromCode'}
          coordinates={this.leverLocation()}
          size={this.leverSize()}
          rotate={[{rotateY:'0deg'}]}
          onPress={() => this.leverPress()}
          onPressIn={() => this.leverPressIn()}
          onPressOut={() => this.leverPressOut()}
        />

        <AnimatedSprite
          character={signSprite}
          ref={'leftSign'}
          animationFrameIndex={[0]}
          coordinates={this.signStartLocation('left', this.scale)}
          size={this.signSize(signSprite, this.scale)}
          draggable={false}
          tweenOptions={this.leftSign.tweenOptions}
          tweenStart={'fromCode'}
        />

        <AnimatedSprite
          character={signSprite}
          ref={'middleSign'}
          animationFrameIndex={[0]}
          coordinates={this.signStartLocation('middle', this.scale)}
          size={this.signSize(signSprite, this.scale)}
          draggable={false}
          tweenOptions={this.middleSign.tweenOptions}
          tweenStart={'fromCode'}
        />

        <AnimatedSprite
          character={signSprite}
          ref={'rightSign'}
          animationFrameIndex={[0]}
          coordinates={this.signStartLocation('right', this.scale)}
          size={this.signSize(signSprite, this.scale)}
          draggable={false}
          tweenOptions={this.rightSign.tweenOptions}
          tweenStart={'fromCode'}
        />

        {this.leftFood.character ?
          <AnimatedSprite
            character={this.leftFood.character}
            ref={'leftFood'}
            key={this.leftFood.key}
            animationFrameIndex={[0]}
            coordinates={this.leftFood.coords}
            size={this.foodSize(this.leftFood.character)}
            draggable={false}
            tweenOptions={this.leftFood.tweenOptions}
            tweenStart={'fromCode'}
            onPress={() => this.foodPressed(LEFT)}
            onTweenFinish={() => this.onFoodTweenFinish(LEFT)}
          />
        : null}

        {this.middleFood.character ?
          <AnimatedSprite
            character={this.middleFood.character}
            ref={'middleFood'}
            key={this.middleFood.key}
            animationFrameIndex={[0]}
            coordinates={this.middleFood.coords}
            size={this.foodSize(this.middleFood.character)}
            draggable={false}
            tweenOptions={this.middleFood.tweenOptions}
            tweenStart={'fromCode'}
            onPress={() => this.foodPressed(MIDDLE)}
            onTweenFinish={() => this.onFoodTweenFinish(MIDDLE)}
          />
        : null}

        {this.rightFood.character ?
          <AnimatedSprite
            character={this.rightFood.character}
            ref={'rightFood'}
            key={this.rightFood.key}
            animationFrameIndex={[0]}
            coordinates={this.rightFood.coords}
            size={this.foodSize(this.rightFood.character)}
            draggable={false}
            tweenOptions={this.rightFood.tweenOptions}
            tweenStart={'fromCode'}
            onPress={() => this.foodPressed(RIGHT)}
            onTweenFinish={(ref) => this.onFoodTweenFinish(RIGHT)}
          />
        : null}

        <AnimatedSprite
          ref={'characterRef'}
          character={this.state.character}
          characterUID={this.characterUIDs.character}
          key={this.characterUIDs.character}
          style={{opacity: 1}}
          animationFrameIndex={this.state.characterAnimationIndex}
          loopAnimation={this.state.characterAnimationLoop}
          coordinates={this.characterStartLocation(this.state.character, this.scale)}
          size={this.characterSize(this.state.character, this.scale)}
          rotate={this.activeCharacter.rotate}
          tweenOptions={this.activeCharacter.tweenOptions}
          tweenStart={'fromCode'}
          onTweenFinish={(characterUID) => this.onCharacterTweenFinish(characterUID)}
        />

      <HomeButton
        route={this.props.route}
        navigator={this.props.navigator}
        routeId={{ id: 'Main' }}
        styles={{
          width: 150 * this.scale.image,
          height: 150 * this.scale.image,
          top:0, left: 0, position: 'absolute' }}
      />

      </View>
    );
  }
}

MatchByColorGame.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};

reactMixin.onClass(MatchByColorGame, TimerMixin);

export default MatchByColorGame;
