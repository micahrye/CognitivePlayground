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

class SymbolDigitCodingGame extends React.Component {
  constructor (props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount () {}
  componentDidMount () {}

  spriteSize (sprite, scale) {
    return _.mapValues(sprite.size, (val) => val * scale);
  }

  monsterStartLocation () {
    return {top: 500, left: 100};
  }
  monsterSize () {

  }

  tableLocation () {
    return {top: 500, left: 500};
  }
  tableSize () {}
  
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
          size={this.spriteSize(monsterSprite, 1)}
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
          size={this.spriteSize(symbolTable, 1)}
          rotate={[{rotateY:'180deg'}]}
          onPress={() => this.pressStub()}
          onPressIn={() => this.pressStub()}
          onPressOut={() => this.pressStub()}
        />

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
