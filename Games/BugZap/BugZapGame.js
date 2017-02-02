import React from 'react';
import {
  View,
  Image,
} from 'react-native';

import _ from 'lodash';


import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

import AnimatedSprite from '../../components/AnimatedSprite/AnimatedSprite';
import HomeButton from '../../components/HomeButton/HomeButton';
import LoadScreen from '../../components/LoadScreen';
// import characters for AnimatedSprite to use
import greenFrogCharacter from '../../sprites/frog/frogCharacter';
import blueFrogCharacter from '../../sprites/blueFrog/blueFrogCharacter';
import bugCharacter from '../../sprites/bug/bugCharacter';
import signCharacter from "../../sprites/sign/signCharacter";
import splashCharacter from "../../sprites/splash/splashCharacter";
import lightbulbCharacter from "../../sprites/lightbulb/lightbulbCharacter";
import lever from "../../sprites/verticalLever/verticalLeverCharacter";

import styles from "./BugZapStyles";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const LEVEL_ONBOARD = 2; // what trial number level lasts until
const LEVEL_TWO_BUGS = 4;
const LEVEL_TIMED = 7;
const LEVEL_SPOTLIGHT = 9;

class BugZapGame extends React.Component {
  constructor (props) {
    super(props);
    this.leftSign = {tweenOptions: {}};
    this.rightSign = {tweenOptions: {}};
    this.leftBug= {tweenOptions: {}};
    this.rightBug= {tweenOptions: {}};
    this.frog = {tweenOptions: {}};
    this.lightbulb = {tweenOptions: {}};
    this.lever = {tweenOptions: {}};
    this.bugPressed = false;
    this.splashPosX = 0;
    this.bugStartX = SCREEN_WIDTH/2 + (210 * this.props.scale.screenWidth);
    //this.signYStart = -300 * this.props.scale.image;
    this.rotate = undefined; // for frog to switch directions
    this.characterDirection = 'right';
    this.activeFrogColor = blueFrogCharacter;
    this.trialNumber = 1;
    this.validTrial =true;
    this.trialStarted = false;
    this.directionMaySwitch = false;
    this.fps = 8;
    this.showOtherBugSign = false;
    this.whichBug = ' ';
    this.retractingSign = false;
    this.frogLanded = false;
    this.bugAppeared = false;
    this.givenTime = 3500; // given this many seconds on timed trials to start with
    this.blackout = false;
    this.readyForInput = false;
    this.leverInterval;
    this.setDefaultAnimationState;
    this.hoppedOff = false;
    this.state = {
      bugTweenOptions: null,
      showBugLeft: false,
      showBugRight: false,
      characterAnimationIndex: this.activeFrogColor.animationIndex("IDLE"),
      splashAnimationIndex: null,
      lightbulbAnimationIndex: lightbulbCharacter.animationIndex("ON"),
      leverAnimationIndex: lever.animationIndex("IDLE"),
      characterTweenOptions: null,
      leftSignTweenOptions: null,
      rightSignTweenOptions: null,
      lightbulbTweenOptions: null,
      showSplashCharacter: false,
      showBlackout: false,
      showSpotlight: false,
      loadingScreen: true,
    };
  }

  componentWillMount () {
    this.setupWorld();
    this.activeFrogColor = blueFrogCharacter;
    this.activeFrogColor.tweenOptions = {tweenOptions: {}};
    this.setupTrial();
  }

  componentWillUnmount () {
    clearTimeout(this.characterDissapear);
    clearInterval(this.eatInterval);
    clearInterval(this.disgustInterval);
    clearInterval(this.interval);
    clearTimeout(this.removeBlackout);
    clearTimeout(this.removeSpotlight);
    clearTimeout(this.flashSpotlight);
  }

