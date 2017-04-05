/*
Copyright (c) 2017 Curious Learning : A Global Literacy Project, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of the Curious Learning : A Global Literacy Project, Inc. shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Curious Learning : A Global Literacy Project, Inc. 
*/
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

// Tile = {
//   sprite: sprites[index],
//   frameKey: frameKeys[index],
//   active,
// }

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

  tilePress (tile, index) {
    console.log('tilePress');
    if (!this.props.onPress) return;
    this.props.onPress(tile, index);
  }

  tilePressIn (tile, index) {
    console.log('tilePressIn');
    if (!this.props.onPressIn) return;
    this.props.onPressIn(tile, index);
  }
  tilePressOut (tile, index) {
    if (!this.props.onPressOut) return;
    this.props.onPressOut(tile, index);
  }

  render () {
    const cards = _.map(this.props.tiles, (tile, index) => {
      if (!tile.active) return null;
      const uid = tile.uid ? tile.uid : randomstring({ length: 7 });
      const tileScale = tile.scale ? tile.scale : this.props.tileScale;
      return (
        <AnimatedSprite
          character={tile.sprite}
          ref={`card${index}`}
          key={uid}
          animationFrameIndex={tile.sprite.animationIndex(tile.frameKey)}
          loopAnimation={false}
          coordinates={this.cardStartLocation(index, tile.sprite, this.props.tileScale)}
          size={this.spriteSize(tile.sprite, tileScale)}
          draggable={false}
          onPress={() => this.tilePress(tile, index)}
          onPressIn={() => this.tilePressIn(tile, index)}
          onPressOut={() => this.tilePressOut(tile, index)}
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
  onPress: React.PropTypes.func,
  onPressIn: React.PropTypes.func,
  onPressOut: React.PropTypes.func,
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
