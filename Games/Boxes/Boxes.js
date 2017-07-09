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
  AppState
} from 'react-native';

import KeepAwake from 'react-native-keep-awake';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import _ from 'lodash';
const Sound = require('react-native-sound');

import randomstring from 'random-string';
import LoadScreen from '../../components/LoadScreen';
import HomeButton from '../../components/HomeButton/HomeButton';

import AnimatedSprite from 'react-native-animated-sprite';
import birdSprite from '../../sprites/bird2';
import boxSprite from '../../sprites/box';
import clawSprite from '../../sprites/claw';
import buttonSprite from '../../sprites/buttonLeft/buttonLeftSprite';

const GAME_TIME_OUT = 60000;
const AUDIO_SEQ_INTERVAL = 500;
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
      respondToClawTweenFinish: true,
      boxID: -1,
      allowBoxPress: false,
      loadingScreen: true,
      trialNumber: 0,
      showThought: false,
      birdAnimationIndex: [0],
    };
    this.allowButtonPress = true;
    this.scale = this.props.scale;
    this.birdScale = 2.0;
    this.boxScale = 1.25;
    this.clawScale = 1;
    this.clawTweenTime = 1000;
    this.willUnmount = false;
    this.popPlaying = false;
    KeepAwake.activate();
  }
  // TODO: should kill all timeouts and intervals on willUnmount
  
  
  componentWillMount () {
    AsyncStorage.getItem('@User:pref', (err, result) => {
      console.log(`GETTING = ${JSON.stringify(result)}`);
      const prefs = JSON.parse(result);
      if (prefs) {
        this.safeSetState({ devMode: prefs.developMode });
      }
    });
  }
  
  componentDidMount () {
    this.startInactivityMonitor();
    this.initSounds();
    AppState.addEventListener('change', this._handleAppStateChange);
    const clawLoc = gameUtil.getClawLocation(clawSprite, this.clawScale, this.scale);
    gameUtil.createMoveSeq(clawLoc);
  }
  
  componentWillUnmount () {
    this.willUnmount = true;
    this.releaseAudio();
  }
  
  initSounds () {
    this.popSound = new Sound('pop_touch.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.popSound.setNumberOfLoops(0);
      this.popSound.setVolume(1);
    });
    this.leverSound = new Sound('lever_switch.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.leverSound.setNumberOfLoops(0);
      this.leverSound.setVolume(1);
    });
    this.celebrateSound = new Sound('celebrate.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.celebrateSound.setNumberOfLoops(0);
      this.celebrateSound.setVolume(1);
    });
  }

  releaseAudio () {
    this.popSound.stop();
    this.popSound.release();
    this.leverSound.stop();
    this.leverSound.release();
    this.celebrateSound.stop();
    this.celebrateSound.release();
    this.audio.stop();
    this.audio.release();
  }
  
  _handleAppStateChange = (appState) => {
    // release all sound objects
    if (appState === 'inactive' || appState === 'background') {
      this.releaseAudio();
      AppState.removeEventListener('change', this._handleAppStateChange);
    }
  }
  
  startInactivityMonitor () {
    if (!this.state.devMode) {
      this.timeoutGameOver = this.setTimeout(() => {
        this.props.navigator.replace({
          id: "Main",
        });
      }, GAME_TIME_OUT);
    }
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
    // const leftEdge = (bsize.width * 1.05 * this.scale.screenWidth);
    const leftEdge = (bsize.width * 1.05);
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
      endXY: [boxLoc.left + 31 * this.scale.image, - 9 * this.scale.screenHeight],
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
      startXY: [boxLoc.left + 31 * this.scale.image, - 9 * this.scale.screenHeight],
      endXY: [clawLoc.left, clawLoc.top],
      duration: 1000,
      loop: false,
    };
    return clawTweenOptions;
  }
  
  boxPressed (boxID) {    
    if (!this.state.allowBoxPress) return;
    
    if (!this.popPlaying) {
      this.popPlaying = true;
      this.popSound.play(() => {this.popPlaying = false;});
    }
    
    const clawTweenOptions = this.setClawTweenDown(boxID);
    debugger;
    this.safeSetState(
      { 
        boxID,
        allowBoxPress: false,
        respondToClawTweenFinish: true,
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
        this.safeSetState({activeBoxes});
        this.refs.claw.tweenSprite();
        resolve();  
      }, 200);
    }); 
  }
  
  openBoxAfterClawReturnTween () {
    return new Promise((resolve, reject) => {
      this.setTimeout(() => {
        this.safeSetState({
          clawIndex: clawSprite.animationIndex('CLAW_WITH_BOX_OPENED'),
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
    this.safeSetState({ 
      clawIndex: clawSprite.animationIndex('CLAW_WITH_BOX_CLOSED'),
      // respondToClawTweenFinish: true,    
    }, () => {
      this.refs.claw.startAnimation();
      this.safeSetState({  
        clawTweenOptions: this.setClawTweenUp(),
        respondToClawTweenFinish: false,
      }, () => {
        this.hideInactiveBoxes(boxes)
        .then(() => {
          this.openBoxAfterClawReturnTween()
          .then(() => this.returnBox());
        })
        .catch((err) => console.log("pickupPressedBox: ", err.stack));
      });
    });
  }
  
  showAllBoxes () {
    return new Promise((resolve) => {
      const boxes = _.map(this.state.activeBoxes, () => 1);
      this.safeSetState({
        activeBoxes: boxes,
      }, () => {
        resolve();
      });
    });
    
  }
  
  startClawReturnUp () {
    return new Promise((resolve) => {
      const clawTweenUp = this.setClawTweenUp();
      this.safeSetState({
        clawIndex: clawSprite.animationIndex('RETURN_TO_NETURAL'),
        clawTweenOptions: clawTweenUp,
      }, () => {
        this.refs.claw.startAnimation();
        this.sleep(100)
        .then(() => {
          this.refs.claw.tweenSprite();
          resolve();
        })
        .catch((err) => console.log("startClawReturnUp: ", err.stack));
      });
    });
  }
  
  safeSetState (stateObj, fn) {
    if (!this.willUnmount) {
      this.setState(stateObj, fn);
    }
  }
  
  returnBox (boxID) {
    console.log("NOW GO BACK");
    const clawTweenOptions = this.setClawTweenDown(this.state.boxID);
    this.safeSetState({ clawTweenOptions }, 
    () => {
      this.refs.claw.tweenSprite();
      // show all boxes then lift claw. 
      this.setTimeout(() => {
        this.showAllBoxes()
        .then(() => {
          this.startClawReturnUp();
          this.sleep(1500)
          .then(() => {
            this.safeSetState({allowBoxPress: false, });
            this.allowButtonPress = true;
          });
        })
        .catch((err) => console.log("returnBox: ", err.stack));
      }, this.clawTweenTime);
    });
  }
  
  birdSpeak (audio) {
    // bird animation to speak
    this.setState({
      birdAnimationIndex: birdSprite.animationIndex('EAT'),
    }, () => {
      this.refs.bird.startAnimation();
      audio.play(() => {
        audio.stop();
        audio.release();
      });
    });
    
  }
  
  indicateCorrectBox () {
    const speakAudio = gameUtil.getSpeakAudioFor(this.trialNumber);
    if (speakAudio) {
      this.setState({
        showThought: false,
      });
      console.log(`BOX: speakAudio = ${speakAudio}`);
      this.audio = new Sound(speakAudio, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.warn('failed to load the sound', error);
          return;
        }
        this.audio.setNumberOfLoops(0);
        this.audio.setVolume(1);
        this.birdSpeak(this.audio);
      });
    } else {
      this.setState({
        showThought: true,
      });
    }
  }
  
  clawMoveSequence (index = 0) {
    const moveSeq = gameUtil.getClawMoveSeq();
    if (index >= moveSeq.length) {
      return;
    }
    const clawTweenOptions = moveSeq[index];
    
    if (index === moveSeq.length-1) {
      console.log('BOX: allow box press');
      this.setState({
        clawTweenOptions,
        allowBoxPress: true
      }, () => {
        this.refs.claw.tweenSprite();
        // claw retuns then have character indicate box to choose
        this.setTimeout(() => {
          this.indicateCorrectBox();
        }, clawTweenOptions.duration);
      });
    } else {
      this.safeSetState(
        { 
          clawTweenOptions,
          allowBoxPress: false,
          respondToClawTweenFinish: false,
          clawIndex: clawSprite.animationIndex('IDLE'),
        }, 
      () => {
        this.refs.claw.startAnimation();
        this.refs.claw.tweenSprite();
      });
    }
    
  }
  
  playAudioSequence (audioFiles, index = 0) {
    if (index === audioFiles.length) {
      console.log(`BOX: calling clawMove with 4`);
      this.clawMoveSequence(4);
    }
    if (index >= audioFiles.length) {
      return;
    }
    console.log(`BOX: index = ${index}`);
    const audioFile = audioFiles[index];
    this.audio = new Sound(audioFile, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.audio.setNumberOfLoops(0);
      this.audio.setVolume(1);
      this.audio.play(() => {
        const newIndex = index + 1;
        this.audio.stop();
        this.audio.release();
        this.setTimeout(() => {
          console.log(`BOX: newIndex = ${newIndex}`);
          this.playAudioSequence(audioFiles, newIndex);
          this.clawMoveSequence(newIndex);
        }, AUDIO_SEQ_INTERVAL);
      });
      
    });
  }
  
  clawTweenFinish () {
    if (!this.state.respondToClawTweenFinish) return;
    this.pickupPressedBox(); 
  }
  
  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  onLoadScreenFinish () {
    this.setState({loadingScreen: false});
  }
  
  buttonSize () {
    const scaleLever = 1.0;
    return ({
      width: buttonSprite.size().width * scaleLever * this.scale.image,
      height: buttonSprite.size().height * scaleLever * this.scale.image,
    });
  }

  buttonLocation () {
    const leftOffset = (15 * this.scale.screenWidth);
    const left = SCREEN_WIDTH - this.buttonSize().width;
    const top = SCREEN_HEIGHT - 520 * this.scale.image;

    return {top, left};
  }
  
  buttonPressIn () {
    if (!this.allowButtonPress) {
      return;
    }
    this.allowButtonPress = false;
    const boxAudioFiles = gameUtil.getBoxAudioFor(this.trialNumber);
    // At the end of the claw move sequence the bird will indicate the box to choose. 
    this.clawMoveSequence();
    this.playAudioSequence(boxAudioFiles);
  }
  
  cloudStyle () {
    const width = 193 * 1.25 * this.props.scale.image;
    const height =  135 * 1.25 * this.props.scale.image;
    const top = this.birdLocation().top - (height * 0.55);
    const left = this.birdLocation().left - (width * 0.0);

    return {
      width,
      height,
      top,
      left,
      position: 'absolute',
    };
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
        animationFrameIndex={this.state.birdAnimationIndex}
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
      
      {this.state.showThought ? 
        <Image source={require('../../sprites/thoughtBubble/thought_bubble.png')}
          style={this.cloudStyle()}
        />
      : null}
      
      <AnimatedSprite
        sprite={buttonSprite}
        animationFrameIndex={[0]}
        loopAnimation={false}
        coordinates={this.buttonLocation()}
        size={this.buttonSize()}
        rotate={[{rotateY:'0deg'}]}
        onPressIn={() => this.buttonPressIn()}
      />
    
      {this.state.loadingScreen ?
        <LoadScreen
          onTweenFinish={() => this.onLoadScreenFinish()}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
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