  setupWorld () {
    this.leftSign.coordinates = this.signStartLocation("left");
    this.rightSign.coordinates = this.signStartLocation("right");
    this.leftBug.coordinates =  this.bugStartLocation("left");
    this.rightBug.coordinates = this.bugStartLocation("right");
    this.setState({
      bugTweenOptions: {},
      characterTweenOptions: {},
      leftSignTweenOptions: {},
      rightSignTweenOptions: {},
      lightbulbTweenOptions: {},
    });
    this.frog = this.frogRightStartOptions();
    this.lightbulb.coordinates = this.lightbulbStartLocation();
    this.lever = lever;
    this.lever.coordinates = {top: SCREEN_HEIGHT - 220 * this.props.scale.screenHeight,
      left: SCREEN_WIDTH/2 - 100*this.props.scale.screenWidth,
    };
    this.lever.size = {
      width: 158 * this.props.scale.image,
      height: 194 * this.props.scale.image,
    };
    this.setCharacterAnimations();
  }

  signStartLocation (side) {
    let top = -300 * this.props.scale.image;
    if (side === "left") {
      return ({
        top: top,
        left: SCREEN_WIDTH/2 - (360 * this.props.scale.screenWidth),
      });
    }
    else {
      return ({
        top: -300 * this.props.scale.image,
        left: SCREEN_WIDTH/2 + (210 * this.props.scale.screenWidth),
      });
    }
  }

  bugStartLocation (side) {
    let top = 75 * this.props.scale.image;
    if (side === "left") {
      return ({
        top: top,
        left: SCREEN_WIDTH/2 - (350 * this.props.scale.screenWidth),
      });
    }
    else {
      return ({
        top: top,
        left: SCREEN_WIDTH/2 + (220 * this.props.scale.screenWidth),
      });
    }
  }

  frogRightStartOptions () {
    this.characterDirection = 'right';
    this.activeFrogColor = blueFrogCharacter;
    this.rotate = [{rotateY: '0deg'}];
    this.splashPosX = 900 * this.props.scale.screenWidth;
    this.frog.coordinates = this.displayFrogPosition('right', 'offscreen');
    return ({
      coordinates: this.displayFrogPosition('right', 'offscreen'),
      rotate: [{rotateY: '0deg'}],
    });
  }

  frogLeftStartOptions () {
    this.characterDirection = 'left';
    this.activeFrogColor = greenFrogCharacter;
    this.rotate = [{rotateY: '180deg'}];
    this.splashPosX = 10 * this.props.scale.screenWidth;
    this.frog.coordinates = this.displayFrogPosition('left', 'offscreen');
    return ({
      coordinates: this.displayFrogPosition('left', 'offscreen'),
      rotate: [{rotateY: '180deg'}],
    });
  }

  displayFrogPosition (screenSide, location) {
    let leftPos = 900 * this.props.scale.screenWidth;
    if (screenSide === 'left') {
      leftPos = 10 * this.props.scale.screenWidth;
    }
    switch (location) {
      case 'onscreen':
        return ({top: 300 * this.props.scale.screenHeight, left: leftPos});
      case 'offscreen':
        return ({top: SCREEN_HEIGHT + 100, left: leftPos});
    }
  }

  frogTweenToHeight () {
    return (200 * this.scale.screenHeight);
  }


  lightbulbStartLocation () {
    return ({
      top: -1000 * this.props.scale.screenHeight,
      left: SCREEN_WIDTH/2 - (50 * this.props.scale.screenWidth),
    });
  }

  setupTrial () {
    let directionMaySwitch = false;
    if (this.props.route.trialNumber != undefined) {
      //this.trialNumber = this.props.route.trialNumber + 1;
      this.validTrial = true;
      if (this.trialNumber > LEVEL_ONBOARD) {
        // now two bug choices
        directionMaySwitch = true;
        this.showOtherBugSign = true;
      }
      if (this.trialNumber > LEVEL_TWO_BUGS && this.trialNumber <= LEVEL_TIMED) {
        // now given certain amount of time to tap, decreasing over trials
        this.givenTime = this.props.route.givenTime - 500;
      }
      if (this.trialNumber > LEVEL_TIMED) {
        // now blackout and spotlight shown before trials
        this.getSpotLightStyle();
        this.blackout = true;
      }
    }
    else {
      // TODO can put back in but will cause problems with setState with home button
      // this.setCharacterAnimations();
    }

    if (directionMaySwitch) {
      this.setCharacterDirection();
    }
    this.readyForInput = true;
  }

