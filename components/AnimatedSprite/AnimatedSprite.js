"use strict";

import React from 'react';
import {
  Animated,
  PanResponder,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
//import shallowCompare from "react-addons-shallow-compare";
import randomstring from 'random-string';

import Tweens from "../../Tweens/Tweens";

class AnimatedSprite extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      top: new Animated.Value(props.coordinates.top),
      left: new Animated.Value(props.coordinates.left),
      scale: new Animated.Value(props.scale),
      width: props.size.width,
      height: props.size.height,
      rotate: props.rotate,
      frameIndex: this.props.animationFrameIndex,
    };

    this.character = this.props.character;
    // used for panResponder
    this.characterStyles =  {};
    this.panResponder = {};
    this.charactertyles =  {};
    this.animationKey = 'all';
    this.numFrames = this.character[this.animationKey].length-1;
    this.frameIndex = 0;
    this.defaultAnimationInterval = undefined;
    this.animationKeyInterval = undefined;
    this.imageSource = undefined;
    this.fps = 8;
    this.endValues = undefined;
  }

  componentWillMount () {
    if (this.props.draggable) {
      // note that with PanResponder we setNativeProps for performance reasons,
      // as stated by FB.
      this.panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant:(e, gestureState) => {
          this.handlePanResponderGrant(e, gestureState);},
        onPanResponderMove: (e, gestureState) => {
          this.handlePanResponderMove(e, gestureState);},
        onPanResponderRelease: (e, gestureState) => {
          this.handlePanResponderEnd(e, gestureState);},
        onPanResponderTerminate:
          (e, gestureState) => {
          this.handlePanResponderEnd(e, gestureState);},
        });
    }
    // used by PanResponder
    this.previousTop = this.state.top._value;
    this.previousLeft =  this.state.left._value;
    this.characterStyles = {
      style: {
        left: this._previousLeft,
        top: this._previousTop,
        width: this.state._width,
        height: this.state._height,
      },
    };
    // used by Tweens
    this.tweenablValues = {
      top: this.state.top,
      left: this.state.left,
      scale: this.state.scale,
      // rotateZ: this.state.rotateZ,
      // rotation: this.state.rotation,
    };
  }

  componentDidMount () {
    this.startAnimation();
    // part of PanResponder and drag behavior
    if (this.characterComponentRef) {
      this.characterComponentRef.setNativeProps(this.characterStyles);
    }
    this.renderTime = Date.now();
    if (this.props.tweenStart == "auto" && this.props.tweenOptions != null) {
      this.startTween();
    }
    // TODO: should be validation on fps so that it is a resonable range.
    if (this.props.fps) {
      this.fps = this.props.fps;
    }
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.animationFrameIndex !== nextProps.animationFrameIndex) {
      this.startAnimation();
    }
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   return shallowCompare(this, nextProps, nextState);
  // }

  componentWillUnmount () {
    // console.log('AnimatedSprite unmounting');
    clearInterval(this.defaultAnimationInterval);
    clearInterval(this.animationKeyInterval);
  }

  updateNativeStyles () {
    this.characterComponentRef && this.characterComponentRef.setNativeProps(this.characterStyles);
  }

  handleStartShouldSetPanResponder (/*e, gestureState*/) {
    return true;
  }

  handleMoveShouldSetPanResponder (/*e, gestureState*/) {
    return true;
  }

  handlePanResponderGrant (/*e, gestureState*/) {
    // do something on grant
  }

  handlePanResponderMove (e, gestureState) {
    this.characterStyles.style.left = this.previousLeft + gestureState.dx;
    this.characterStyles.style.top = this.previousTop + gestureState.dy;
    this.updateNativeStyles();
  }

  handlePanResponderEnd (e, gestureState) {
    // do anything you want onPanResponderRelease
    this.previousLeft += gestureState.dx;
    this.previousTop += gestureState.dy;
    // PanResponder mutates state directly
    this.state.top = this.characterStyles.style.top;
    this.state.left = this.characterStyles.style.left;

    if (this.props.currentLocation) {
      this.props.currentLocation(this.characterStyles.style.left, this.characterStyles.style.top);
    }
  }

  startAnimation () {
    if (this.props.fps) {
      this.fps = this.props.fps;
    }
    this.numFrames = this.character[this.animationKey].length-1;
    this.frameIndex = -1;
    clearInterval(this.defaultAnimationInterval);
    this.defaultAnimationInterval = setInterval(()=>{
      this.frameIndex++;
      const animationLength = this.props.animationFrameIndex.length-1;
      if (this.frameIndex > animationLength) {
        this.frameIndex = this.frameIndex - 1;
        if (this.props.loopAnimation) {
            this.frameIndex = 0;
        } else {
          clearInterval(this.defaultAnimationInterval);
          if (this.props.onAnimationFinish) {
             this.props.onAnimationFinish(this.props.characterUID);
          }
          return;
        }
      }
      const index = this.props.animationFrameIndex[this.frameIndex];
      this.setState({ frameIndex: index });
    }, 1000 / this.fps);
  }

  // notify parent that tween has ended
  tweenHasEnded (characterUID) {
    // console.warn(`tweenHasEnded HAPPY GO LUCKY ${characterUID}`);
    if (this.props.onTweenFinish) {
      this.props.onTweenFinish(characterUID);
    }
  }

  startTween () {
    const tweenOptions = this.props.tweenOptions;
    const tweenType = this.props.tweenOptions.tweenType;
    
    Tweens[tweenType].start(tweenOptions,
      this.tweenablValues,
      () => this.tweenHasEnded(this.props.characterUID),
    );
  }

  handlePress (evt) {
    evt.preventDefault();
    if (this.props.onPress) {
      this.props.onPress(this.props.characterUID);
    }
    if (this.props.tweenStart === "touch") {
      this.startTween();
    }

    // if (this.props.onPress) {
    //   this.props.onPress(this.props.spriteKey);
    // }
    //
    //
    // else if (this.props.stopTweenOnTouch) {
    //   this.stopTween = true;
    //   this.configureTween();
    // }
    //
    // if (this.props.soundOnTouch) {
    //   this._Sound['playSound'](this.props.soundFile);
    // }
    //
    // if (this.props.timeSinceMounted) {
    //   this.props.timeSinceMounted(
    //     this.props.spriteKey,
    //     (Date.now() - this.renderTime ) / 1000
    //   );
    // }
    //
    // if (this.props.draggable) {
    //   return;
    // }
  }

  stoppedTween (stopValues) {
    this.props.onTweenStopped(stopValues);
  }

  handlePressIn (evt) {
    console.log('handlePressIn');
    // evt.preventDefault();
    if (this.props.onPressIn) {
      this.props.onPressIn();
    }

    if (this.props.stopAutoTweenOnPressIn) {
      const tweenType = this.props.tweenOptions.tweenType;
      Tweens[tweenType].stop(this.tweenablValues,
        (stopValues) => this.stoppedTween(stopValues));
    }
  }

  handlePressOut (evt) {
    evt.preventDefault();
    if (this.props.onPressOut) {
      this.props.onPressOut();
    }
  }

  getStyle () {

    return (
      // TODO: this.props.style.opacity part of hack to what may be a
      // RN bug associated with premiture stopping of Tween and removing
      // The related component
      {
        top: this.state.top,
        left: this.state.left,
        position: 'absolute',
        opacity: this.props.style ? this.props.style.opacity : 1,
        transform: [{scale: this.state.scale}],
      }
    );
  }

  render () {
    // console.log('AnimatedSprite Render');
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={this.getStyle()}
        ref={(character) => {
          this.characterComponentRef = character;
        }}>
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={(evt) => this.handlePress(evt)}
          onPressIn={(evt) => this.handlePressIn(evt)}
          onPressOut={(evt) => this.handlePressOut(evt)}>
          <Image
            source={this.character[this.animationKey][this.state.frameIndex]}
            style={{
              width: this.state.width,
              height: this.state.height,
              transform: this.state.rotate,
            }}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

// TODO: add in any props that should be required.
AnimatedSprite.propTypes = {
  coordinates: React.PropTypes.object.isRequired,
  size: React.PropTypes.object.isRequired,
  character: React.PropTypes.object.isRequired,
  animationFrameIndex: React.PropTypes.array.isRequired,
  rotate: React.PropTypes.array,
  characterUID: React.PropTypes.string,
  draggable: React.PropTypes.bool,
  onPress: React.PropTypes.func,
  onPressIn: React.PropTypes.func,
  onPressOut: React.PropTypes.func,
  loopAnimation: React.PropTypes.bool,
  timeSinceMounted: React.PropTypes.func,
  currentLocation: React.PropTypes.func,
  tweenStart: React.PropTypes.string,
  // probably should validate tweenOptions, since Tweens.js uses them
  // and expects a certian shape.
  tweenOptions: React.PropTypes.object,
  // note that stopTweenOnPressIn
  stopAutoTweenOnPressIn: React.PropTypes.bool,
  onTweenStopped: React.PropTypes.func,
  onTweenFinish: React.PropTypes.func,
  scale: React.PropTypes.number,
  fps: React.PropTypes.number,
};

AnimatedSprite.defaultProps = {
  draggable: false,
  characterUID: randomstring({ length: 7 }),
  rotate: [{rotateY: '0deg'}],
  scale: 1,
};


export default AnimatedSprite;
