import React from 'react';
import {View, Image} from 'react-native';

import _ from 'lodash';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';
import styles from './styles';

import HomeButton from '../../components/HomeButton/HomeButton';
import AnimatedSprite from '../../components/AnimatedSprite/AnimatedSprite';
import dogSprite from '../../sprites/dog/dogCharacter';
import hookedCardSprite from '../../sprites/hookCard/hookCardCharacter';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const LEFT_EDGE = 150;

class MatrixReasoningGame extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.gameCharacters = ['dog', 'hookedCard'];
    this.characterUIDs = this.makeCharacterUIDs(this.gameCharacters);
    debugger;
  }

  componentWillMount () {

  }

  componentDidMount () {}

  makeCharacterUIDs () {
    return _.zipObject(this.gameCharacters,
      _.map(this.gameCharacters, ()=> randomstring({ length: 7 })));
  }

  spriteSize (sprite, scale) {
    return _.mapValues(sprite.size, (val) => val * scale);
  }

  dogSize (dogScale = 1.25) {
    return this.spriteSize(dogSprite, dogScale * this.props.scale.image);
  }

  hookSize (hookScale = 1.1) {
    return this.spriteSize(hookedCardSprite, hookScale * this.props.scale.image);
  }

  bigHookSize () {
    return this.hookSize(1.75);
  }

  dogStartLocation () {
    const size = this.dogSize();
    const left = LEFT_EDGE * this.props.scale.screenWidth;
    const top = SCREEN_HEIGHT - size.height - 60 * this.props.scale.screenHeight;
    return {top, left};
  }

  hookLocation (hookNumber) {
    //const size = this.spriteSize(dogSprite, 1 * this.props.scale.image);
    const dogSize = this.dogSize();
    const left = (LEFT_EDGE * this.props.scale.screenWidth) + dogSize.width / 2;
    const top = 20;
    return {top, left};
  }

  bigHookLocation (hookNumber) {
    const size = this.bigHookSize();
    const left = ( (LEFT_EDGE + 200) * this.props.scale.screenWidth);
    const top = 20;
    return {top, left};
  }

  leverLocation (scale) {
    const size = this.leverSize(scale);
    const left = SCREEN_WIDTH - size.width;
    const top = (SCREEN_HEIGHT - size.height) / 2;
    return {top, left};
  }

  pressStub () {}

  render () {
    return (
      <View style={styles.container}>
        <Image source={require('../../media/backgrounds/Game_4_Background_1280.png')} style={{
          width: 1280 * this.props.scale.screenWidth,
          height: 800 * this.props.scale.screenHeight,
          flex: 1,
        }}
        />
        <AnimatedSprite
          character={dogSprite}
          characterUID={this.characterUIDs.dog}
          animationFrameIndex={[0]}
          loopAnimation={false}
          tweenOptions={{}}
          tweenStart={'fromCode'}
          coordinates={this.dogStartLocation()}
          size={this.dogSize()}
          rotate={[{rotateY:'180deg'}]}
          onPress={() => this.pressStub()}
          onPressIn={() => this.pressStub()}
          onPressOut={() => this.pressStub()}
        />
      {/* this should end up being an array */}
        <AnimatedSprite
          character={hookedCardSprite}
          characterUID={this.characterUIDs.hookedCard}
          animationFrameIndex={[0]}
          loopAnimation={false}
          tweenOptions={{}}
          tweenStart={'fromCode'}
          coordinates={this.hookLocation(1)}
          size={this.hookSize()}
          rotate={[{rotateY:'0deg'}]}
          onPress={() => this.pressStub()}
          onPressIn={() => this.pressStub()}
          onPressOut={() => this.pressStub()}
        />

        <AnimatedSprite
          character={hookedCardSprite}
          characterUID={this.characterUIDs.hookedCard}
          animationFrameIndex={[0]}
          loopAnimation={false}
          tweenOptions={{}}
          tweenStart={'fromCode'}
          coordinates={this.bigHookLocation(1)}
          size={this.bigHookSize()}
          rotate={[{rotateY:'0deg'}]}
          onPress={() => this.pressStub()}
          onPressIn={() => this.pressStub()}
          onPressOut={() => this.pressStub()}
        />

        <HomeButton
          route={this.props.route}
          navigator={this.props.navigator}
          routeId={{id: 'Main'}}
          styles={{
            width: 150 * this.props.scale.image,
            height: 150 * this.props.scale.image,
            top: 0, left: 0,
            position: 'absolute',
          }}
        />
      </View>
    );
  }

}

MatrixReasoningGame.propTypes = {
  route: React.PropTypes.object.isRequired,
  navigator: React.PropTypes.object.isRequired,
  scale: React.PropTypes.object.isRequired
};

reactMixin.onClass(MatrixReasoningGame, TimerMixin);

export default MatrixReasoningGame;
