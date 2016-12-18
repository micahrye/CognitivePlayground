import React from 'react';
import {
  View,
} from 'react-native';

import _ from 'lodash';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from '../../components/AnimatedSprite/AnimatedSprite';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

class Matrix extends React.Component {
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

  cardStartLocation (position, sprite, scale) {
    const baseTop = 0;
    const baseLeft = 0;
    const size = this.spriteSize(sprite, scale);
    const top = baseTop + Math.floor(position/3) * size.height;
    const left = baseLeft + position%3 * size.width;
    return {top, left};
  }

  pressStub (cardId) {
    console.log(`card = ${cardId}`);
  }

  render () {
    const cards = _.map(this.props.activeCards, (active, index) => {
      if (!active) return null;
      return (
        <AnimatedSprite
          character={this.props.cardSprite}
          ref={`card${index}`}
          key={index}
          animationFrameIndex={[0]}
          coordinates={this.cardStartLocation(index, this.props.cardSprite, 1.5)}
          size={this.spriteSize(this.props.cardSprite, 1.5)}
          draggable={false}
          onPress={() => this.pressStub(index)}
        />
      );
    });
    return (
      <View>
        {cards}
      </View>
    );
  }

}

Matrix.propTypes = {
  scale: React.PropTypes.object.isRequired,
  activeCards: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired,
  cardSprite: React.PropTypes.shape({
    name: React.PropTypes.string,
    size: React.PropTypes.object,
    animationTypes: React.PropTypes.array,
    all: React.PropTypes.array,
    animationIndex: React.PropTypes.func,
  }).isRequired,
};

reactMixin.onClass(Matrix, TimerMixin);

export default Matrix;
