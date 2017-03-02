import React from 'react';
import {
  Image,
  View,
} from 'react-native';

// NOTES for myself to look back on as I continue to redo things
// spotlight style goes in styles instead of hard coded in here
// frog fps necessary?
// something other than trialOver?
// time constraint on some levels? other level other than spotlight?

import AnimatedSprite from '../../components/AnimatedSprite/AnimatedSprite';
import HomeButton from '../../components/HomeButton/HomeButton';
import LoadScreen from '../../components/LoadScreen';

import greenFrogCharacter from '../../sprites/frog/frogCharacter';
import blueFrogCharacter from '../../sprites/blueFrog/blueFrogCharacter';
import bugCharacter from '../../sprites/bug/bugCharacter';
import signCharacter from "../../sprites/sign/signCharacter";
import splashCharacter from "../../sprites/splash/splashCharacter";
import lightbulbCharacter from "../../sprites/lightbulb/lightbulbCharacter";
import lever from "../../sprites/verticalLever/verticalLeverCharacter";

import styles from "./BugZapStyles";
import gameUtil from './gameUtil';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

class BugZapGameRedesign extends React.Component {
  constructor (props) {
    super(props);
    this.trialNumber = 1;
    this.activeFrogColor = blueFrogCharacter;
    this.showOtherSign = false;
    this.frogPosX = 900 * this.props.scale.screenWidth;
    this.frogSide = 'right';
    this.splashPosX = this.frogPosX;
    this.rotate = undefined;
    this.trialOver = false;
    this.retractingSign = true;
    this.leverPressable = true;
    this.state = {
      loadingScreen: true,
      leverAnimationIndex: lever.animationIndex('IDLE'),
      frogAnimationIndex: this.activeFrogColor.animationIndex('IDLE'),
      splashAnimationIndex: splashCharacter.animationIndex('RIPPLE'),
      signRightTweenOptions: null,
      signLeftTweenOptions: null,
      showBugRight: false,
      showBugLeft: false,
      showFrog: false,
      showSplashCharacter: false,
    };
  }

  componentWillMount () {
  }

  componentDidMount () {
  }

  componentWillUnmount () {
    this.clearTimeout(this.leverInterval);
    this.clearTimeout(this.eatDelay);
    this.clearTimeout(this.clearScene);
  }

  onLoadScreenFinish () {
    this.setState({loadingScreen: false});
  }

  setCharacterDirection () {
    let whichFrog = Math.floor(Math.random() * 2);

    if (whichFrog >= 0.5) {
      this.activeFrogColor = greenFrogCharacter;
      this.frogPosX = 10 * this.props.scale.screenWidth;
      this.frogSide = 'left';
      this.splashPosX = this.frogPosX;
      this.rotate = [{rotateY: '180deg'}];
   }
  }

  leverPressIn () {
    if (this.trialNumber > 1) {
      this.setCharacterDirection();
      this.showOtherSign = true;
    }

    if (this.leverPressable) {
      this.setState({
        leverAnimationIndex: lever.animationIndex('SWITCH_ON'),
      });
      if (!this.state.showBugRight) {
        this.leverInterval = setTimeout (() => { // make sure sign is fully retracted before going back down
          this.signDown();
        }, 600); // amount of time it takes sign to retract
      }
    }
  }

  leverPressOut () {
    if (!this.state.showBugRight && !this.retractingSign) { // only show sign retracting if it had started to go down
      this.retractSign();
      this.leverPressable = false;
    }

    clearTimeout(this.leverInterval); // if finger up before timeout complete
    this.setState({
      leverAnimationIndex: lever.animationIndex('SWITCH_OFF'),
    });
  }

  signDown () {
    this.retractingSign = false;
    let signTweenOptions =
      gameUtil.getTweenOptions('sign', 'on', this.props.scale.image,
          this.props.scale.screenHeight,
          this.props.scale.screenWidth, null);
    this.setState({
      signRightTweenOptions: signTweenOptions,
      signLeftTweenOptions: signTweenOptions,
    }, () => { this.refs.signRightRef.spriteTween();
               if (this.showOtherSign) {
                 this.refs.signLeftRef.spriteTween();
               }
             });
  }

