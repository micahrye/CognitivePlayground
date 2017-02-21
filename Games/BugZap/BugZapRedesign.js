import React from 'react';
import {
  Image,
} from 'react-native';

// NOTES for myself to look back on as I continue to redo things
// spotlight style goes in styles instead of hard coded in here
// frog fps necessary?
// frogKey necessary?
// something other than trialOver

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
    this.retractingSign = false;
    this.activeFrogColor = blueFrogCharacter;
    this.frogPositionX = 900 * this.props.scale.screenWidth;
    this.frogSide = 'right';
    this.splashPosX = this.frogPositionX;
    this.trialOver = false;
    this.state = {
      loadingScreen: true,
      frogKey: Math.random(),
      leverAnimationIndex: lever.animationIndex('IDLE'),
      frogAnimationIndex: this.activeFrogColor.animationIndex('IDLE'),
      splashAnimationIndex: splashCharacter.animationIndex('RIPPLE'),
      signRightTweenOptions: null,
      showBugRight: false,
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
  }

  onLoadScreenFinish () {
    this.setState({loadingScreen: false});
  }

  leverPressIn () {
    this.setState({
      leverAnimationIndex: lever.animationIndex('SWITCH_ON'),
    });
    if (!this.state.showBugRight) {
      this.leverInterval = setTimeout (() => { // make sure sign is retracted before going back down
        this.signDown();
      }, 500);
    }
  }

  leverPressOut () {
    clearTimeout(this.leverInterval); // if finger up before timeout complete
    this.setState({
      leverAnimationIndex: lever.animationIndex('SWITCH_OFF'),
    });
    if (!this.state.showBugRight) {
      this.retractSign();
    }
  }

  signDown () {
    this.retractingSign = false;

    let signTweenOptions =
      gameUtil.getTweenOptions('signRight', 'on', this.props.scale.image,
          this.props.scale.screenHeight,
          this.props.scale.screenWidth, null);
    this.setState({
      signRightTweenOptions: signTweenOptions,
    }, () => { this.refs.signRightRef.spriteTween(); });
  }

  retractSign () {
    this.retractingSign = true;
    const startRight =   SCREEN_WIDTH/2 + (210 * this.props.scale.screenWidth);
    let signRightTweenOptions = gameUtil.getTweenOptions('signRight', 'off',
          this.props.scale.image, this.props.scale.screenHeight,
          this.props.scale.screenWidth, startRight);
    this.setState({
        signRightTweenOptions: signRightTweenOptions,
    }, () => { this.refs.signRightRef.spriteTween(); });
  }

  onBugPress (whichBug) {
    this.refs.bugRightRef.spriteTween();
    if (whichBug == 'bugRight') {
      if (this.frogSide == 'right') {
        this.correctBugTapped();
      } else {
        this.wrongBugTapped();
      }
    } else {
      if (this.frogSide == 'left') {
        this.correctBugTapped();
      } else {
        this.wrongBugTapped();
      }
    }
  }

  correctBugTapped () {
    let delay = 700;
    this.eatDelay = setTimeout (() => {
      this.setState({frogAnimationIndex: this.activeFrogColor.animationIndex('EAT')});
    }, delay);
  }

  onTweenFinish (character) {
    switch (character) {
      case 'signRight':
        if (!this.retractingSign) {
          this.setState({showBugRight: true, showSplashCharacter: true});
        }
        // else {
        //   this.resetTrialSettings();
        // }
        break;
      case 'bugRight':
        this.setState({showBugRight: false});
        break;
      case 'bugLeft':
        break;
    }
  }

  onAnimationFinish (character) {
    switch (character) {
      case 'splash':
        if (!this.trialOver) {
          this.setState({showSplashCharacter: false, showFrog: true});
        }
        break;
      case 'frog':
        if (this.state.frogAnimationIndex != 0) { // if not idling
          this.trialOver = true;
          this.setState({showSplashCharacter: true,
            splashAnimationIndex: splashCharacter.animationIndex('SPLASH'),
            showFrog: false});
        }
        break;
    }
  }

  // resetTrialSettings () {
  //   console.warn('here');
  //   this.setState({showBugRight: false});
  // }

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
            key={this.state.frogKey}
            spriteUID={'frog'}
            sprite={this.activeFrogColor}
            coordinates={{top: 300 * this.props.scale.screenHeight, left: this.frogPositionX}}
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
          key={this.state.signRightKey}
          sprite={signCharacter}
          spriteUID={'signRight'}
          coordinates={gameUtil.getCoordinates('signRight', this.props.scale.screenHeight,
                        this.props.scale.screenWidth, this.props.scale.image)}
          size={gameUtil.getSize('signRight', this.props.scale.image)}
          animationFrameIndex={[0]}
          tweenOptions={this.state.signRightTweenOptions}
          tweenStart={'fromMethod'}
          onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
        />

        {this.state.showBugRight ?
          <AnimatedSprite
            ref={'bugRightRef'}
            spriteUID={'bugRight'}
            coordinates={gameUtil.getCoordinates('bugRight', this.props.scale.screenHeight,
                          this.props.scale.screenWidth, this.props.scale.image)}
            size={gameUtil.getSize('bugRight', this.props.scale.screenHeight,
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
