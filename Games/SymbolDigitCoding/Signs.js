import React from 'react';
import {
  View,
} from 'react-native';

import _ from 'lodash';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from '../../components/AnimatedSprite/AnimatedSprite';
import signSprite from '../../sprites/sign/signCharacter';

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

  signStartLocation (position, scale) {
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
        return {top, left: (baseLeft + 600) * scale.screenWidth};
    }
  }

  pressStub () {
    console.log('sign');
  }

  render () {
    return (
      <View>
        <AnimatedSprite
          character={signSprite}
          ref={'sign1'}
          animationFrameIndex={[0]}
          coordinates={this.signStartLocation(1, this.props.scale)}
          size={this.spriteSize(signSprite, 1)}
          draggable={false}
          onPress={() => this.pressStub()}
        />
        <AnimatedSprite
          character={signSprite}
          ref={'sign2'}
          animationFrameIndex={[0]}
          coordinates={this.signStartLocation(2, this.props.scale)}
          size={this.spriteSize(signSprite, 1)}
          draggable={false}
          onPress={() => this.pressStub()}
        />
        <AnimatedSprite
          character={signSprite}
          ref={'sign3'}
          animationFrameIndex={[0]}
          coordinates={this.signStartLocation(3, this.props.scale)}
          size={this.spriteSize(signSprite, 1)}
          draggable={false}
          onPress={() => this.pressStub()}
        />
        <AnimatedSprite
          character={signSprite}
          ref={'sign4'}
          animationFrameIndex={[0]}
          coordinates={this.signStartLocation(4, this.props.scale)}
          size={this.spriteSize(signSprite, 1)}
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