  leverPressIn () {
    this.setState({
      leverAnimationIndex: lever.animationIndex("SWITCH_ON"),
    });
    //we don't want the lever to respond to input mid-trial
    if (this.readyForInput) {
      this.validTrial = true;
      this.leverInterval = setTimeout (() => {
        this.trialStarted = true;
        if (this.trialNumber > LEVEL_TIMED) {
          this.lightbulbDrop();
        }
        this.signDown();
        this.setBugTween();
      }, 500);
    }
  }

  leverPressOut () {
    clearTimeout(this.leverInterval); //clear if fingerUp before timer complete
    if (this.trialStarted) {this.readyForInput = false;}
    this.setState({
      leverAnimationIndex: lever.animationIndex("SWITCH_OFF"),
    });
    //TODO: interrupt code flow if leverPressOut too early
    if (this.trialStarted && !this.bugAppeared) {
      this.validTrial = false;
      this.retractBothSigns();
      if (this.trialNumber > LEVEL_TIMED) {
        this.lightbulbUp();
      }
    }
    else {
      this.bugAppeared = false;
    }
  }

  resetTrialSettings () {
    this.readyForInput = true;
    this.trialStarted = false;
    this.frogLanded = false;
    this.setState({
      showBugLeft: false,
      showBugRight: false,
    });
  }

  signDown () {
    let signTweenOptions = {
      tweenType: "bounce-drop",
      startY: this.signYStart,
      endY: -10 * this.props.scale.screenHeight,
      duration: 1500,
      repeatable: false,
      loop: false,
    };
    this.setState({
        leftSignTweenOptions: signTweenOptions,
        rightSignTweenOptions: signTweenOptions,
      },
      () => {
              if (this.showOtherBugSign) {
                this.refs.signLeftRef.spriteTween();
              }
              this.refs.signRightRef.spriteTween();
            }
      );
  }

  // TODO took this out because it was causing setState erros with the home button
  // so once in a while animations will be janky at first

  // // runs through all animations once before first trial to load them
  setCharacterAnimations () {
    //this.fps = 20;
    this.setState({
      characterAnimationIndex: this.activeFrogColor.animationIndex("ALL"),
    });
  }

  setCharacterDirection () {
    let direction = Math.floor(Math.random() * 2);

    if (direction >= 0.5) {
      this.frogLeftStartOptions();
    }
    else {
      this.frogRightStartOptions();
    }
    this.setCharacterAnimations();
  }

  startRipple () {
    // blackout starts when splash would have started on other trials
    if (this.blackout) {
      this.characterHopOn();
    }
    else {
      this.setState({
        showSplashCharacter: true,
        splashAnimationIndex: splashCharacter.animationIndex("RIPPLE"),
      });
    }
  }

  startSplash () {
    this.setState({
      showSplashCharacter: true,
      splashAnimationIndex: splashCharacter.animationIndex("SPLASH"),
    });
  }

  setBugTween () {
    let offset = this.characterDirection === 'left' ? -60 : 60;
    this.setState({
      bugTweenOptions: {
        tweenType: "curve-fall",
        // start on their tags
        startXY: [this.bugStartX, 95 * this.props.scale.screenHeight],
        // end at character
        endXY: [this.bugStartX + offset, 460 * this.props.scale.screenHeight],
        duration: 1000,
        loop: false,
      },
    });
  }

  makeLinearTween (startXY, endXY, duration=1000) {
    return ({
      tweenType: "linear-move",
      startXY: [startXY[0], startXY[1]],
      endXY: [endXY[0], endXY[1]],
      duration: duration,
      loop: false,
    });
  }

