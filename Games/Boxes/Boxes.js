/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
} from 'react-native';

import HomeButton from '../../components/HomeButton/HomeButton';

import AnimatedSprite from 'react-native-animated-sprite';
import birdSprite from '../../sprites/bird2';
import boxSprite from '../../sprites/box';
import clawSprite from '../../sprites/claw';


const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

export default class Boxes extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeBoxes: [1, 1, 1, 1],
      clawTweenOptions: {},
      clawIndex: [0],
    };
    this.scale = this.props.scale;
    this.birdScale = 2.0;
    this.boxScale = 1.25;
    this.clawScale = 1;
  }
  
  componentWillMount () {
    AsyncStorage.getItem('@User:pref', (err, result) => {
      console.log(`GETTING = ${JSON.stringify(result)}`);
      const prefs = JSON.parse(result);
      if (prefs) {
        this.setState({ devMode: prefs.developMode });
      }
    });
  }
  
  birdLocation () {
    const size = birdSprite.size(this.birdScale * this.scale.image);
    const top = SCREEN_HEIGHT - size.height - 40 * this.scale.screenHeight;
    const left = 20 * this.scale.screenWidth; 
    return {top, left};
  }
  
  boxLocation (boxId) {
    const bsize = birdSprite.size(this.birdScale * this.scale.image);
    const size = boxSprite.size(this.boxScale * this.scale.image);
    const top = SCREEN_HEIGHT - (size.height/2) - 80 * this.scale.screenHeight;
    const leftEdge = (bsize.width * 1.05 * this.scale.screenWidth);
    const left = leftEdge + boxId * size.width * .8; 
    return {top, left};
  }
  
  clawLocation () {
    const size = clawSprite.size(this.clawScale * this.scale.image);
    const top = 0 - size.height/2;
    const left = SCREEN_WIDTH/2; 
    return {top, left};
  }
  
  setClawTween (boxId) {
    const clawLoc = this.clawLocation();
    const boxLoc = this.boxLocation(boxId);
    
    const clawTweenOptions = {
      tweenType: "linear-move",
      startXY: [clawLoc.left, clawLoc.top],
      endXY: [boxLoc.left, 0],
      duration: 1000,
      loop: false,
    };
    return clawTweenOptions;
  }
  
  boxPressed (boxId) {
    console.log(`\nBOX ${boxId} pressed`);
    
    const clawTweenOptions = this.setClawTween(boxId);
    debugger;
    this.setState(
      { 
        clawTweenOptions,
        clawIndex: clawSprite.animationIndex('GRAB'),
      }, 
    () => {
      this.refs.claw.startAnimation();
      this.refs.claw.tweenSprite();
    });
  }
  
  render() {
    
    return (
      <View>
      <Image
        source={require('../../media/backgrounds/Game_2_Background_1280.png')}
        style={{
          position: 'absolute',
          flex: 1,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
        }}
      />
      <AnimatedSprite
        ref={'bird'}
        sprite={birdSprite}
        animationFrameIndex={[0]}
        loopAnimation={false}
        coordinates={this.birdLocation()}
        size={birdSprite.size(this.birdScale * this.scale.image)}
        draggable={true}
      />
    
      {this.state.activeBoxes[0] ? 
        <AnimatedSprite
          ref={'box0'}
          sprite={boxSprite}
          animationFrameIndex={[0]}
          loopAnimation={false}
          coordinates={this.boxLocation(0)}
          size={boxSprite.size(this.boxScale * this.scale.image)}
          onPress={()=> this.boxPressed(0)}
        />
      : null}
      
      {this.state.activeBoxes[1] ? 
        <AnimatedSprite
          ref={'box1'}
          sprite={boxSprite}
          animationFrameIndex={[0]}
          loopAnimation={false}
          coordinates={this.boxLocation(1)}
          size={boxSprite.size(this.boxScale * this.scale.image)}
          onPress={()=> this.boxPressed(1)}
        />
      : null}
      
      {this.state.activeBoxes[2] ? 
        <AnimatedSprite
          ref={'box2'}
          sprite={boxSprite}
          animationFrameIndex={[0]}
          loopAnimation={false}
          coordinates={this.boxLocation(2)}
          size={boxSprite.size(this.boxScale * this.scale.image)}
          onPress={()=> this.boxPressed(2)}
        />
      : null}
      
      {this.state.activeBoxes[3] ? 
        <AnimatedSprite
          ref={'box3'}
          sprite={boxSprite}
          animationFrameIndex={[0]}
          loopAnimation={false}
          coordinates={this.boxLocation(3)}
          size={boxSprite.size(this.boxScale * this.scale.image)}
          onPress={()=> this.boxPressed(3)}
        />
      : null}
      
      <AnimatedSprite
        ref={'claw'}
        sprite={clawSprite}
        animationFrameIndex={this.state.clawIndex}
        loopAnimation={false}
        coordinates={this.clawLocation()}
        size={clawSprite.size(this.clawScale * this.scale.image)}
        tweenOptions={this.state.clawTweenOptions}
        tweenStart={'fromMethod'}
      />      
      
      
      {this.state.devMode ?
        <HomeButton
          route={this.props.route}
          navigator={this.props.navigator}
          routeId={{ id: 'Main' }}
          styles={{
            width: 150 * this.scale.image,
            height: 150 * this.scale.image,
            top:0, left: 0, position: 'absolute' }}
        />
      : null}
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    position: 'absolute',
    width: 120,
    height: 30,
    top: 20,
    left: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  fontStyle: {
    fontSize: 42,
  },
});


AppRegistry.registerComponent('Boxes', () => App);
