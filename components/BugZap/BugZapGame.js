import React from 'react';
import {
  View,
  Image,
} from 'react-native';

import _ from 'lodash';


import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

import AnimatedSprite from "../AnimatedSprite/AnimatedSprite";
import HomeButton from '../HomeButton/HomeButton';
// import characters for AnimatedSprite to use
import greenFrogCharacter from '../../sprites/frog/frogCharacter';
import blueFrogCharacter from '../../sprites/blueFrog/blueFrogCharacter';
import bugCharacter from '../../sprites/bug/bugCharacter';
import signCharacter from "../../sprites/sign/signCharacter";
import splashCharacter from "../../sprites/splash/splashCharacter";
import lightbulbCharacter from "../../sprites/lightbulb/lightbulbCharacter";

import styles from "./BugZapStyles";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const LEVEL1A_TRIALS = 2; // what trial number LEVEL1A lasts until
const LEVEL1B_TRIALS = 4;
const LEVEL2_TRIALS = 7;
const LEVEL3A_TRIALS = 9;
// const LEVEL1A_TRIALS = 1; // what trial number LEVEL1A lasts until
// const LEVEL1B_TRIALS = 2;
// const LEVEL2_TRIALS = 3;
// const LEVEL3A_TRIALS = 4;
// const LEVEL1A_TRIALS = 1; // what trial number LEVEL1A lasts until
// const LEVEL1B_TRIALS = 1;
// const LEVEL2_TRIALS = 1;
// const LEVEL3A_TRIALS = 4;
// const LEVEL3B_TRIALS = 11;

class BugZapGame extends React.Component {
  constructor (props) {
    super(props);
    this.loadingContent = false;
    this.bugPressed = false;
    this.characterPosX = 550 * this.props.scale.screenWidth;
    this.characterToX = 10 * this.props.scale.screenWidth;
    this.characterPosY = 200 * this.props.scale.screenHeight;
    this.characterStartX = 900 * this.props.scale.screenWidth;
    this.splashPosX = 800 * this.props.scale.screenWidth;
    this.bugStartX = SCREEN_WIDTH/2 - (360 * this.props.scale.screenWidth);
    this.rightSignXPos = SCREEN_WIDTH/2 + (210 * this.props.scale.screenWidth);
    this.leftSignXPos = SCREEN_WIDTH/2 - (360 * this.props.scale.screenWidth);
    this.rotate = undefined; // for frog to switch directions
    this.characterDirection = 'left';
    this.whichFrogColor = greenFrogCharacter;
    this.trialNumber = 1;
    this.directionMaySwitch = false;
    this.fps = 8;
    this.showOtherBugSign = false;
    this.idle = [0];
    this.hopOn = [1];
    this.hopOff = [2];
    this.whichBug = ' ';
    this.retractingSign = false;
    this.frogLanded = false;
    this.givenTime = 3500; // given this many seconds on timed trials to start with
    this.blackout = false;
    this.state = {
      bugTweenOptions: null,
      showBugLeft: false,
      showBugRight: false,
      characterAnimationIndex: this.hopOn,
      splashAnimationIndex: null,
      lightbulbAnimationIndex: lightbulbCharacter.animationIndex('ON'),
      characterTweenOptions: null,
      leftSignTweenOptions: null,
      rightSignTweenOptions: null,
      lightbulbTweenOptions: null,
      showSplashCharacter: false,
      showBlackout: false,
      showSpotlight: false,
    };
  }

