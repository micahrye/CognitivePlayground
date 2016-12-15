import React from 'react';
import {
  View,
  Image,
} from 'react-native';

import _ from 'lodash';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import styles from './styles';
import AnimatedSprite from '../../components/AnimatedSprite/AnimatedSprite';
import HomeButton from '../../components/HomeButton/HomeButton';
import monsterSprite from '../../sprites/monster/monsterCharacter';
import symbolTable from '../../sprites/symbolTable/symbolTableCharacter';
import signSprite from '../../sprites/sign/signCharacter';
import Signs from './Signs';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

class SymbolDigitCodingGame extends React.Component {
  constructor (props) {
    super(props);
    this.state = {

    };
    this.monsterScale = 1.5;
    this.tableScale = 1.3;
  }

  componentWillMount () {}
  componentDidMount () {}

  spriteSize (sprite, scale) {
    const scaleBy = scale * this.props.scale.image;
    return _.mapValues(sprite.size, (val) => val * scaleBy);
  }

  monsterStartLocation () {
    const height = this.spriteSize(monsterSprite, this.monsterScale).height;
    const left = 80 * this.props.scale.screenWidth;
    const top = SCREEN_HEIGHT - height - (50 * this.props.scale.screenHeight);
    return {top, left};
  }

  tableLocation () {
    const size = this.spriteSize(symbolTable, this.tableScale);
    const left = SCREEN_WIDTH - size.width - (40 * this.props.scale.screenWidth);
    const top = SCREEN_HEIGHT - size.height - (150 * this.props.scale.screenHeight);
    return {top, left};
  }

  signStartLocation (position, scale) {
    const top = 0; // -350 * scale.screenHeight;
    const baseLeft = 280;
    switch (position) {
      case 1:
        return {top, left: baseLeft * scale.screenWidth};
      case 2:
        return {top, left: (baseLeft + 200) * scale.screenWidth};
      case 3:
        return {top, left: (baseLeft + 400) * scale.screenWidth};
      case 4:
        return {top, left: (baseLeft + 600) * scale.screenWidth};
    }
  }

  pressStub () {}

  render () {
    return (
      <View style={styles.container}>
        <Image source={require('../../media/backgrounds/Game_6_Background_1280.png')}
          style={{width: 1280 * this.props.scale.screenWidth,
          height: 800 * this.props.scale.screenHeight, flex: 1}}
        />

        <AnimatedSprite
          character={monsterSprite}
          characterUID={randomstring({ length: 7})}
          animationFrameIndex={[0]}
          loopAnimation={false}
          tweenOptions={{}}
          tweenStart={'fromCode'}
          coordinates={this.monsterStartLocation()}
          size={this.spriteSize(monsterSprite, this.monsterScale)}
          rotate={[{rotateY:'180deg'}]}
          onPress={() => this.pressStub()}
          onPressIn={() => this.pressStub()}
          onPressOut={() => this.pressStub()}
        />

        <AnimatedSprite
          character={symbolTable}
          characterUID={randomstring({ length: 7})}
          animationFrameIndex={[0]}
          loopAnimation={false}
          tweenOptions={{}}
          tweenStart={'fromCode'}
          coordinates={this.tableLocation()}
          size={this.spriteSize(symbolTable, this.tableScale)}
          rotate={[{rotateY:'0deg'}]}
          onPress={() => this.pressStub()}
          onPressIn={() => this.pressStub()}
          onPressOut={() => this.pressStub()}
        />

        <View style={{
            top: 0, left: 280,
            width: 780 * this.props.scale.screenWidth,
            height: 300 * this.props.scale.screenHeight,
            position: 'absolute',
            borderColor: 'red',
            borderWidth: 2,
          }}>
        <Signs
          scale={this.props.scale}
        />
    </View>

        <HomeButton
          route={this.props.route}
          navigator={this.props.navigator}
          routeId={{ id: 'Main' }}
          styles={{
            width: 150 * this.props.scale.image,
            height: 150 * this.props.scale.image,
            top:0, left: 0, position: 'absolute' }}
        />
      </View>
    );
  }

}

SymbolDigitCodingGame.propTypes = {
  route: React.PropTypes.object.isRequired,
  navigator: React.PropTypes.object.isRequired,
  scale: React.PropTypes.object.isRequired,
};

reactMixin.onClass(SymbolDigitCodingGame, TimerMixin);

export default SymbolDigitCodingGame;
