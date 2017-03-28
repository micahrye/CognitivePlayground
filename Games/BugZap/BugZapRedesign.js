import React from 'react';
import {
  Image,
  View,
  AppState,
} from 'react-native';

// NOTES for myself to look back on as I continue to redo things
// spotlight style goes in styles instead of hard coded in here
// frog fps necessary?
// something other than trialOver?
// time constraint on some levels? other level other than spotlight?

import AnimatedSprite from '../../components/AnimatedSprite/AnimatedSprite';
import HomeButton from '../../components/HomeButton/HomeButton';
import LoadScreen from '../../components/LoadScreen';

import greenFrogCharacter from '../../sprites/swimingGreenFrog/greenFrogSprite';
import blueFrogCharacter from '../../sprites/swimingBlueFrog/blueFrogSprite';
import bugCharacter from '../../sprites/bug/bugCharacter';
import signCharacter from "../../sprites/sign/signCharacter";
import splashCharacter from "../../sprites/splash/splashCharacter";
import lightbulbCharacter from "../../sprites/lightbulb/lightbulbCharacter";
import lever from "../../sprites/verticalLever/verticalLeverCharacter";

import styles from "./BugZapStyles";
import gameUtil from './gameUtil';

const Sound = require('react-native-sound');

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const BLUE_BUG = 1;
const GREEN_BUG = 0;

class BugZapGameRedesign extends React.Component {
  constructor (props) {
    super(props);
    // BUG: state is dependent on activeFrogColor, if order changed then we
    // throw an exception.
    // zero indexing for trialNumber
    this.trialNumber = 0;
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

    this.ambientSound;
    this.signSound;
    this.signSoundPlaying = false;
    this.popSound;
    this.popPlaying = false;
    this.celebrateSound;
    this.celebratePlaying = false;
    this.disgustSound;
    this.disgustPlaying = false;
    this.leftBugColorIndex = GREEN_BUG;
    this.rightBugColorIndex = BLUE_BUG;
  }

  componentWillMount () {
    this.setState(
      {frogAnimationIndex: this.activeFrogColor.animationIndex('ALL')}
      , () => {
        setTimeout(() => {
          this.setState({frogAnimationIndex: this.activeFrogColor.animationIndex('IDLE')})
        }, 1000);
      });
  }

  componentDidMount () {
    this.ambientSound = new Sound('ambient_swamp.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.ambientSound.setSpeed(1);
      this.ambientSound.setNumberOfLoops(-1);
      this.ambientSound.play();
      this.ambientSound.setVolume(1);
    });
    this.initSounds();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount () {
    this.releaseSounds();
    clearTimeout(this.leverInterval);
    clearTimeout(this.eatDelay);
    clearTimeout(this.clearScene);
  }

