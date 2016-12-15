import React from 'react';
import {
  View,
} from 'react-native';

import _ from 'lodash';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from '../../components/AnimatedSprite/AnimatedSprite';
import hookedCardSprite from '../../sprites/hookCard/hookCardCharacter';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

class Signs extends React.Component {
  constructor (props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount () {}
  componentDidMount () {}

  spriteSize (sprite, scale) {
    const scaleBy = scale * this.props.scale.image;
    return _.mapValues(sprite.size, (val) => val * scaleBy);
  }

  cardStartLocation (position, scale) {
    const top = 0; // -350 * scale.screenHeight;
    const baseLeft = 0;
    switch (position) {
      case 1:
        return {top, left: baseLeft * scale.screenWidth};
      case 2:
        return {top, left: (baseLeft + 200) * scale.screenWidth};
      case 3:
        return {top, left: (baseLeft + 400) * scale.screenWidth};
      case 4:
        return {top: 200, left: (baseLeft + 200) * scale.screenWidth};
      case 5:
        return {top: 200, left: baseLeft * scale.screenWidth};
      case 7:
        return {top: 400, left: baseLeft * scale.screenWidth};
      default:
        console.error('cardStartLocation: invalid card number.');
    }
  }

  pressStub () {
    console.log('card');
  }

  render () {
    return (
      <View>
        <AnimatedSprite
          character={hookedCardSprite}
          ref={'card1'}
          animationFrameIndex={[0]}
          coordinates={this.cardStartLocation(1, this.props.scale)}
          size={this.spriteSize(hookedCardSprite, 1.5)}
          draggable={false}
          onPress={() => this.pressStub()}
        />
        <AnimatedSprite
          character={hookedCardSprite}
          ref={'card2'}
          animationFrameIndex={[0]}
          coordinates={this.cardStartLocation(2, this.props.scale)}
          size={this.spriteSize(hookedCardSprite, 1.5)}
          draggable={false}
          onPress={() => this.pressStub()}
        />
        <AnimatedSprite
          character={hookedCardSprite}
          ref={'card3'}
          animationFrameIndex={[0]}
          coordinates={this.cardStartLocation(3, this.props.scale)}
          size={this.spriteSize(hookedCardSprite, 1.5)}
          draggable={false}
          onPress={() => this.pressStub()}
        />
        <AnimatedSprite
          character={hookedCardSprite}
          ref={'card4'}
          animationFrameIndex={[0]}
          coordinates={this.cardStartLocation(4, this.props.scale)}
          size={this.spriteSize(hookedCardSprite, 1.5)}
          draggable={false}
          onPress={() => this.pressStub()}
        />
        <AnimatedSprite
          character={hookedCardSprite}
          ref={'card5'}
          animationFrameIndex={[0]}
          coordinates={this.cardStartLocation(5, this.props.scale)}
          size={this.spriteSize(hookedCardSprite, 1.5)}
          draggable={false}
          onPress={() => this.pressStub()}
        />
        <AnimatedSprite
          character={hookedCardSprite}
          ref={'card7'}
          animationFrameIndex={[0]}
          coordinates={this.cardStartLocation(7, this.props.scale)}
          size={this.spriteSize(hookedCardSprite, 1.5)}
          draggable={false}
          onPress={() => this.pressStub()}
        />
      </View>
    );
  }

}

Signs.propTypes = {
  scale: React.PropTypes.object.isRequired,
};

reactMixin.onClass(Signs, TimerMixin);

export default Signs;