  characterHopOn () {
    if (this.validTrial) {
      const start = this.displayFrogPosition(this.characterDirection, 'offscreen');
      const end = this.displayFrogPosition(this.characterDirection, 'onscreen');
      const startXY = [start.left, start.top];
      const endXY = [end.left, end.top];
      this.setState({
        characterKey: Math.random(),
        characterTweenOptions: this.makeLinearTween(startXY, endXY, 100)});
      this.bugAppeared = true;
    }
  }

  characterHopOff () {
    const start = this.displayFrogPosition(this.characterDefinition, 'onscreen');
    const end = this.displayFrogPosition(this.characterDefinition, 'offscreen');
    const startXY = [start.left, start.top];
    const endXY = [end.left, end.top];
    this.setState({
      characterKey: Math.random(),
      characterAnimationIndex: this.activeFrogColor.animationIndex("IDLE"),
      characterTweenOptions: this.makeLinearTween(startXY, endXY, 1000)});
/*    if (this.validTrial) {
      this.goToNextTrial();
    }*/
  }


  // level 2 has timeouts
  bugTapTimeout () {
    this.characterDissapear = setTimeout (() => {
      this.setState ({
        showBugLeft: false,
        showBugRight: false,
      });
      this.startSplash();
      this.characterHopOff();
    }, this.givenTime);
  }

  onTweenFinish (characterUID) {
    switch (characterUID) {
      // bugs dissapear when they reach frog and are eaten
      case 'bugLeft':
        this.setState({
          showBugLeft: false,
        });
        break;
      case 'bugRight':
        this.setState({
          showBugRight: false,
        });
        break;
      // if signs are dropping down, not going back up
      case 'signLeft':
        if (!this.retractingSign && !this.blackout && this.validTrial) {
          this.setState({
            showBugLeft: true,
          });
        }
        break;
      case 'signRight':
        if (!this.retractingSign && !this.blackout && this.validTrial) {
          this.startRipple();
          this.setState({
            showBugRight: true,
          });
          this.bugAppeared = true;
        }
        else if (!this.validTrial && this.retractingSign) {
          this.resetTrialSettings();
        }
        else if (this.validTrial && this.retractingSign) {
          this.retractingSign = false;
        }
        break;
      case 'lightbulb':
        if (this.validTrial) {
          this.lightbulbOff();
        }
        break;
    }
  }

  onFrogTweenFinish () {
    if (this.trialNumber > LEVEL_TWO_BUGS /*&& this.trialNumber <= LEVEL_TIMED*/) {
      if (this.trialNumber >= LEVEL_TIMED) {
        this.givenTime = 5500;
      }
      this.bugTapTimeout();
    }
    // if bug has been pressed and frog is not finishing hopping off (already landed)
    if (this.bugPressed && !this.frogLanded) {
      clearTimeout(this.characterDissapear);
      this.whichBugTapped();
    }
    this.setState({
      characterAnimationIndex: this.activeFrogColor.animationIndex("IDLE"),
    });
    this.frogLanded = true;
    if (this.hoppedOff) {
      this.goToNextTrial();
    }
  }

  onAnimationFinish (characterUID) {
    if (characterUID === 'splash') {
      this.setState ({
        showSplashCharacter: false,
      });
      if (!this.hoppedOff) {
        this.characterHopOn();
      }
    }
    else if (characterUID === 'character' && this.readyToHopOff) {
      this.startSplash();
      this.characterHopOff();
      this.readyToHopOff = false;
      this.hoppedOff = true;
    }
  }

  goToNextTrial () {
    this.readyForInput =false;
    this.trialNumber++;
    this.hoppedOff = false;
    this.retractBothSigns();
  //  this.characterHopOff();
    this.resetTrialSettings();
    this.setupWorld();
    this.setupTrial();
  }

  onBugPress (whichBug) {
    console.warn("bong");
    if (this.bugPressed) {
      return true;
    }
    this.bugPressed = true;
    this.whichBug = whichBug;
    clearTimeout(this.characterDissapear);
    clearTimeout(this.nextTrialTimeout);

    this.retractOtherSign();
    if (this.frogLanded) {
      console.warn("bing");
      this.whichBugTapped();
    }
  }