  initSounds () {
    // TODO: make initializing sounds its own file so we have an interface like
    // this.signSound = initSound('cards_drop.mp3')
    this.signSound = new Sound('cards_drop.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.signSound.setSpeed(1);
      this.signSound.setNumberOfLoops(0);
      this.signSound.setVolume(1);
    });
    this.popSound = new Sound('pop_touch.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.popSound.setSpeed(1);
      this.popSound.setNumberOfLoops(0);
      this.popSound.setVolume(1);
    });
    this.leverSound = new Sound('lever_switch.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.leverSound.setSpeed(1);
      this.leverSound.setNumberOfLoops(0);
      this.leverSound.setVolume(1);
    });
    this.celebrateSound = new Sound('celebrate.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.celebrateSound.setSpeed(1);
      this.celebrateSound.setNumberOfLoops(0);
      this.celebrateSound.setVolume(1);
    });
    this.disgustSound = new Sound('disgust.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.disgustSound.setSpeed(1);
      this.disgustSound.setNumberOfLoops(0);
      this.disgustSound.setVolume(0.9);
    });
  }

  releaseSounds () {
    this.ambientSound.stop();
    this.ambientSound.release();
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

  onLoadScreenFinish () {
    this.setState({loadingScreen: false});
  }

  setCharacterDirection () {
    // BUG: currently only chooses one direction.
    const trialValues = gameUtil.valuesForTrial(this.trialNumber);
    this.activeFrogColor = trialValues.sprite;
    this.frogSide = trialValues.frogSide;
    if (this.frogSide === 'left') {
      this.frogPosX = 10 * this.props.scale.screenWidth;
    } else {
      this.frogPosX = 900 * this.props.scale.screenWidth;
    }
    this.splashPosX = this.frogPosX;
    this.rotate = [{rotateY: trialValues.rotation}];
    // bug
    this.rightBugColorIndex = trialValues.rightBug === 'green' ? GREEN_BUG : BLUE_BUG;
    this.leftBugColorIndex = trialValues.leftBug === 'green' ? GREEN_BUG : BLUE_BUG ;
  }

  leverPressIn () {
    if (!this.leverPressable) return;
    if (!this.leverSoundPlaying) {
      this.leverSoundPlaying = true;
      this.leverSound.play(() => {this.leverSoundPlaying = false;});
    }

    this.setCharacterDirection(this.trialNumber);
    if (this.trialNumber > 1) {
      this.showOtherSign = true;
    }

    this.setState({
      leverAnimationIndex: lever.animationIndex('SWITCH_ON'),
    });
    if (!this.state.showBugRight) {
      this.leverInterval = setTimeout (() => {
        // make sure sign is fully retracted before going back down
        this.signDown();
      }, 600); // amount of time it takes sign to retract
    }
  }

  leverPressOut () {
    // only show sign retracting if it had started to go down
    if (!this.state.showBugRight && !this.retractingSign) {
      this.retractSign();
      this.leverPressable = false;
    }
    // if finger up before timeout complete
    clearTimeout(this.leverInterval);
    this.setState({
      leverAnimationIndex: lever.animationIndex('SWITCH_OFF'),
    });
  }

  signDown () {
    if (!this.signSoundPlaying) {
      this.signSoundPlaying = true;
      this.signSound.play(() => {this.signSoundPlaying = false;});
    }
    this.retractingSign = false;
    let signTweenOptions =
      gameUtil.getTweenOptions('sign', 'on', this.props.scale.image,
          this.props.scale.screenHeight,
          this.props.scale.screenWidth, null);
    this.setState({
      signRightTweenOptions: signTweenOptions,
      signLeftTweenOptions: signTweenOptions,
    }, () => {
      this.refs.signRightRef.startTween();
      if (this.showOtherSign) {
        this.refs.signLeftRef.startTween();
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
    }, () => { this.refs.signRightRef.startTween();
               if (this.showOtherSign) {
                 this.refs.signLeftRef.startTween();
               }
             });
  }

  onBugPress (pressedBug) {
    if (pressedBug === 'bugRight') {
      if (this.activeFrogColor.name.includes('green')) {
        if (this.rightBugColorIndex === GREEN_BUG) {
          this.correctBugTapped('right', this.frogSide);
          return;
        }
      } else {
        if (this.rightBugColorIndex === BLUE_BUG) {
          this.correctBugTapped('right', this.frogSide);
          return;
        }
      }
    }
    if (pressedBug === 'bugLeft') {
      if (this.activeFrogColor.name.includes('green')) {
        if (this.leftBugColorIndex === GREEN_BUG) {
          this.correctBugTapped('left', this.frogSide);
          return;
        }
      } else {
        if (this.leftBugColorIndex === BLUE_BUG) {
          this.correctBugTapped('left', this.frogSide);
          return;
        }
      }
    }
    this.wrongBugTapped();
  }

  correctBugTapped (bugSide, frogSide) {
    // TODO: add celebration sound
    if (bugSide == 'left') {
      this.refs.bugLeftRef.startTween();
    }
    else {
      this.refs.bugRightRef.startTween();
    }
    let delay = 600;
    this.eatDelay = setTimeout (() => {
      if (!this.celebratePlaying) {
        this.celebratePlaying = true;
        this.celebrateSound.play(() => {this.celebratePlaying = false;});
      }
      this.setState({frogAnimationIndex: this.activeFrogColor.animationIndex('EAT')});
    }, delay);
  }

  wrongBugTapped () {
    if (!this.disgustPlaying) {
      this.disgustPlaying = true;
      this.disgustSound.play(() => {this.disgustPlaying = false;});
    }
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
          this.setState(
            {
              showSplashCharacter: true,
              splashAnimationIndex: splashCharacter.animationIndex('SPLASH'),
              showFrog: false,
            });
          this.resetTrialSettings();
        }
        break;
    }
  }

  resetTrialSettings () {
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

  getBugCoordinates (whichBug) {
    if (whichBug == 'right') {
      return gameUtil.getCoordinates(
        'bugRight',
        this.props.scale.screenHeight,
        this.props.scale.screenWidth,
        this.props.scale.image
      );
    } else if (whichBug == 'left') {
      return gameUtil.getCoordinates(
        'bugLeft',
        this.props.scale.screenHeight,
        this.props.scale.screenWidth,
        this.props.scale.image
      );
    }
  }

  getBugTween (bugSide) {
    const frogCoords = {top: 300 * this.props.scale.screenHeight, left: this.frogPosX};
    const frogSize = gameUtil.getSize('frog', this.props.scale.image);
    return gameUtil.getBugTweenOptions(
      bugSide,
      this.frogSide,
      frogCoords,
      frogSize,
      this.props.scale.screenHeight,
      this.props.scale.screenWidth
    )
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

        {this.state.showFrog ?
          <AnimatedSprite
            spriteUID={'frog'}
            sprite={this.activeFrogColor}
            coordinates={{top: 500 * this.props.scale.screenHeight, left: this.frogPosX}}
            size={gameUtil.getSize('frog', this.props.scale.image)}
            animationFrameIndex={this.state.frogAnimationIndex}
            rotate={this.rotate}
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
            coordinates={this.getBugCoordinates('right')}
            size={gameUtil.getSize('bug', this.props.scale.screenHeight,
                          this.props.scale.screenWidth, this.props.scale.image)}
            sprite={bugCharacter}
            tweenOptions={this.getBugTween('right')}
            tweenStart={'fromMethod'}
            onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
            onPress={(characterUID) => this.onBugPress(characterUID)}
            animationFrameIndex={[this.rightBugColorIndex]}
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
                coordinates={this.getBugCoordinates('left')}
                size={gameUtil.getSize('bug', this.props.scale.image)}
                tweenOptions={this.getBugTween('left')}
                tweenStart={'fromMethod'}
                onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
                onPress={(characterUID) => this.onBugPress(characterUID)}
                animationFrameIndex={[this.leftBugColorIndex]}
              /> : null}
          </View>: null}

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

BugZapGameRedesign.propTypes = {
  scale: React.PropTypes.object,
  navigator: React.PropTypes.object,
  route: React.PropTypes.object,
};

export default BugZapGameRedesign;
