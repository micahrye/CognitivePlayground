import React from 'react';
import {
  View,
  Image,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

import AnimatedSprite from "../AnimatedSprite/AnimatedSprite";
import HomeButton from '../HomeButton/HomeButton';
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
const LEVEL_2 = 6

class BugZapGame extends React.Component {
  constructor (props) {
    super(props);
    this.character = {style: {opacity: 1}};
    this.loadingContent = false;
    this.bugPressed = false;
    this.characterPos = 550 * this.props.scale.screenWidth;
    this.characterTo = 10 * this.props.scale.screenWidth;
    this.characterPosY = 200 * this.props.scale.screenHeight;
    this.splashPos = 850 * this.props.scale.screenWidth;
    this.bugStartX = SCREEN_WIDTH/2 - (360 * this.props.scale.screenWidth);
    this.characterStartX = 900 * this.props.scale.screenWidth,
    this.rotate = undefined;
    this.characterDirection = 'left';
    this.trialNumber = 1;
    this.directionMaySwitch = true;
    this.fps = 8;
    this.showOtherBugSign = true;
    this.idle = 0;
    // this.eat1 = 3;
    // this.eat2 = 4;
    this.hopOn = [1];
    this.hopOff = [2];
    this.rightSignXPos = SCREEN_WIDTH/2 + (210 * this.props.scale.screenWidth);
    this.leftSignXPos = SCREEN_WIDTH/2 - (360 * this.props.scale.screenWidth);
    // this.blue = [9];
    // this.red = [10];
    this.characterOnScreen = false;
    this.whichBug = ' ';
    this.readyToCelebrate = false;
    this.retractingSign = false;
    this.frogLanded = false;
    this.state = {
      bugTweenOptions: null,
      showBugLeft: true,
      showBugRight: true,
      characterAnimationIndex: [this.hopOn],
      splashAnimationIndex: [4],
      characterTweenOptions: null,
      leftSignTweenOptions: null,
      rightSignTweenOptions: null,
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

    } else {
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
    clearTimeout(this.waitForFrogLand);
  }

  signBounceDown () {
    signTweenOptions = {
      tweenType: "bounce-drop",
      startY: -300,
      endY: -10 * this.props.scale.screenHeight,
      duration: 2000 * this.props.scale.screenHeight,
      repeatable: false,
      loop: false,
    };
    this.setState({
      showBugLeft: false,
      showBugRight: false,
      // signKey: Math.random(),
      leftSignTweenOptions: signTweenOptions,
      rightSignTweenOptions: signTweenOptions,
    });
  }

  setCharacterAnimations () {
    this.loadingContent = true;
    this.character.style = {opacity: 0};
    this.fps = 20;
    this.setState({
      characterAnimationIndex: frogCharacter.animationIndex('ALL'),
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
        this.characterTo = 900 * this.props.scale.screenWidth;
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
      splashAnimationIndex: [3,4,5],
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

  characterHopOff () {
    // console.warn('in character hop off');
    this.setState({
      characterKey: Math.random(),
      characterAnimationIndex: this.hopOff,
      characterTweenOptions: {
        tweenType: "linear-move",
        startXY: [this.characterPos, 300 * this.props.scale.screenHeight],
        endXY: [this.characterTo, SCREEN_HEIGHT],
        duration: 1000 * this.props.scale.screenHeight,
        loop: false,
      },
    });
    this.goToNextTrial();
  }


  // level 2 has timeouts
  bugTapTimeout () {
    // console.warn('here');
    // this will change once we have the jumping on/off the lily pad going
    this.characterDissapear = setTimeout (() => {
      this.characterHopOff();
    }, 2000);
  }

  onTweenFinish (characterUID) {
    switch (characterUID) {
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
      case 'signLeft':
        // this.setCharacterHopOn();
        if (!this.retractingSign) {
          this.startRipple();
          this.setState({
            showBugLeft: true,
          });
        }
        break;
      case 'signRight':
        if (!this.retractingSign) {
          this.setState({
            showBugRight: true,
          });
        }
        break;
      case 'character':
        if (this.trialNumber > LEVEL1B_TRIAL) {
          this.bugTapTimeout();
        }
        this.setState({
          characterAnimationIndex: [this.idle],
        });
        if (this.bugPressed && !this.frogLanded) {
          this.whichBugTapped();
        }
        this.frogLanded = true;
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
    else if (characterUID === 'character' && this.readyToCelebrate) {
      index = [5,6,6,6,0]
      this.setState({
        characterAnimationIndex: index,
      });
      this.readyToCelebrate = false;
      this.readyToHopOff = true;
      // this.goToNextTrial();
    }
    else if (characterUID === 'character' && this.readyToHopOff) {
      this.characterHopOff();
      this.readyToHopOff = false;
    }
  }

  goToNextTrial () {
    // console.warn('here');
    this.nextTrialTimeout = setTimeout (() => {
      this.props.navigator.replace({
        id: 'BugZapGame',
        trialNumber: this.trialNumber,
      });
    }, 2500);
  }

  onBugPress (whichBug) {
    // console.warn("in onbugpress");
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

    signTweenOptions = {
      tweenType: "linear-move",
      startXY: [start, -10 * this.props.scale.screenHeight],
      endXY: [start, -300],
      duration: 1000 * this.props.scale.screenHeight,
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
    // console.warn('in which bug tapped');
    if ((this.whichBug === 'bugLeft' && this.characterDirection === 'left') ||
        (this.whichBug === 'bugRight' && this.characterDirection === 'right')) {
      this.correctBugTapped();
    }
    else {
      this.wrongBugTapped();
    }
  }

  correctBugTapped () {
    // console.warn('in correct bug tapped');
    let index = [0,3,3,4,0];
    let delay = (700 * this.props.scale.screenWidth);

    if (this.whichBug === 'bugLeft') {
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
      this.readyToCelebrate = true;
      clearInterval(this.eatInterval);
    }, delay);
  }

  wrongBugTapped () {
    // console.warn('in wrong bug tapped');
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
      // this.goToNextTrial();
      this.characterHopOff();
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
            key={this.state.leftSignKey}
            characterUID={'signLeft'}
            character={signCharacter}
            coordinates={{top: -10 * this.props.scale.screenHeight, left: this.leftSignXPos}}
            size={{width: 140 * this.props.scale.screenWidth, height: 230 * this.props.scale.screenHeight}}
            animationFrameIndex={[0]}
            tweenOptions={this.state.leftSignTweenOptions}
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
                key={this.state.rightSignKey}
                character={signCharacter}
                characterUID={'signRight'}
                coordinates={{top: -10 * this.props.scale.screeHeight, left: this.rightSignXPos}}
                size={{width: 140 * this.props.scale.screenWidth, height: 230* this.props.scale.screenHeight}}
                animationFrameIndex={[0]}
                tweenOptions={this.state.rightSignTweenOptions}
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
