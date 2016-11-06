import React from 'react';
import {
  View,
  Image,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

import AnimatedSprite from "../AnimatedSprite/AnimatedSprite";
// import characters for AnimatedSprite to use
import frogCharacter from '../../sprites/frog/frogCharacter';
import bugCharacter from '../../sprites/bug/bugCharacter';
// import omnivoreLite from '../../sprites/omnivoreLite/omnivoreLite';
import signCharacter from "../../sprites/sign/signCharacter";
import splashCharacter from "../../sprites/splash/splashCharacter";

import styles from "./BugZapStyles";

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const LEVEL1A_TRIAL = 2;
const LEVEL1B_TRIAL = 4;

class BugZapGame extends React.Component {
  constructor (props) {
    super(props);
    this.character = {style: {opacity: 1}};
    this.loadingContent = false;
    this.bugPressed = false;
    this.characterPos = 550 * this.props.scale.screenWidth;
    this.characterPosY = 300 * this.props.scale.screenHeight;
    this.splashPos = 850 * this.props.scale.screenWidth;
    this.bugStartX = SCREEN_WIDTH/2 - (360 * this.props.scale.screenWidth);
    this.characterStartX = 900 * this.props.scale.screenWidth,
    this.rotate = undefined;
    this.characterDirection = 'left';
    this.trialNumber = 1;
    this.directionMaySwitch = false;
    this.fps = 8;
    this.showOtherBugSign = false;
    this.idle = 0;
    this.eat1 = 3;
    this.eat2 = 4;
    this.hopOn = 1;
    // this.blue = [9];
    // this.red = [10];
    this.characterOnScreen = false;
    this.state = {
      bugTweenOptions: null,
      showBugLeft: true,
      showBugRight: true,
      characterAnimationIndex: [this.hopOn],
      splashAnimationIndex: [4],
      characterTweenOptions: null,
      signTweenOptions: null,
      showSplashCharacter: false,
    };
  }

  componentWillMount () {
    if (this.props.route.trialNumber != undefined) {
      this.trialNumber = this.props.route.trialNumber + 1;
      if (this.trialNumber > LEVEL1A_TRIAL) {
        this.directionMaySwitch = true;
        this.showOtherBugSign = true;
      }
      // this.setCharacterHopOn();

    }
    else {
      // first trial, run through all animations once
      this.setCharacterAnimations();
    }
    this.setCharacterDirection();
    this.setBugTween();
    this.signBounceDown();
  }

  componentWillUnmount () {
    clearTimeout(this.characterDissapear);
    clearTimeout(this.nextTrialTimeout);
  }

  signBounceDown () {
    this.setState({
      showBugLeft: false,
      showBugRight: false,
      signKey: Math.random(),
      signTweenOptions: {
        tweenType: "bounce-drop",
        startY: -300,
        endY: -10 * this.props.scale.screenHeight,
        duration: 2000,
        repeatable: false,
        loop: false,
      },
    });
  }

  setCharacterAnimations () {
    this.loadingContent = true;
    this.character.style = {opacity: 0};
    this.fps = 20;
    this.setState({
      characterAnimationIndex: [1,2,3,4,5,6,7],
    });    // reset characters to default state
    this.setDefaultAnimationState = setTimeout(() => {
      this.fps = 8;
      this.character.style = {opacity: 1};
      this.loadingContent = false;
      this.setState({
        characterAnimationIndex: [this.hopOn],
      });
    }, 1000);
  }

  setCharacterDirection () {
    if (this.directionMaySwitch) {
      let direction = Math.floor(Math.random() * 2);
      // this.characterDirection = 'left';

      if (direction === 0) {
        this.characterDirection = 'right';
        this.setState({
          characterAnimationIndex: [this.hopOn],
        });
        this.characterPos = 450 * this.props.scale.screenWidth;
        this.bugStartX = SCREEN_WIDTH/2 + (210 * this.props.scale.screenWidth);
        this.characterStartX = 10 * this.props.scale.screenWidth;
        this.rotate = [{rotateY: '180deg'}];
        this.splashPos = 100 * this.props.scale.screenWidth;
      }
    }
  }

  startRipple () {
    this.setState({
      showSplashCharacter: true,
      splashAnimationIndex: [0,1,2],
    });
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
        duration: 1000 * this.props.scale.screenWidth,
        loop: false,
      },
    });
  }

  characterHopOn () {
    // if (!this.characterOnScreen) {
      this.setState({
        characterKey: Math.random(),
        characterTweenOptions: {
          tweenType: "linear-move",
          startXY: [this.characterStartX, SCREEN_HEIGHT],
          endXY: [this.characterPos, 300 * this.props.scale.screenHeight],
          duration: 1000 * this.props.scale.screenHeight,
          loop: false,
        },
      });
    //   this.characterOnScreen = true;
    // }
  }

  // level 2 has timeouts
  bugTapTimeout () {
    // console.warn('here');
    // this will change once we have the jumping on/off the lily pad going
    this.characterDissapear = setTimeout (() => {
      this.goToNextTrial();
    }, 2000);
  }

  // characterHopOff () {
  //   this.setState({
  //     characterKey: Math.random(),
  //     characterTweenOptions: {
  //       tweenType: "hop",
  //       startY:  400 * this.props.scale.screenHeight,
  //       yTo: 100 * this.props.scale.screenHeight,
  //       endY: SCREEN_HEIGHT,
  //       duration: 1000 * this.props.scale.screenHeight,
  //       loop: false,
  //     },
  //   });
  //   this.goToNextTrial();
  // }


  onTweenFinish (characterUID) {
    switch (characterUID) {
      case 'bugLeft':
        this.goToNextTrial();
        this.setState({
          showBugLeft: false,
        });
        break;
      case 'bugRight':
        this.goToNextTrial();
        this.setState({
          showBugRight: false,
        });
        break;
      case 'signLeft':
        // this.setCharacterHopOn();
        this.startRipple();
        this.setState({
          showBugLeft: true,
        });
        break;
      case 'signRight':
        this.setState({
          showBugRight: true,
        });
        break;
      case 'character':
        if (this.trialNumber > LEVEL1B_TRIAL) {
          this.bugTapTimeout();
        }
        this.setState({
          characterAnimationIndex: [this.idle],
        });
        break;
    }
  }

  onAnimationFinish (characterUID) {
    // console.warn('in animation finish');
    if (characterUID === 'splash') {
      this.setState ({
        showSplashCharacter: false,
      });
      this.characterHopOn();
    }
    // this.characterHopOff();
  }

  goToNextTrial () {
    this.nextTrialTimeout = setTimeout (() => {
      this.props.navigator.replace({
        id: 'BugZapGame',
        trialNumber: this.trialNumber,
      });
    }, 2500);
  }

  onBugPress (whichBug) {
    if (this.loadingContent || this.bugPressed) {
      return true;
    }
    this.bugPressed = true;
    clearTimeout(this.characterDissapear);
    clearTimeout(this.nextTrialTimeout);

    if ((whichBug === 'bugLeft' && this.characterDirection === 'left') ||
        (whichBug === 'bugRight' && this.characterDirection === 'right')) {

      this.correctBugTapped(whichBug);
    }
    else {
      this.wrongBugTapped();
    }
  }

  correctBugTapped (whichBug) {
    let index = [0,3,3,4,0];
    let delay = (700 * this.props.scale.screenWidth);

    if (whichBug === 'bugLeft') {
      this.refs.bugLeftRef.startTween();
    }
    else {
      this.refs.bugRightRef.startTween();
    }

    clearInterval(this.eatInterval);
    this.eatInterval = setInterval(() => {
      this.setState({
        characterAnimationIndex: index,
      });
      clearInterval(this.eatInterval);
    }, delay);
  }

  wrongBugTapped () {
    let index = [7,7,7,0];
    let delay = 100;

    this.disgustInterval = setInterval(() => {
      clearInterval(this.disgustInterval);
      this.setState({
        characterAnimationIndex: index,
      });
    }, delay);

    this.interval = setInterval(() => {
      clearInterval(this.interval);
      this.goToNextTrial();
    }, 1000);
  }

  render () {
    return (
      <Image
        source={require('../../media/backgrounds/BugZap_Background_1280.png')}
        style={styles.backgroundImage} >

      <AnimatedSprite
        key={this.state.characterKey}
        characterUID={'character'}
        character={frogCharacter}
        coordinates={{top: SCREEN_HEIGHT + 100,
          left: this.characterPos}}
        size={{
            width: 342 * this.props.scale.image,
            height: 432 * this.props.scale.image,
        }}
        animationFrameIndex={this.state.characterAnimationIndex}
        rotate={this.rotate}
        style={this.character.style}
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
        coordinates={{top: SCREEN_HEIGHT - 200 * this.props.scale.screenHeight,
          left: this.splashPos}}
        size={{
            width: 340 * this.props.scale.image,
            height: 200 * this.props.scale.image,
        }}
        animationFrameIndex={this.state.splashAnimationIndex}
        onAnimationFinish={(characterUID) => this.onAnimationFinish(characterUID)}
      />
    : null}


       <View style={styles.itemContainer}>
          <AnimatedSprite
            key={this.state.signKey}
            characterUID={'signLeft'}
            character={signCharacter}
            coordinates={{top: -10 * this.props.scale.screenHeight, left: SCREEN_WIDTH/2 - (360 * this.props.scale.screenWidth)}}
            size={{width: 140 * this.props.scale.screenWidth, height: 230 * this.props.scale.screenHeight}}
            animationFrameIndex={[0]}
            tweenOptions={this.state.signTweenOptions}
            onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
            tweenStart={'auto'}
          />
      </View>

      {this.state.showBugLeft ?
        <AnimatedSprite
          character={bugCharacter}
          ref={'bugLeftRef'}
          characterUID={'bugLeft'}
          coordinates={{top: 75 * this.props.scale.screenHeight, left: SCREEN_WIDTH/2 - (370 * this.props.scale.screenWidth)}}
          size={{width: 150 * this.props.scale.screenWidth, height: 150 * this.props.scale.screenHeight}}
          tweenOptions={this.state.bugTweenOptions}
          tweenStart={'fromCode'}
          onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
          onPress={(characterUID) => this.onBugPress(characterUID)}
          animationFrameIndex={[1]}
        />
      : null}

      {this.showOtherBugSign ?
        <View>
          <View style={styles.itemContainer}>
              <AnimatedSprite
                character={signCharacter}
                characterUID={'signRight'}
                coordinates={{top: -10 * this.props.scale.screeHeight, left: SCREEN_WIDTH/2 + (210 * this.props.scale.screenWidth)}}
                size={{width: 140 * this.props.scale.screenWidth, height: 230* this.props.scale.screenHeight}}
                animationFrameIndex={[0]}
                tweenOptions={this.state.signTweenOptions}
                tweenStart={'auto'}
                onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
              />
          </View>
          {this.state.showBugRight ?
            <AnimatedSprite
              ref={'bugRightRef'}
              characterUID={'bugRight'}
              coordinates={{top: 75 * this.props.scale.screenHeight, left: SCREEN_WIDTH/2 + (200 * this.props.scale.screenWidth)}}
              size={{width: 150 * this.props.scale.screenWidth, height: 150 * this.props.scale.screenHeight}}
              character={bugCharacter}
              tweenOptions={this.state.bugTweenOptions}
              tweenStart={'fromCode'}
              onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
              onPress={(characterUID) => this.onBugPress(characterUID)}
              animationFrameIndex={[2]}
            />
          : null}
          </View>
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
