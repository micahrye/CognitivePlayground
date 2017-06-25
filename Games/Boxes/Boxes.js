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

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import _ from 'lodash';

import randomstring from 'random-string';
import HomeButton from '../../components/HomeButton/HomeButton';

import AnimatedSprite from 'react-native-animated-sprite';
import birdSprite from '../../sprites/bird2';
import boxSprite from '../../sprites/box';
import clawSprite from '../../sprites/claw';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
import gameUtil from './gameUtil';
gameUtil.setScreenSize(SCREEN_WIDTH, SCREEN_HEIGHT);

export default class Boxes extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeBoxes: [1, 1, 1, 1],
      clawTweenOptions: {},
      clawIndex: [0],
      clawDown: false,
      tweenClaw: true,
      boxID: -1,
    };
    this.scale = this.props.scale;
    this.birdScale = 2.0;
    this.boxScale = 1.25;
    this.clawScale = 1;
    this.clawTweenTime = 1000;
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
  
  setClawTweenDown (boxID) {
    const clawLoc = gameUtil.getClawLocation(clawSprite, this.clawScale, this.scale);
    // const clawLoc = this.clawLocation();
    const boxLoc = this.boxLocation(boxID);
    console.log(`boxLoc = ${JSON.stringify(boxLoc)} for boxid = ${boxID}`);
    const clawTweenOptions = {
      tweenType: "linear-move",
      startXY: [clawLoc.left, clawLoc.top],
      endXY: [boxLoc.left + 31, - 9 * this.scale.screenHeight],
      duration: 1000,
      loop: false,
    };
    return clawTweenOptions;
  }
  
  setClawTweenUp () {
    const clawLoc = gameUtil.getClawLocation(clawSprite, this.clawScale, this.scale);
    
    // Using state here, want to make sure state does not change 
    // TODO: make sure to address box touch events during tween sequence.
    const boxLoc = this.boxLocation(this.state.boxID);
    
    const clawTweenOptions = {
      tweenType: "linear-move",
      startXY: [boxLoc.left + 31, - 9 * this.scale.screenHeight],
      endXY: [clawLoc.left, clawLoc.top],
      duration: 1000,
      loop: false,
    };
    return clawTweenOptions;
  }
  
  boxPressed (boxID) {
    console.log(`\nBOX ${boxID} pressed`);
    
    const clawTweenOptions = this.setClawTweenDown(boxID);
    debugger;
    this.setState(
      { 
        boxID,
        tweenClaw: true,
        clawTweenOptions,
        clawIndex: clawSprite.animationIndex('GRAB'),
      }, 
    () => {
      this.refs.claw.startAnimation();
      this.refs.claw.tweenSprite();
    });
  }
  
  hideInactiveBoxes(activeBoxes) {
    return new Promise((resolve) => {
      this.setTimeout(() => {
        this.setState({activeBoxes});
        this.refs.claw.tweenSprite();
        resolve();  
      }, 200);
    }); 
  }
  
  openBoxAfterClawReturnTween () {
    return new Promise((resolve) => {
      this.setTimeout(() => {
        this.setState({
          clawIndex: clawSprite.animationIndex('BOX_OPENED'),
        }, () => {
          this.setTimeout(() => {
            this.refs.claw.startAnimation();
            // MRE: could add method call to check correct not correct here.
            this.setTimeout(() => resolve(), 1000); 
          }, 300);            
        });
      }, this.clawTweenTime);
    });
  }
  
  currentShowStateforBoxes () {
    const boxes = _.map(this.state.activeBoxes, (val, index) => {
      if (this.state.boxID === index) {
        return 0;
      }
      return 1
    });
    return boxes
  }
  
  pickupPressedBox () {
    const boxes = this.currentShowStateforBoxes();
    this.setState({ 
      clawIndex: clawSprite.animationIndex('BOX_CLOSED'),
      tweenClaw: true,    
    }, () => {
      this.refs.claw.startAnimation();
      this.setState({  
        clawTweenOptions: this.setClawTweenUp(),
        tweenClaw: false,
      }, () => {
        this.hideInactiveBoxes(boxes)
        .then(() => {
          this.openBoxAfterClawReturnTween()
          .then(() => this.returnBox());
        });
      });
    });
  }
  
  showAllBoxes () {
    return new Promise((resolve) => {
      const boxes = _.map(this.state.activeBoxes, () => 1);
      this.setState({
        activeBoxes: boxes,
      }, () => {
        resolve();
      });
    });
    
  }
  
  returnBox (boxID) {
    console.log("NOW GO BACK");
    const clawTweenOptions = this.setClawTweenDown(this.state.boxID);
    this.setState({ clawTweenOptions }, 
    () => {
      this.refs.claw.tweenSprite();
      // show all boxes then lift claw. 
      this.setTimeout(() => {
        this.showAllBoxes()
        .then(() => {
          const clawTweenUp = this.setClawTweenUp();
          this.setState({
            clawIndex: clawSprite.animationIndex('RETURN_TO_NETURAL'),
            clawTweenOptions: clawTweenUp,
          }, () => {
            this.refs.claw.startAnimation();
            this.sleep(100)
            .then(() => this.refs.claw.tweenSprite());
          });
          
        })
      }, this.clawTweenTime);
    });
  }
  
  clawTweenFinish () {
    if (!this.state.tweenClaw) return;
    this.pickupPressedBox(); 
  }
  
  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
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
        coordinates={gameUtil.getClawLocation(clawSprite, this.clawScale, this.scale)}
        size={clawSprite.size(this.clawScale * this.scale.image)}
        tweenOptions={this.state.clawTweenOptions}
        tweenStart={'fromMethod'}
        onTweenFinish={() => this.clawTweenFinish()}
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


reactMixin.onClass(Boxes, TimerMixin);
AppRegistry.registerComponent('Boxes', () => App);