  componentWillMount () {
    if (this.props.route.trialNumber != undefined) {
      this.trialNumber = this.props.route.trialNumber + 1;
      if (this.trialNumber > LEVEL1A_TRIALS) {
        // now two bug choices
        this.directionMaySwitch = true;
        this.showOtherBugSign = true;
      }
      if (this.trialNumber > LEVEL1B_TRIALS && this.trialNumber <= LEVEL2_TRIALS) {
        // now given certain amount of time to tap, decreasing over trials
        this.givenTime = this.props.route.givenTime - 500;
      }
      if (this.trialNumber > LEVEL2_TRIALS) {
        // now blackout and spotlight shown before trials
        this.getSpotLightStyle();
        this.blackout = true;
        this.lightbulbDrop();
      }
    } else {
      // first trial, run through all animations once
      this.setCharacterAnimations();
    }

    if (this.directionMaySwitch) {
      this.setCharacterDirection();
    }

    this.signDown();
    this.setBugTween();

  }

  componentWillUnmount () {
    clearTimeout(this.characterDissapear);
    // clearTimeout(this.nextTrialTimeout);
    // clearTimeout(this.waitForFrogLand);
  }

  signDown () {
    let signTweenOptions = {
      tweenType: "bounce-drop",
      startY: -300,
      endY: -10 * this.props.scale.screenHeight,
      duration: 2000,
      repeatable: false,
      loop: false,
    };
    this.setState({
      showBugLeft: false,
      showBugRight: false,
      leftSignTweenOptions: signTweenOptions,
      rightSignTweenOptions: signTweenOptions,
    });
  }

  // runs through all animations once before first trial to load them
  setCharacterAnimations () {
    this.loadingContent = true;
    this.fps = 20;
    this.setState({
      characterAnimationIndex: greenFrogCharacter.animationIndex('ALL'),
      splashAnimationIndex: splashCharacter.animationIndex("SPLASH"),
    });
    this.setState({
      characterAnimationIndex: blueFrogCharacter.animationIndex('ALL'),
    });
    // reset character to default state
    this.setDefaultAnimationState = setTimeout(() => {
      this.fps = 8;
      this.loadingContent = false;
      this.setState({
        characterAnimationIndex: this.hopOn,
      });
    }, 1000);
  }

  setCharacterDirection () {
    let direction = Math.floor(Math.random() * 2);

    // blue frog pointing to the right
    if (direction === 0) {
      this.characterDirection = 'right';
      this.whichFrogColor = blueFrogCharacter;
      this.setState({
        characterAnimationIndex: this.hopOn,
      });
      this.characterPosX = 450 * this.props.scale.screenWidth;
      this.characterToX = 900 * this.props.scale.screenWidth;
      this.bugStartX = SCREEN_WIDTH/2 + (210 * this.props.scale.screenWidth);
      this.characterStartX = 10 * this.props.scale.screenWidth;
      this.rotate = [{rotateY: '180deg'}];
      this.splashPosX = 150 * this.props.scale.screenWidth;
    }
  }

  startSplash () {
    // blackout starts when splash would have started on other trials
    if (this.blackout) {
      this.characterHopOn();
    }
    else {
      this.setState({
        showSplashCharacter: true,
        splashAnimationIndex: splashCharacter.animationIndex("SPLASH"),
      });
    }
  }

  setBugTween () {
    let endX = 520;
    if (this.characterDirection === 'right') {
      endX = 600;
    }
    this.setState({
      bugTweenOptions: {
        tweenType: "curve-fall",
        // start on their tags
        startXY: [this.bugStartX, 95 * this.props.scale.screenHeight],
        // end at character
        endXY: [endX * this.props.scale.screenWidth, 460 * this.props.scale.screenHeight],
        duration: 1000,
        loop: false,
      },
    });
  }

  characterHopOn () {
    this.setState({
      characterKey: Math.random(),
      characterTweenOptions: {
        tweenType: "linear-move",
        startXY: [this.characterStartX, SCREEN_HEIGHT],
        endXY: [this.characterPosX, 300 * this.props.scale.screenHeight],
        duration: 1000,
        loop: false,
      },
    });
  }

  characterHopOff () {
    this.setState({
      characterKey: Math.random(),
      characterAnimationIndex: this.hopOff,
      characterTweenOptions: {
        tweenType: "linear-move",
        startXY: [this.characterPosX, 300 * this.props.scale.screenHeight],
        endXY: [this.characterToX, SCREEN_HEIGHT],
        duration: 1000,
        loop: false,
      },
    });
    this.goToNextTrial();
  }