  retractSign () {
    this.retractingSign = true;
    const startRight =   SCREEN_WIDTH/2 + (210 * this.props.scale.screenWidth);
    const startLeft = SCREEN_WIDTH/2 - (360 * this.props.scale.screenWidth);
    let signRightTweenOptions = gameUtil.getTweenOptions('sign', 'off',
          this.props.scale.image, this.props.scale.screenHeight,
          this.props.scale.screenWidth, startRight);
    let signLeftTweenOptions = gameUtil.getTweenOptions('sign', 'off',
          this.props.scale.image, this.props.scale.screenHeight,
          this.props.scale.screenWidth, startLeft);
    this.setState({
        signRightTweenOptions: signRightTweenOptions,
        signLeftTweenOptions: signLeftTweenOptions,
    }, () => { this.refs.signRightRef.spriteTween();
               if (this.showOtherSign) {
                 this.refs.signLeftRef.spriteTween();
               }
             });
  }

  onBugPress (whichBug) {
    if (whichBug == 'bugRight') {
      if (this.frogSide == 'right') {
        this.correctBugTapped(this.frogSide);
      } else {
        this.wrongBugTapped();
      }
    } else {
      if (this.frogSide == 'left') {
        this.correctBugTapped(this.frogSide);
      } else {
        this.wrongBugTapped();
      }
    }
  }

  correctBugTapped (bugSide) {
    if (bugSide == 'left') {
      this.refs.bugLeftRef.spriteTween();
    }
    else {
      this.refs.bugRightRef.spriteTween();
    }
    let delay = 700;
    this.eatDelay = setTimeout (() => {
      this.setState({frogAnimationIndex: this.activeFrogColor.animationIndex('EAT')});
    }, delay);
  }

  wrongBugTapped () {
    this.setState({frogAnimationIndex: this.activeFrogColor.animationIndex('DISGUST')});
  }

  onTweenFinish (character) {
    switch (character) {
      case 'signRight':
        if (!this.retractingSign) {
          this.setState({showBugRight: true, showSplashCharacter: true});
          this.leverPressable = false;
        }
        else {
            this.leverPressable = true;
        }
        break;
      case 'signLeft':
        if (!this.retractingSign) {
          this.setState({showBugLeft: true});
        }
        break;
      case 'bugRight':
        this.setState({showBugRight: false});
        break;
      case 'bugLeft':
        this.setState({showBugLeft: false});
        break;
    }
  }

  onAnimationFinish (character) {
    switch (character) {
      case 'splash':
        if (!this.trialOver) {
          this.setState({showFrog: true});
        }
        this.setState({showSplashCharacter: false});
        break;
      case 'frog':
        if (this.state.frogAnimationIndex != 0) { // if not idling
          this.trialOver = true;
          this.setState({showSplashCharacter: true,
            splashAnimationIndex: splashCharacter.animationIndex('SPLASH'),
            showFrog: false});
          this.resetTrialSettings();
        }
        break;
    }
  }

  resetTrialSettings () {
    // this.clearTimeout(this.leverInterval);
    // this.clearTimeout(this.eatDelay);
    this.clearScene = setTimeout(() => {
      this.setState({
        showBugRight: false,
        showBugLeft: false,
        frogAnimationIndex: this.activeFrogColor.animationIndex('IDLE')});
      this.retractSign();
      this.trialOver = false;
      this.leverPressable = true;
      this.trialNumber = this.trialNumber + 1;
    }, 1000);
  }