  retractBothSigns () {
    const startRight = SCREEN_WIDTH/2 + (210 * this.props.scale.screenWidth);
    const startLeft = SCREEN_WIDTH/2 - (360 * this.props.scale.screenWidth);
    let leftSignTweenOptions = {};
    let signReturnPos = this.signStartLocation('right');
    let startXY = [startRight, -10 * this.props.scale.screenHeight];
    let endXY = [signReturnPos.left, signReturnPos.top];
    const rightSignTweenOptions = this.makeLinearTween(startXY, endXY);
    if (this.showOtherBugSign) {
      signReturnPos = this.signStartLocation('left');
      startXY = [startLeft, this.props.scale.screenHeight];
      endXY = [signReturnPos.left, signReturnPos.top];
      leftSignTweenOptions = this.makeLinearTween(startXY, endXY);
    }

    this.setState({
        rightSignTweenOptions: rightSignTweenOptions,
        showBugRight: false,
        leftSignTweenOptions: leftSignTweenOptions,
        showBugLeft: false,
    }, () => {
        if (this.showOtherBugSign) {
          this.refs.signLeftRef.spriteTween();
        }
        this.refs.signRightRef.spriteTween();
        this.retractingSign = true;
      });
  }

  retractOtherSign () {
    this.retractingSign = true;
    let signReturnPos = this.signStartLocation ('right');
    let start = SCREEN_WIDTH/2 - (360 * this.props.scale.screenWidth);
    if (this.whichBug === 'bugLeft') {
      signReturnPos = this.signStartLocation('left');
      start = SCREEN_WIDTH/2 + (210 * this.props.scale.screenWidth);
    }

    let signTweenOptions = {
      tweenType: "linear-move",
      startXY: [start, -10 * this.props.scale.screenHeight],
      endXY: [signReturnPos.left, signReturnPos.top],
      duration: 1000,
      loop: false,
    };

    if (this.whichBug === 'bugLeft') {
      this.setState({
        rightSignKey: Math.random(),
        rightSignTweenOptions: signTweenOptions,
        showBugRight: false,
      });
    }
    else {
      this.setState({
        leftSignKey: Math.random(),
        leftSignTweenOptions: signTweenOptions,
        showBugLeft: false,
      });
    }
  }

  whichBugTapped () {
    if ((this.whichBug === 'bugLeft' && this.characterDirection === 'left') ||
        (this.whichBug === 'bugRight' && this.characterDirection === 'right')) {
      this.correctBugTapped();
    }
    else {
      this.wrongBugTapped();
    }
  }

  correctBugTapped () {
    let delay = 700;

    if (this.whichBug === 'bugLeft') {
      this.refs.bugLeftRef.spriteTween();
    }
    else {
      this.refs.bugRightRef.spriteTween();
    }

    clearInterval(this.eatInterval);
    this.eatInterval = setInterval(() => {
      const eatAndCelebrateIndex = _.concat(
        this.activeFrogColor.animationIndex("EAT"),
      );
      this.setState({
        characterAnimationIndex: eatAndCelebrateIndex,
      });
      this.readyToHopOff = true;
      clearInterval(this.eatInterval);
    }, delay);
  }

  wrongBugTapped () {
    let delay = 100;
    this.disgustInterval = setInterval(() => {
      clearInterval(this.disgustInterval);
      this.setState({
        characterAnimationIndex: this.activeFrogColor.animationIndex("DISGUST"),
      });
    }, delay);

    this.interval = setInterval(() => {
      clearInterval(this.interval);
      this.startSplash();
      this.characterHopOff();
    }, 1000);
  }

  // lightbulb tweens down and turns off
  lightbulbDrop () {
    this.setState({
      lightbulbTweenOptions: {
        tweenType: "bounce-drop",
        startY: -300,
        endY: -10 * this.props.scale.screenHeight,
        duration: 2000,
        repeatable: false,
        loop: false,
      },
    }, () => {this.refs.lightbulbRef.spriteTween();});
  }

