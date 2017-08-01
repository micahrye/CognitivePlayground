import React from 'react';
import {
  Image,
  View,
  AppState,
  AsyncStorage,
} from 'react-native';

import _ from 'lodash';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';
import KeepAwake from 'react-native-keep-awake';

import AnimatedSprite from '../../components/AnimatedSprite/AnimatedSprite';
import HomeButton from '../../components/HomeButton/HomeButton';
import LoadScreen from '../../components/LoadScreen';
// props
import buttonSprite from '../../sprites/buttonLeft/buttonLeftSprite';
import signSprite from '../../sprites/sign/signCharacter';
// game character related utils
import gameUtil from './gameUtil';
// styles
import styles from './styles';

const Sound = require('react-native-sound');

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
// const PIXEL_RATIO = 1 / PixelRatio.get();
const TRIAL_INACTIVITY_TIME_OUT = 15000;
const LEFT = 0;
const RIGHT = 1;
const MIDDLE = 1;

const LEVEL01 = 1;
const LEVEL02 = 2;
const LEVEL03 = 3;

// const DONE = 4;

const LEVEL01_TRAILS = 6;
const LEVEL02_TRIALS = 6;
const LEVEL03_TRIALS = 6;

class MatchByColorGame extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      character: null,
      characterAnimationIndex: [0],
      buttonAnimationIndex: [0],
      loadingCharacter: false,
      dropFood: false,
      signsVisable: false,
      foodDisplayed: false,
      level: LEVEL01,
      loadingScreen: true,
      devMode: false,
    };
    this.inactivityCounter = 0;
    this.trialCount = 0; 
    // this.numTrialsForCurrentLevel = 0;
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
    
    this.leftFoodAnimationIndex = [0];
    this.rightFoodAnimationIndex = [0];
    
    this.targetFoodPosition;
    this.signDropTime = 1500 * this.props.scale.screenHeight;

    this.showFoodTimeout;
    this.signTimeout;
    this.setDefaultAnimationState;
    this.eatTimeout;
    this.switchCharacterTimeout;
    this.clearingScene = false;

    this.signSound;
    this.signSoundPlaying = false;
    this.popSound;
    this.popPlaying = false;
    this.celebrateSound;
    this.celebratePlaying = false;
    this.disgustSound;
    this.disgustPlaying = false;
    this.activeScene = false;
    KeepAwake.activate();
  }

  componentWillMount () {
    this.characterUIDs = {
      lever: randomstring({ length: 7 }),
    };

    // const name = gameUtil.getValidCharacterNameForLevel(this.level);
    this.loadCharacter(this.trialCount);
    // set offscreen
    this.leftFood.coords = this.foodStartLocation('left', this.scale);
    this.middleFood.coords = this.foodStartLocation('middle', this.scale);
    this.rightFood.coords = this.foodStartLocation('right', this.scale);

    this.buttonSprite = buttonSprite;
    AsyncStorage.getItem('@User:pref', (err, result) => {
      console.log(`GETTING = ${JSON.stringify(result)}`);
      const prefs = JSON.parse(result);
      if (prefs) {
        this.setState({ devMode: prefs.developMode });
      }
      setTimeout(() => this.startInactivityMonitor(), 500);
    });
  }

  componentDidMount () {
    this.initSounds();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount () {
    // console.warn("WILL UNMOUNT");
    this.releaseSounds();
    clearTimeout(this.showFoodTimeout);
    clearTimeout(this.signTimeout);
    clearTimeout(this.setDefaultAnimationState);
    clearTimeout(this.eatTimeout);
    clearTimeout(this.switchCharacterTimeout);
    clearTimeout(this.trialTimeout);
  }
  
  exitGame () {
    this.props.navigator.replace({
      id: "Main",
    });
  }
  
  startInactivityMonitor () {
    clearTimeout(this.trialTimeout);
    if (!this.state.devMode) {
      this.trialTimeout = this.setTimeout(() => {
        if (this.inactivityCounter >= 16) {
          this.exitGame();
          return;
        }
        this.inactivityCounter += 1;
        if (this.activeScene) {
          this.clearScene();
        } else {
          this.incrementTrial();
          this.loadCharacter(this.trialCount);
        }
        this.startInactivityMonitor();
      }, TRIAL_INACTIVITY_TIME_OUT);
    }
  }

  initSounds () {
    this.signSound = new Sound('cards_drop.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.signSound.setNumberOfLoops(0);
      this.signSound.setVolume(1);
    });
    this.popSound = new Sound('pop_touch.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.popSound.setNumberOfLoops(0);
      this.popSound.setVolume(1);
    });
    this.leverSound = new Sound('lever_switch.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.leverSound.setNumberOfLoops(0);
      this.leverSound.setVolume(1);
    });
    this.celebrateSound = new Sound('celebrate.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.celebrateSound.setNumberOfLoops(0);
      this.celebrateSound.setVolume(1);
    });
    this.disgustSound = new Sound('disgust.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.disgustSound.setNumberOfLoops(0);
      this.disgustSound.setVolume(0.9);
    });
  }

  releaseSounds () {
    this.popSound.stop();
    this.popSound.release();
    this.leverSound.stop();
    this.leverSound.release();
    this.signSound.stop();
    this.signSound.release();
    this.celebrateSound.stop();
    this.celebrateSound.release();
    this.disgustSound.stop();
    this.disgustSound.release();
  }

  _handleAppStateChange = (appState) => {
    // release all sound objects
    if (appState === 'inactive' || appState === 'background') {
      this.releaseSounds();
      AppState.removeEventListener('change', this._handleAppStateChange);
    }
  }

  /**
   * used to load character image frames off screen so that image
   * frames are in memory.
   */
  loadCharacter (trialNumber) {
    // TODO: if all trials done then exit
    if (trialNumber == gameUtil.totalNumberTrials()) {
      // You are done. 
      this.exitGame();
      return;
    }

    this.characterUIDs.character = randomstring({ length: 7 });
    
    this.activeCharacter = gameUtil.getCharacterForTrial(trialNumber);
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
          buttonAnimationIndex: this.buttonSprite.animationIndex('IDLE'),
          characterAnimationIndex: this.activeCharacter.animationIndex('IDLE'),
          loadingCharacter: false,
        });
      }, 1000);
    });
    
    this.blinkButtonTimeout = this.setTimeout(() => {
      this.setState({ buttonAnimationIndex: this.buttonSprite.animationIndex('BLINK_2') });
    }, 3000)
  }

  makeMoveTween (startXY=[40, 400], endXY=[600, 400], duration=1500) {
    const coords = this.refs.characterRef.getCoordinates();
    // WILL NEED to pass character info to since size characters diff etc.
    return (
      {
        tweenType: "linear-move",
        startXY: [startXY[0], startXY[1]],
        endXY: [endXY[0], endXY[1]],
        duration: duration,
        loop: false,
      }
    );
  }

  onCharacterTweenFinish (characterUID) {
    console.log(`!! onCharTweenFin, characterUID=${characterUID}`);
    //const coords = this.refs.characterRef.getCoordinates();
    //console.log(`FINISH ${JSON.stringify(coords)}`);
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
    if (!this.signSoundPlaying) {
      this.signSoundPlaying = true;
      this.signSound.play(() => {this.signSoundPlaying = false;});
    }

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
  
  incrementTrial () {
    this.trialCount = this.trialCount + 1;
    console.log(`this.trialCount = ${this.trialCount}`);
  }

  buttonPressIn () {
    clearTimeout(this.blinkButtonTimeout);
    clearTimeout(this.trialTimeout);
    if (this.state.loadingCharacter
      || this.state.signsVisable || this.clearingScene) {
      return;
    }
    if (!this.leverPlaying) {
      this.leverPlaying = true;
      this.leverSound.play(() => {this.leverPlaying = false;});
    }
    this.activeScene = true;
    this.incrementTrial();
    
    // creature enter from left
    const startLocation = this.characterStartLocation(this.activeCharacter, this.scale.image);
    const moveFrom = [startLocation.left, startLocation.top]; //[startLocation[1], startLocation[0]]; //[startLocation[1], startLocation[0]];
    const waitLocation = this.characterWaitForFoodAt(this.activeCharacter, this.scale.image, this.scale.screenWidth);
    const moveTo = [waitLocation.left, waitLocation.top];
    this.activeCharacter.tweenOptions = this.makeMoveTween(moveFrom, moveTo);

    this.initializeSignsDropTween();

    this.setState({
      buttonAnimationIndex: this.buttonSprite.animationIndex('PRESSED'),
      characterAnimationIndex: this.activeCharacter.animationIndex('WALK'),
      signsVisable: true,
      characterAnimationLoop: true,
    }, () => {
      this.startSignsTween(this.level);
      this.refs.characterRef.startTween();
      // then interval to make food appear on sign.
      clearTimeout(this.showFoodTimeout);
      this.showFoodTimeout = setTimeout(() => {
        this.displayFoods(this.trialCount);
        this.foodActive = true;
      }, this.signDropTime);
    });
    this.startInactivityMonitor();
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

  displayFoods (trial) {
    const foods = gameUtil.getFoodsToDisplay(this.activeCharacter.name);

    this.targetFoodPosition = gameUtil.getCorrectFoodSignId(trial);
    
    const leftFood = gameUtil.getFoodForLeft(trial);
    const rightFood = gameUtil.getFoodForRight(trial);
    
    this.leftFood.character = leftFood.sprite; //foods[order[0]];
    this.middleFood.character = rightFood.sprite; //foods[order[1]];
    
    this.leftFoodAnimationIndex = leftFood.frameIndex;
    this.rightFoodAnimationIndex = rightFood.frameIndex;
    
    this.leftFood.key = randomstring({length: 7});
    this.middleFood.key = randomstring({length: 7});
    this.leftFood.coords = this.displayFoodsLocations('left');
    this.middleFood.coords = this.displayFoodsLocations('middle');

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

  foodDropToCharacter (food, foodStartAt, dropTimeDuration) {
    // get the x,y of mout location withing image
    const waitForFoodAt = this.characterWaitForFoodAt(this.activeCharacter, this.scale.image, this.scale.screenWidth);
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
        if (!this.celebratePlaying) {
          this.celebratePlaying = true;
          this.celebrateSound.play(() => {this.celebratePlaying = false;});
        }
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
    if (!this.disgustPlaying) {
      this.disgustPlaying = true;
      this.disgustSound.play(() => {this.disgustPlaying = false;});
    }
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
    clearTimeout(this.trialTimeout);
    if (!this.popPlaying) {
      this.popPlaying = true;
      this.popSound.play(() => {this.popPlaying = false;});
    }
    if (this.state.dropFood || !this.foodActive || this.clearingScene) {
      return;
    }
    if (!(foodId === this.targetFoodPosition)) {
      this.unhappyAndLeaving();
      return;
    }

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
    this.startInactivityMonitor();
  }
  
  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  clearScene () {
    console.log('!! clearScene()');
    this.clearingScene = true;
    this.activeScene = false;
    // this.initializeMoveUpTweensForSigns()

    const timeToExit = 1000;
    const characterAt = this.characterWaitForFoodAt(this.activeCharacter, this.scale.image, this.scale.screenWidth);
    const startFrom = [characterAt.left, characterAt.top];
    const exitTo = [SCREEN_WIDTH, characterAt.top];
    // exit the stage
    this.activeCharacter.tweenOptions = this.makeMoveTween(
      startFrom,
      exitTo,
      timeToExit
    );

    clearTimeout(this.signTimeout);
    this.signTimeout = setTimeout(() => {
      this.setState({
        // buttonAnimationIndex: this.buttonSprite.animationIndex('IDLE'),
        characterAnimationIndex: this.activeCharacter.animationIndex('WALK'),
        signsVisable: false,
        characterAnimationLoop: true,
      }, () => {
        // this.hideFoods();
        // this.startSignsTween(this.level);
        this.refs.characterRef.startTween();
        clearTimeout(this.switchCharacterTimeout);
        this.switchCharacterTimeout = setTimeout(() => {
          this.initializeMoveUpTweensForSigns()
          this.hideFoods();
          this.startSignsTween(this.level);
          
          this.clearingScene = false;
          console.log(`!! getValidCharacterNameForLevel`);
          // const name = gameUtil.getValidCharacterNameForLevel(this.level);
          console.log(`!! next loadCharacter`);
          // TODO: if all trials done then exit
          if (this.trialCount >= gameUtil.totalNumberTrials()) {
            // You are done. 
            this.homeButtonPressed();
            return;
          } else {
            this.loadCharacter(this.trialCount);
          }
        }, timeToExit);
      });
    }, 1000);
  }

  canonicalScale (canonicalSize, size, scale) {
    const widthScale = canonicalSize/size.width * scale;
    const heightScale = canonicalSize/size.height * scale;
    return widthScale > heightScale ? heightScale : widthScale;
  }

  spriteSize (sqrSize, sprite, scale) {
    // the smaller of the sprite pixel aspect ratio sizes neariest to the
    // square compairison size scale value
    const scaleSize = this.canonicalScale(sqrSize, sprite.size, scale);
    return _.mapValues(sprite.size, (value) => value * (scaleSize) );
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

  characterStartLocation (character, scale) {
    const size = this.spriteSize(340, character, scale);
    const top = SCREEN_HEIGHT - (size.height + SCREEN_HEIGHT * 0.08);
    const left = -size.width;
    return {top, left};
  }

  characterWaitForFoodAt (character, imgScale, screenWidthScale) {
    const top = this.characterStartLocation(character, imgScale).top;
    const left = 150 * screenWidthScale;
    return {top, left};
  }

  leverSize (scale) {
    return _.mapValues(buttonSprite.size(this.scale.image * 1.2), (val) => val * scale);
  }

  buttonLocation (scale) {
    const size = buttonSprite.size(scale * 1.2);
    const left = SCREEN_WIDTH - size.width;
    const top = (SCREEN_HEIGHT - size.height) / 3;
    return {top, left};
  }

  signSize (sign, scale) {
    return _.mapValues(sign.size, (val) => val * scale);
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

  onLoadScreenFinish () {
    this.setState({loadingScreen: false});
  }

  render () {
    console.log(`!! render this.state.character = ${this.state.character.name}`)
    return (
      <Image
        source={require('../../media/backgrounds/Game_6_Background_1280.png')}
        style={styles.backgroundImage} >
    
        <AnimatedSprite
          sprite={buttonSprite}
          spriteUID={"button"}
          animationFrameIndex={this.state.buttonAnimationIndex}
          loopAnimation={false}
          coordinates={this.buttonLocation(this.scale.image)}
          size={buttonSprite.size(this.scale.image * 1.2)}
          onPressIn={() => this.buttonPressIn()}
        />

        <AnimatedSprite
          sprite={signSprite}
          ref={'leftSign'}
          animationFrameIndex={[0]}
          coordinates={this.signStartLocation('left', this.scale)}
          size={this.signSize(signSprite, this.scale.image)}
          draggable={false}
          tweenOptions={this.leftSign.tweenOptions}
          tweenStart={'fromMethod'}
        />

        <AnimatedSprite
          sprite={signSprite}
          ref={'middleSign'}
          animationFrameIndex={[0]}
          coordinates={this.signStartLocation('middle', this.scale)}
          size={this.signSize(signSprite, this.scale.image)}
          draggable={false}
          tweenOptions={this.middleSign.tweenOptions}
          tweenStart={'fromMethod'}
        />

        <AnimatedSprite
          sprite={signSprite}
          ref={'rightSign'}
          animationFrameIndex={[0]}
          coordinates={this.signStartLocation('right', this.scale)}
          size={this.signSize(signSprite, this.scale.image)}
          draggable={false}
          tweenOptions={this.rightSign.tweenOptions}
          tweenStart={'fromMethod'}
        />

        {this.leftFood.character ?
          <AnimatedSprite
            sprite={this.leftFood.character}
            ref={'leftFood'}
            key={this.leftFood.key}
            animationFrameIndex={this.leftFoodAnimationIndex}
            coordinates={this.leftFood.coords}
            size={this.spriteSize(120, this.leftFood.character, this.scale.image)}
            draggable={false}
            tweenOptions={this.leftFood.tweenOptions}
            tweenStart={'fromMethod'}
            onPress={() => this.foodPressed(LEFT)}
            onTweenFinish={() => this.onFoodTweenFinish(LEFT)}
          />
        : null}

        {this.middleFood.character ?
          <AnimatedSprite
            sprite={this.middleFood.character}
            ref={'middleFood'}
            key={this.middleFood.key}
            animationFrameIndex={this.rightFoodAnimationIndex}
            coordinates={this.middleFood.coords}
            size={this.spriteSize(120, this.middleFood.character, this.scale.image)}
            draggable={false}
            tweenOptions={this.middleFood.tweenOptions}
            tweenStart={'fromMethod'}
            onPress={() => this.foodPressed(RIGHT)}
            onTweenFinish={() => this.onFoodTweenFinish(RIGHT)}
          />
        : null}

        {this.rightFood.character ?
          <AnimatedSprite
            sprite={this.rightFood.character}
            ref={'rightFood'}
            key={this.rightFood.key}
            animationFrameIndex={[0]}
            coordinates={this.rightFood.coords}
            size={this.spriteSize(120, this.rightFood.character, this.scale.image)}
            draggable={false}
            tweenOptions={this.rightFood.tweenOptions}
            tweenStart={'fromMethod'}
            onPress={() => this.foodPressed(RIGHT)}
            onTweenFinish={() => this.onFoodTweenFinish(RIGHT)}
          />
        : null}

        <AnimatedSprite
          ref={'characterRef'}
          sprite={this.state.character}
          spriteUID={this.characterUIDs.character}
          key={this.characterUIDs.character}
          animationFrameIndex={this.state.characterAnimationIndex}
          loopAnimation={this.state.characterAnimationLoop}
          coordinates={this.characterStartLocation(this.state.character, this.scale.image)}
          size={this.spriteSize(340, this.state.character, this.scale.image)}
          rotate={this.activeCharacter.rotate}
          tweenOptions={this.activeCharacter.tweenOptions}
          tweenStart={'fromMethod'}
          onTweenFinish={(characterUID) => this.onCharacterTweenFinish(characterUID)}
        />

      {this.state.devMode ?
        <HomeButton
          route={this.props.route}
          navigator={this.props.navigator}
          routeId={{ id: 'Main' }}
          styles={{
            width: 150 * this.props.scale.image,
            height: 150 * this.props.scale.image,
            top:0, left: 0, position: 'absolute' }}
        />
      : null}
      {this.state.loadingScreen ?
        <LoadScreen
          onTweenFinish={() => this.onLoadScreenFinish()}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
        />
      : null}
      </Image>
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