  // level 2 has timeouts
  bugTapTimeout () {
    this.characterDissapear = setTimeout (() => {
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
        if (!this.retractingSign && !this.blackout) {
          this.startSplash();
          this.setState({
            showBugLeft: true,
          });
        }
        break;
      case 'signRight':
        if (!this.retractingSign && !this.blackout) {
          this.setState({
            showBugRight: true,
          });
        }
        break;
      case 'lightbulb':
        this.lightbulbOff();
        break;
      case 'character':
        // if in the timeout level
        if (this.trialNumber > LEVEL1B_TRIALS && this.trialNumber <= LEVEL2_TRIALS) {
          this.bugTapTimeout();
        }
        // if bug has been pressed and frog is not finishing hopping off (already landed)
        if (this.bugPressed && !this.frogLanded) {
          clearTimeout(this.characterDissapear);
          this.whichBugTapped();
        }
        this.setState({
          characterAnimationIndex: this.idle,
        });
        this.frogLanded = true;
        break;
    }
  }

  onAnimationFinish (characterUID) {
    if (characterUID === 'splash') {
      this.setState ({
        showSplashCharacter: false,
      });
      this.characterHopOn();
    }
    else if (characterUID === 'character' && this.readyToHopOff) {
      this.characterHopOff();
      this.readyToHopOff = false;
    }
  }

  goToNextTrial () {
    this.nextTrialTimeout = setTimeout (() => {
      this.props.navigator.replace({
        id: 'BugZapGame',
        trialNumber: this.trialNumber,
        givenTime: this.givenTime,
      });
    }, 2500);
  }

  onBugPress (whichBug) {
    if (this.loadingContent || this.bugPressed) {
      return true;
    }
    this.bugPressed = true;
    this.whichBug = whichBug;
    clearTimeout(this.characterDissapear);
    clearTimeout(this.nextTrialTimeout);

    this.retractOtherSign();
    if (this.frogLanded) {
      this.whichBugTapped();
    }
  }

  retractOtherSign () {
    this.retractingSign = true;
    let start = SCREEN_WIDTH/2 - (360 * this.props.scale.screenWidth);
    if (this.whichBug === 'bugLeft') {
      start = SCREEN_WIDTH/2 + (210 * this.props.scale.screenWidth);
    }

    let signTweenOptions = {
      tweenType: "linear-move",
      startXY: [start, -10 * this.props.scale.screenHeight],
      endXY: [start, -300],
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
      this.refs.bugLeftRef.startTween();
    }
    else {
      this.refs.bugRightRef.startTween();
    }

    clearInterval(this.eatInterval);
    this.eatInterval = setInterval(() => {
      const eatAndCelebrateIndex = _.concat(
        this.whichFrogColor.animationIndex('EAT'),
        this.whichFrogColor.animationIndex('CELEBRATE')
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
        characterAnimationIndex: this.whichFrogColor.animationIndex('DISGUST'),
      });
    }, delay);

    this.interval = setInterval(() => {
      clearInterval(this.interval);
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
    });
  }