  lightbulbUp () {
    this.setState({
      lightbulbTweenOptions: {
        tweenType: "linear-move",
        startXY: [SCREEN_WIDTH/2 - (50 * this.props.scale.screenWidth), -10 * this.props.scale.screenHeight],
        endXY: [SCREEN_WIDTH/2 - (50 * this.props.scale.screenWidth), -300],
        duration: 1000,
        repeatable: false,
        loop: false,
      },
    }, () => {this.refs.lightbulbRef.spriteTween();});
  }

  // turns lightbulb off and sets blackout
  lightbulbOff () {
    this.bugAppeared = true;
    this.lightbulbOff = setTimeout(() => {
      this.setState({
        lightbulbAnimationIndex: lightbulbCharacter.animationIndex("OFF"),
      });
      this.showBlackout = setTimeout (() => {
        this.setBlackout();
      }, 1000);
    }, 500);
  }

  // screen goes black
  setBlackout () {
    this.setState({showBlackout: true});
    this.characterHopOn();
    this.flashSpotlight = setTimeout(() => {
      // after 1000ms show spotlight
      this.setState({showSpotlight: true});
      this.removeSpotlight = setTimeout(() => {
        // after another 1500ms remove spotlight
        this.setState({showSpotlight: false});
        this.removeBlackout = setTimeout(() => {
          // after another 500ms remove blackout
          this.setState({
            showBlackout: false,
            showBugRight: true,
            showBugLeft: true,
            lightbulbAnimationIndex: lightbulbCharacter.animationIndex("ON"),
          });
        }, 500);
      }, 1500);
    }, 1000);
  }

  getSpotLightStyle () {
    let posX = 300 * this.props.scale.screenWidth;
    // for first few blackout trials, spotlight is consistent with frog side
    // then it can be inconsistent
    if (this.trialNumber > LEVEL_TIMED && this.trialNumber <= LEVEL_SPOTLIGHT) {
      if (this.characterDirection === 'left') {
        posX = 800 * this.props.scale.screenWidth;
      }
    }
   else {
      const side = Math.random();
      if (side < .5) {
        posX = 800 * this.props.scale.screenWidth;
      }
   }
    this.spotLightStyle = {
      flex: 1,
      backgroundColor: 'white',
      height: 150,
      width: 150,
      left: posX,
      top: 450 * this.props.scale.screenHeight,
      position: 'absolute',
      borderRadius: 100,
    };
  }

  onLoadScreenFinish () {
    this.setState({loadingScreen: false});
  }