  render () {
    return (
      <Image
        source={require('../../media/backgrounds/Game_1_Background_1280.png')}
        style={styles.backgroundImage} >

        <AnimatedSprite
          sprite={lever}
          coordinates={gameUtil.getCoordinates('lever', this.props.scale.screenHeight,
                        this.props.scale.screenWidth, null)}
          animationFrameIndex={this.state.leverAnimationIndex}
          size={gameUtil.getSize('lever', this.props.scale.image)}
          onPressIn={() => this.leverPressIn()}
          onPressOut={() => this.leverPressOut()}
        />

        {this.state.showFrog ?
          <AnimatedSprite
            spriteUID={'frog'}
            sprite={this.activeFrogColor}
            coordinates={{top: 300 * this.props.scale.screenHeight, left: this.frogPosX}}
            size={gameUtil.getSize('frog', this.props.scale.image)}
            animationFrameIndex={this.state.frogAnimationIndex}
            rotate={this.rotate}
            onAnimationFinish={(characterUID) => this.onAnimationFinish(characterUID)}
          />
        : null}

        {this.state.showSplashCharacter ?
          <AnimatedSprite
            spriteUID={'splash'}
            sprite={splashCharacter}
            coordinates={{top: 580 * this.props.scale.screenHeight,
              left: this.splashPosX}}
            size={gameUtil.getSize('splash', this.props.scale.image)}
            animationFrameIndex={this.state.splashAnimationIndex}
            onAnimationFinish={(characterUID) => this.onAnimationFinish(characterUID)}
          />
        : null}

        <AnimatedSprite
          ref={'signRightRef'}
          sprite={signCharacter}
          spriteUID={'signRight'}
          coordinates={gameUtil.getCoordinates('signRight', this.props.scale.screenHeight,
                        this.props.scale.screenWidth, this.props.scale.image)}
          size={gameUtil.getSize('sign', this.props.scale.image)}
          tweenOptions={this.state.signRightTweenOptions}
          tweenStart={'fromMethod'}
          onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
          animationFrameIndex={[0]}
        />

        {this.state.showBugRight ?
          <AnimatedSprite
            ref={'bugRightRef'}
            spriteUID={'bugRight'}
            coordinates={gameUtil.getCoordinates('bugRight', this.props.scale.screenHeight,
                          this.props.scale.screenWidth, this.props.scale.image)}
            size={gameUtil.getSize('bug', this.props.scale.screenHeight,
                          this.props.scale.screenWidth, this.props.scale.image)}
            sprite={bugCharacter}
            tweenOptions={gameUtil.getTweenOptions('bug', this.frogSide,
              null, this.props.scale.screenHeight, this.props.scale.screenWidth, null)}
            tweenStart={'fromMethod'}
            onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
            onPress={(characterUID) => this.onBugPress(characterUID)}
            animationFrameIndex={[1]}
          />
        : null}

        {this.showOtherSign ?
          <View>
            <AnimatedSprite
              ref={'signLeftRef'}
              sprite={signCharacter}
              spriteUID={'signLeft'}
              coordinates={gameUtil.getCoordinates('signLeft', this.props.scale.screenHeight,
                            this.props.scale.screenWidth, this.props.scale.image)}
              size={gameUtil.getSize('sign', this.props.scale.image)}
              animationFrameIndex={[0]}
              tweenOptions={this.state.signLeftTweenOptions}
              tweenStart={'fromMethod'}
              onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
            />
            {this.state.showBugLeft ?
              <AnimatedSprite
                sprite={bugCharacter}
                ref={'bugLeftRef'}
                spriteUID={'bugLeft'}
                coordinates={gameUtil.getCoordinates('bugLeft', this.props.scale.screenHeight,
                              this.props.scale.screenWidth, this.props.scale.image)}
                size={gameUtil.getSize('bug', this.props.scale.image)}
                tweenOptions={gameUtil.getTweenOptions('bug', this.frogSide,
                  null, this.props.scale.screenHeight, this.props.scale.screenWidth, null)}
                tweenStart={'fromMethod'}
                onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
                onPress={(characterUID) => this.onBugPress(characterUID)}
                animationFrameIndex={[0]}
              /> : null}
          </View>: null}


        {this.state.loadingScreen ?
          <LoadScreen
            onTweenFinish={() => this.onLoadScreenFinish()}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
          />
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

BugZapGameRedesign.propTypes = {
  scale: React.PropTypes.object,
  navigator: React.PropTypes.object,
  route: React.PropTypes.object,
};

export default BugZapGameRedesign;