  // turns lightbulb off and sets blackout
  lightbulbOff () {
    this.lightbulbOff = setTimeout(() => {
      this.setState({
        lightbulbAnimationIndex: lightbulbCharacter.animationIndex('OFF'),
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
            lightbulbAnimationIndex: lightbulbCharacter.animationIndex('ON'),
          });
        }, 500);
      }, 1500);
    }, 1000);
  }


  getSpotLightStyle () {
    let posX = 300 * this.props.scale.screenWidth;
    // for first few blackout trials, spotlight is consistent with frog side
    // then it can be inconsistent
    if (this.trialNumber > LEVEL2_TRIALS && this.trialNumber <= LEVEL3A_TRIALS) {
      if (this.characterDirection === 'left') {
        posX = 800 * this.props.scale.screenWidth;
      }
    }
   else {
      const side = Math.random();
      console.warn(side);
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

  render () {
    return (
      <Image
        source={require('../../media/backgrounds/Game_1_Background_1280.png')}
        style={styles.backgroundImage} >

      <AnimatedSprite
        key={this.state.characterKey}
        characterUID={'character'}
        character={this.whichFrogColor}
        coordinates={{top: SCREEN_HEIGHT + 100,
          left: this.characterPosX}}
        size={{
            width: 342 * this.props.scale.image,
            height: 432 * this.props.scale.image,
        }}
        animationFrameIndex={this.state.characterAnimationIndex}
        rotate={this.rotate}
        fps={this.fps}
        tweenOptions={this.state.characterTweenOptions}
        tweenStart={'auto'}
        onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
        onAnimationFinish={(characterUID) => this.onAnimationFinish(characterUID)}
      />

    {this.state.showSplashCharacter ?
      <AnimatedSprite
        characterUID={'splash'}
        character={splashCharacter}
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
      key={this.state.leftSignKey}
      characterUID={'signLeft'}
      character={signCharacter}
      coordinates={{top: -10 * this.props.scale.screenHeight, left: this.leftSignXPos}}
      size={{width: 140 * this.props.scale.image, height: 230 * this.props.scale.image}}
      animationFrameIndex={[0]}
      tweenOptions={this.state.leftSignTweenOptions}
      onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
      tweenStart={'auto'}
    />

    {this.state.showBugLeft ?
      <AnimatedSprite
        character={bugCharacter}
        ref={'bugLeftRef'}
        characterUID={'bugLeft'}
        coordinates={{top: 75 * this.props.scale.screenHeight,
          left: SCREEN_WIDTH/2 - (350 * this.props.scale.screenWidth)}}
        size={{width: 120 * this.props.scale.image, height: 120 * this.props.scale.image}}
        tweenOptions={this.state.bugTweenOptions}
        tweenStart={'fromCode'}
        onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
        onPress={(characterUID) => this.onBugPress(characterUID)}
        animationFrameIndex={[0]}
      />
    : null}

    {this.showOtherBugSign ?
      <View>
        <AnimatedSprite
          key={this.state.rightSignKey}
          character={signCharacter}
          characterUID={'signRight'}
          coordinates={{top: -10 * this.props.scale.screenHeight, left: this.rightSignXPos}}
          size={{width: 140 * this.props.scale.image, height: 230* this.props.scale.image}}
          animationFrameIndex={[0]}
          tweenOptions={this.state.rightSignTweenOptions}
          tweenStart={'auto'}
          onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
        />

        {this.state.showBugRight ?
          <AnimatedSprite
            ref={'bugRightRef'}
            characterUID={'bugRight'}
            coordinates={{top: 75 * this.props.scale.screenHeight,
              left: SCREEN_WIDTH/2 + (220 * this.props.scale.screenWidth)}}
            size={{width: 120 * this.props.scale.image,
              height: 120 * this.props.scale.image}}
            character={bugCharacter}
            tweenOptions={this.state.bugTweenOptions}
            tweenStart={'fromCode'}
            onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
            onPress={(characterUID) => this.onBugPress(characterUID)}
            animationFrameIndex={[1]}
          />
        : null}
        </View>
    : null}

    <AnimatedSprite
      key={this.state.lightbulbKey}
      character={lightbulbCharacter}
      characterUID={'lightbulb'}
      coordinates={{top: -1000 * this.props.scale.screenHeight, left: SCREEN_WIDTH/2 - (50 * this.props.scale.screenWidth)}}
      size={{width: 125 * this.props.scale.image, height: 250 * this.props.scale.image}}
      animationFrameIndex={this.state.lightbulbAnimationIndex}
      tweenOptions={this.state.lightbulbTweenOptions}
      tweenStart={'auto'}
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
