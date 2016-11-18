import React from 'react';
import AnimatedSprite from '../AnimatedSprite/AnimatedSprite';
//import fountainLever from '../../sprites/fountainLever/fountainLeverCharacter';
//import lever from '../../sprites/lever/leverCharacter';


class Lever extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      character: props.character,
      top: props.coordinates.top,
      left: props.coordinates.left,
      width: props.size.width,
      height: props.size.height,
      rotate: props.rotate,
      characterUID: props.characterUID,
      animationFrameIndex: props.animationFrameIndex,
      onPress: props.onPress,
      onPressIn: props.onPressIn,
      onPressOut: props.onPressOut,
    };
  }
  render () {
    return (
      <AnimatedSprite
        character={this.state.character}
        animationFrameIndex={[0]}
        loopAnimation={false}
        coordinates={{
          top: this.state.top,
          left: this.state.left}}
        characterUID={this.props.characterUID}
        size={{
          width: this.state.width,
          height: this.state.height}}
        rotate={this.state.rotate}
        onPress={this.props.onPress}
        onPressIn={this.props.onPressIn}
        onPressOut={this.props.onPressOut}>
        </AnimatedSprite>
      );
  }
}
Lever.propTypes = {
  character: React.PropTypes.object,
  animationFrameIndex: React.PropTypes.array,
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  coordinates: React.PropTypes.object,
  size: React.PropTypes.object,
  rotate: React.PropTypes.array,
  onPress: React.PropTypes.func,
  onPressIn: React.PropTypes.func,
  onPressOut: React.PropTypes.func,
  characterUID: React.PropTypes.string,
};

export default Lever;
