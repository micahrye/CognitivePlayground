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

  tilePressed (tile, index) {
    this.props.onPressed(tile, index);
  }

  render () {
    const cards = _.map(this.props.tiles, (tile, index) => {
      if (!tile.active) return null;
      return (
        <AnimatedSprite
          character={tile.sprite}
          ref={`card${index}`}
          key={randomstring({ length: 7 })}
          animationFrameIndex={tile.sprite.animationIndex(tile.frameKey)}
          loopAnimation={false}
          coordinates={this.cardStartLocation(index, tile.sprite, this.props.tileScale)}
          size={this.spriteSize(tile.sprite, this.props.tileScale)}
          draggable={false}
          onPress={() => this.tilePressed(tile, index)}
        />
      );
    });
    return (
      <View style={this.props.styles}>
        {cards}
      </View>
    );
  }

}

Matrix.propTypes = {
  scale: React.PropTypes.object.isRequired,
  tiles: React.PropTypes.array,
  styles: React.PropTypes.object,
  tileScale: React.PropTypes.number,
  onPressed: React.PropTypes.func,
};

reactMixin.onClass(Matrix, TimerMixin);

export default Matrix;

// cardSprite: React.PropTypes.shape({
//   name: React.PropTypes.string,
//   size: React.PropTypes.object,
//   animationTypes: React.PropTypes.array,
//   all: React.PropTypes.array,
//   animationIndex: React.PropTypes.func,
// }).isRequired,
