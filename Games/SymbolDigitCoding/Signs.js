/*
Copyright (c) 2017 Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT. 
*/
import React from 'react';
import {
  View,
} from 'react-native';

import _ from 'lodash';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import AnimatedSprite from '../../components/AnimatedSprite/AnimatedSprite';
import foodSignsCharacter from '../../sprites/foodSigns/foodSignsCharacter';

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
      case 0:
        return {top, left: baseLeft * scale.screenWidth};
      case 1:
        return {top, left: (baseLeft + 200) * scale.screenWidth};
      case 2:
        return {top, left: (baseLeft + 400) * scale.screenWidth};
      case 3:
        return {top, left: (baseLeft + 600) * scale.screenWidth};
    }
  }

  signOnPress (signInfo) {
    this.props.onPress(signInfo);
  }

  render () {
    return (
      <View>
        {this.props.symbolOrder[0] ?
          <AnimatedSprite
            character={foodSignsCharacter}
            ref={'sign1'}
            animationFrameIndex={foodSignsCharacter.animationIndex(this.props.symbolOrder[0])}
            coordinates={this.signStartLocation(0, this.props.scale)}
            size={this.spriteSize(foodSignsCharacter, 1)}
            draggable={false}
            onPress={() => this.signOnPress({signNumber: 0, symbol: this.props.symbolOrder[0]})}
          />
        : null}
        {this.props.symbolOrder[1] ?
          <AnimatedSprite
            character={foodSignsCharacter}
            ref={'sign2'}
            animationFrameIndex={foodSignsCharacter.animationIndex(this.props.symbolOrder[1])}
            coordinates={this.signStartLocation(1, this.props.scale)}
            size={this.spriteSize(foodSignsCharacter, 1)}
            draggable={false}
            onPress={() => this.signOnPress({signNumber: 1, symbol: this.props.symbolOrder[1]})}
          />
        : null}
        {this.props.symbolOrder[2] ?
          <AnimatedSprite
            character={foodSignsCharacter}
            ref={'sign3'}
            animationFrameIndex={foodSignsCharacter.animationIndex(this.props.symbolOrder[2])}
            coordinates={this.signStartLocation(2, this.props.scale)}
            size={this.spriteSize(foodSignsCharacter, 1)}
            draggable={false}
            onPress={() => this.signOnPress({signNumber: 2, symbol: this.props.symbolOrder[2]})}
          />
        : null}
        {this.props.symbolOrder[3] ?
          <AnimatedSprite
            character={foodSignsCharacter}
            ref={'sign4'}
            animationFrameIndex={foodSignsCharacter.animationIndex(this.props.symbolOrder[3])}
            coordinates={this.signStartLocation(3, this.props.scale)}
            size={this.spriteSize(foodSignsCharacter, 1)}
            draggable={false}
            onPress={() => this.signOnPress({signNumber: 3, symbol: this.props.symbolOrder[3]})}
          />
        : null}

      </View>
    );
  }

}

Signs.propTypes = {
  symbolOrder: React.PropTypes.array.isRequired,
  scale: React.PropTypes.object.isRequired,
};

reactMixin.onClass(Signs, TimerMixin);

export default Signs;