  render () {
    return (
      <Image
        source={require('../../media/backgrounds/Game_1_Background_1280.png')}
        style={styles.backgroundImage} >

      <AnimatedSprite
        key={this.state.characterKey}
        ref={'characterRef'}
        spriteUID={'character'}
        sprite={this.activeFrogColor}
        coordinates={this.displayFrogPosition(this.characterDirection, 'offscreen')}
        size={{
            width: 342 * this.props.scale.image,
            height: 432 * this.props.scale.image,
        }}
        animationFrameIndex={this.state.characterAnimationIndex}
        rotate={this.rotate}
        fps={this.fps}
        tweenOptions={this.state.characterTweenOptions}
        tweenStart={'fromMount'}
        onTweenFinish={() => this.onFrogTweenFinish()}
        onAnimationFinish={(characterUID) => this.onAnimationFinish(characterUID)}
      />

    {this.state.showSplashCharacter ?
      <AnimatedSprite
        spriteUID={'splash'}
        sprite={splashCharacter}
        coordinates={{top: 580 * this.props.scale.screenHeight,
          left: this.splashPosX}}
        size={{
            width: 340 * this.props.scale.image,
            height: 200 * this.props.scale.image,
        }}
        animationFrameIndex={this.state.splashAnimationIndex}
        onAnimationFinish={(characterUID) => this.onAnimationFinish(characterUID)}
      />
    : null}
    <AnimatedSprite
      spriteUID={'lever'}
      sprite={lever}
      coordinates={this.lever.coordinates}
      size={this.lever.size}
      animationFrameIndex={this.state.leverAnimationIndex}
      onAnimationFinish={(characterUID) => this.onAnimationFinish(characterUID)}
      onPressIn={() => this.leverPressIn()}
      onPressOut={() => this.leverPressOut()}
    />
    <AnimatedSprite
      ref={'signRightRef'}
      key={this.state.rightSignKey}
      sprite={signCharacter}
      spriteUID={'signRight'}
      coordinates={this.rightSign.coordinates}
      size={{width: 140 * this.props.scale.image, height: 230 * this.props.scale.image}}
      animationFrameIndex={[0]}
      tweenOptions={this.state.rightSignTweenOptions}
      tweenStart={'fromMethod'}
      onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
    />

    {this.state.showBugRight ?
      <AnimatedSprite
        ref={'bugRightRef'}
        spriteUID={'bugRight'}
        coordinates={{top: 75 * this.props.scale.screenHeight,
          left: SCREEN_WIDTH/2 + (220 * this.props.scale.screenWidth)}}
        size={{width: 120 * this.props.scale.image,
          height: 120 * this.props.scale.image}}
        sprite={bugCharacter}
        tweenOptions={this.state.bugTweenOptions}
        tweenStart={'fromMethod'}
        onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
        onPress={(characterUID) => this.onBugPress(characterUID)}
        animationFrameIndex={[1]}
      />
    : null}

    {this.showOtherBugSign ?
      <View>
        <AnimatedSprite
          ref={'signLeftRef'}
          key={this.state.leftSignKey}
          spriteUID={'signLeft'}
          sprite={signCharacter}
          coordinates={this.leftSign.coordinates}
          size={{width: 140 * this.props.scale.image, height: 230 * this.props.scale.image}}
          animationFrameIndex={[0]}
          tweenOptions={this.state.leftSignTweenOptions}
          onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
          tweenStart={'fromMethod'}
        />
        {this.state.showBugLeft ?
          <AnimatedSprite
            sprite={bugCharacter}
            ref={'bugLeftRef'}
            spriteUID={'bugLeft'}
            coordinates={{top: 75 * this.props.scale.screenHeight,
              left: SCREEN_WIDTH/2 - (350 * this.props.scale.screenWidth)}}
            size={{width: 120 * this.props.scale.image, height: 120 * this.props.scale.image}}
            tweenOptions={this.state.bugTweenOptions}
            tweenStart={'fromMethod'}
            onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
            onPress={(characterUID) => this.onBugPress(characterUID)}
            animationFrameIndex={[0]}
          /> : null}
      </View>: null}

    <AnimatedSprite
      ref={'lightbulbRef'}
      key={this.state.lightbulbKey}
      sprite={lightbulbCharacter}
      spriteUID={'lightbulb'}
      coordinates={{top: -1000 * this.props.scale.screenHeight, left: SCREEN_WIDTH/2 - (50 * this.props.scale.screenWidth)}}
      size={{width: 125 * this.props.scale.image, height: 250 * this.props.scale.image}}
      animationFrameIndex={this.state.lightbulbAnimationIndex}
      tweenOptions={this.state.lightbulbTweenOptions}
      tweenStart={'fromMethod'}
      onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
    />

    {this.state.showBlackout ?
      <View style={styles.blackout} />
    : null}

    {this.state.showSpotlight ?
      <View style={this.spotLightStyle} />
    : null}

    <HomeButton
      route={this.props.route}
      navigator={this.props.navigator}
      routeId={{ id: 'Main' }}
      styles={{
        width: 150 * this.props.scale.image,
        height: 150 * this.props.scale.image,
        top:0, left: 0, position: 'absolute' }}
    />
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

BugZapGame.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};
reactMixin.onClass(BugZapGame, TimerMixin);

export default BugZapGame;
