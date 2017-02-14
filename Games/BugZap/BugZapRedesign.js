import React from 'react';
import {
  View,
  Image,
} from 'react-native';

// spotlight style goes in styles instead of hard coded in here
// maybe AnimatedSprites can come from util instead of all at bottom here
// use refs? if not get rid of

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
    this.retractingSign = false,
    this.state = {
      leverAnimationIndex: lever.animationIndex('IDLE'),
      loadingScreen: true,
      signRightTweenOptions: null,
      showBugRight: false,
    };
  }

  componentWillMount () {

  }

  componentDidMount () {

  }

  componentWillUnmount () {
  }

  onLoadScreenFinish () {
    this.setState({loadingScreen: false});
  }

  leverPressIn () {
    this.setState({
      leverAnimationIndex: lever.animationIndex('SWITCH_ON'),
    });
    if (!this.state.showBugRight) {
      this.signDown();
    }
  }

  leverPressOut () {
    this.setState({
      leverAnimationIndex: lever.animationIndex('SWITCH_OFF'),
    });
    if (!this.state.showBugRight) {
      this.retractSign();
    }
  }

  signDown () {
    let signTweenOptions =
      gameUtil.getTweenOptions('signRight', 'on', this.props.scale.image,
                                                  this.props.scale.screenHeight,
                                                  this.props.scale.screenWidth);
    this.setState({
      signRightTweenOptions: signTweenOptions,
    }, () => { this.refs.signRightRef.spriteTween(); });
    this.retractingSign = false;
  }

  retractSign () {
    this.retractingSign = true;
    let signRightTweenOptions =
      gameUtil.getTweenOptions('signRight', 'off', this.props.scale.image,
                                                this.props.scale.screenHeight,
                                                this.props.scale.screenWidth);
    this.setState({
        signRightTweenOptions: signRightTweenOptions,
    }, () => { this.refs.signRightRef.spriteTween(); });
  }

  onTweenFinish (character) {
    console.warn("tween finished");
    switch (character) {
      case 'signRight':
        if (!this.retractingSign) {
          this.setState({showBugRight: true});
        }
        // else {
        //   this.resetTrialSettings();
        // }
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
            tweenOptions={this.state.bugTweenOptions}
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
