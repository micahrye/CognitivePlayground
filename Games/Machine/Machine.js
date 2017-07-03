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
  Dimensions,
  AsyncStorage,
  AppState,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
const Sound = require('react-native-sound');

import _ from 'lodash';
import randomstring from 'random-string';

import LoadScreen from '../../components/LoadScreen';
import HomeButton from '../../components/HomeButton/HomeButton';
import AnimatedSprite from 'react-native-animated-sprite';
import AnimatedSpriteMatrix from 'rn-animated-sprite-matrix';
import gameUtil from './gameUtil';

import buttonSprite from '../../sprites/buttonLeft/buttonLeftSprite';
import birdSprite from '../../sprites/bird2';
import foodSprite from "../../sprites/apple/appleCharacter";
import machineSprite from '../../sprites/foodMachine2';
import beltSprite from '../../sprites/conveyorBelt/beltCharacter';

import litSprites from '../../sprites/litSprites';

const GAME_TIME_OUT = 60000;
const baseHeight = 800;
const baseWidth = 1280;
const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const TWEEN_DURATION = 1500;

export default class Machine extends Component {
  constructor (props) {
    super(props);
    this.state = {
      devMode: false,
      cells: [],
      trialNumber: -1,
      showFood: 1,
      birdAnimationIndex: [0],
      showMatrix: false,
      beltFrameIndex: [0],
      loadingScreen: true,
    };
    this.foodSprite = {
      tweenOptions: {},
      coords: {top: 0, left: 0},
    };
    this.scale = this.props.scale;
    this.machineScale = 2;
    this.cellSpriteScale = 0.66 * this.scale.image;
    this.numColumns = 2;
    this.numRows = 2;
    this.popPlaying = false;
    this.leverPlaying = false;
    this.celebratePlaying = false;
    this.characterAudioPlaying = false;
    this.disgustPlaying = false;
    this.allowCellSelection = false;
    this.showFood = 0;
  }
  
  componentWillMount () {
    AsyncStorage.getItem('@User:pref', (err, result) => {
      console.log(`GETTING = ${JSON.stringify(result)}`);
      const prefs = JSON.parse(result);
      if (prefs) {
        this.setState({ devMode: prefs.developMode });
      }
    });
    
    this.foodSprite.coords = this.foodStartLocation();
    const birdLoc = this.birdLocation();
    const birdSize = birdSprite.size(2 * this.scale.image);
    const mloc = this.machineLocation();
    const msize = this.machineSize(); // machineSprite.size();
    this.foodSprite.UID = randomstring({length: 7});
    this.foodSprite.tweenOptions = {
      tweenType: 'sine-wave',
      startXY: [this.foodSprite.coords.left, this.foodSprite.coords.top],
      xTo: [mloc.left - 20, birdLoc.left + birdSize.width * 0.45],
      yTo: [mloc.top + msize.height * 0.3, birdLoc.top + birdSize.height * 0.33],
      duration: TWEEN_DURATION,
      loop: false,
    };
    
  }
  
  componentDidMount () {
    this.startInactivityMonitor();
    this.initSounds();
    AppState.addEventListener('change', this._handleAppStateChange);
    
    this.setState({
      beltFrameIndex: beltSprite.animationIndex('ALL'),
      birdAnimationIndex: birdSprite.animationIndex('ALL'),
    }, () => {
      this.refs.bird.startAnimation();
      this.setTimeout(() => {
        this.setState({
          beltFrameIndex: beltSprite.animationIndex('IDLE'),
          birdAnimationIndex: birdSprite.animationIndex('IDLE'),
        }, () => {
          this.refs.bird.startAnimation();
        })
      }, 1000);
    });
    
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
    this.disgustSound = new Sound('disgust.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.disgustSound.setNumberOfLoops(0);
      this.disgustSound.setVolume(0.9);
    });
  }

  releaseAudio () {
    this.popSound.stop();
    this.popSound.release();
    this.leverSound.stop();
    this.leverSound.release();
    this.celebrateSound.stop();
    this.celebrateSound.release();
    this.disgustSound.stop();
    this.disgustSound.release();
  }
  
  _handleAppStateChange = (appState) => {
    // release all sound objects
    if (appState === 'inactive' || appState === 'background') {
      this.releaseAudio();
      AppState.removeEventListener('change', this._handleAppStateChange);
    }
  }
  
  componentWillUnmount () {
    this.releaseAudio();
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
    const size = birdSprite.size(2 * this.scale.image);
    const top = SCREEN_HEIGHT - size.height - 60 * this.scale.screenHeight;
    const left = 80 * this.scale.screenWidth; 
    return {top, left};
  }
  
  machineSize () {
    return machineSprite.size(this.machineScale * this.scale.image);
  }
  
  machineLocation () {
    const size = this.machineSize(); //machineSprite.size(1.75 * this.scale.image);
    const top = SCREEN_HEIGHT - size.height - 80 * this.scale.screenHeight;
    const left = SCREEN_WIDTH - size.width  - 220 * this.scale.screenWidth; 
    return {top, left};
  }
  
  conveyorBeltSize () {
    const scaleBelt = 1;
    return ({
      width: beltSprite.size.width * scaleBelt * this.scale.image,
      height: beltSprite.size.height * scaleBelt * this.scale.image,
    });
  }

  conveyorBeltLocation () {
    const locationMachine = this.machineLocation();
    const machineSize = this.machineSize();
    const leftOffset = 283 * this.scale.screenWidth;
    const left = locationMachine.left ;
    const top = SCREEN_HEIGHT - (machineSize.height * 0.6);
    return {top, left};
  }
  
  foodSize () {
    // scale to 120 x 120 or closest.
    const scale = 1;
    return ({
        width: foodSprite.size.width * scale * this.scale.image,
        height: foodSprite.size.height * scale * this.scale.image,
      }
    );
  }
  
  foodStartLocation () {
    const msize = this.machineSize(); // machineSprite.size(1.75 * this.scale.image);
    const mloc = this.machineLocation();
    const foodSize = this.foodSize();
    const coords = {
      top: mloc.top + msize.height * 0.3,
      left: mloc.left + msize.width/2,
    };
    return coords;
  }
  
  matrixLocation () {
    const mloc = this.machineLocation();
    const msize = this.machineSize(); // machineSprite.size(2 * this.scale.image);
    const size = litSprites.size(this.cellSpriteScale);
    const width = this.numColumns * size.width;
    const height = this.numRows * size.height;
    const top = mloc.top + msize.height * .295;
    const left = mloc.left + msize.width * .385;
    const location = {top, left};
    debugger;
    console.log(`matrixLocation = ${JSON.stringify(location)}`);
    return location;
  }
  
  matrixSize () {
    const size = litSprites.size(this.cellSpriteScale);
    const defaultMargin = 10;
    const width = this.numColumns * size.width + (this.numColumns - 1) * defaultMargin ;
    const height = this.numRows * size.height + (this.numRows - 1) * defaultMargin;
    return {width, height};
  }
  
  buttonSize () {
    const scaleLever = 1.0;
    return ({
      width: buttonSprite.size().width * scaleLever * this.scale.image,
      height: buttonSprite.size().height * scaleLever * this.scale.image,
    });
  }

  buttonLocation () {
    const locationMachine = this.machineLocation();
    const machineSize = this.machineSize(); // machineSprite.size(2 * this.scale.image);
    const leftOffset = (15 * this.scale.screenWidth);
    const left = SCREEN_WIDTH - this.buttonSize().width;
    const top = SCREEN_HEIGHT - machineSize.height + 120 * this.scale.image;

    return {top, left};
  }
  
  buttonPressIn () { 
    const trial = this.state.trialNumber + 1;
    this.birdTalk(trial);
    this.foodSprite.UID = randomstring({length: 7});
  
    if (!this.popPlaying) {
      this.popPlaying = true;
      this.popSound.play(() => {this.popPlaying = false;});
    } 
    this.setState({
      trialNumber: trial,
      showFood: 1,
    }, () => {
      this.setState({
        cells: gameUtil.cellsForTrial(this.state.trialNumber),
        showMatrix: true,
      });
    });
  }
  
  cellPressed (cellObj, position) {
    if (!this.allowCellSelection) {
      return; 
    }
    const correctSelection = gameUtil.correctForTrial(this.state.trialNumber);

    console.log(`cell in postion ${position} pressed`);
    if (correctSelection === position) {
      this.setState({
        showFood: 1,
        beltFrameIndex: beltSprite.animationIndex('RUN'),
      }, () => {
        this.refs.foodRef.startTween(); 
        this.birdCelebrate();
      });    
    } else {
      this.birdDisapointed();
    }
  }
  
  playAudioFile (file) {
    if (this.characterAudioPlaying) {
      return;
    }
    const audio = new Sound(file, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      this.leverSound.setNumberOfLoops(0);
      this.leverSound.setVolume(1);
      this.characterAudioPlaying = true;
      audio.play(() => {
        this.characterAudioPlaying = false;
        this.celebratePlaying = false;
        audio.stop();
        audio.release();
      });
    });
    this.setTimeout(() => {this.allowCellSelection = true;});
  }
  
  birdTalk (trial) {
    const audioFileName = gameUtil.audioFileName(trial);
    this.playAudioFile(audioFileName);
    this.setState({
      birdAnimationIndex: birdSprite.animationIndex('EAT'),
    }, () => {
      this.refs.bird.startAnimation();
    });
  }
  
  birdEat () {
    this.setTimeout(() => {
      if (!this.celebratePlaying) {
        this.celebratePlaying = true;
        this.celebrateSound.play(() => {this.celebratePlaying = false;});
      }
    }, TWEEN_DURATION - 310);
    
    this.setTimeout(() => {
      this.setState({
        birdAnimationIndex: birdSprite.animationIndex('EAT'),
        beltFrameIndex: beltSprite.animationIndex('IDLE'),
      }, () => {
        this.refs.bird.startAnimation();
        this.allowCellSelection = false;
      });
    }, TWEEN_DURATION - 200);
  }
  
  birdCelebrate () {
    this.setState({
      birdAnimationIndex: birdSprite.animationIndex('CELEBRATE')
    }, () => {
      this.refs.bird.startAnimation();
      this.birdEat(); 
    });
  }
  
  birdDisapointed () {
    this.allowCellSelection = false;
    this.setState({
      birdAnimationIndex: birdSprite.animationIndex('DISGUST')
    }, () => {
      this.refs.bird.startAnimation();
      if (!this.disgustPlaying) {
        this.disgustPlaying = true;
        this.disgustSound.play(() => {this.disgustPlaying = false;});
      }
    });
  }
  
  
  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  onFoodTweenFinish () {
    this.foodSprite.UID = randomstring({length: 7});
    this.setState({
      showFood: 0,
    });
  }
  
  onLoadScreenFinish () {
    this.setState({loadingScreen: false});
  }
  
  render() {

    return (
      <View>
        <Image
          source={require('../../media/backgrounds/Game_6_Background_1280.png')}
          style={{
            position: 'absolute',
            flex: 1,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
          }}
        />
          
        <AnimatedSprite
          sprite={foodSprite}
          ref={'foodRef'}
          key={this.foodSprite.UID}
          opacity={this.state.showFood}
          animationFrameIndex={[0]}
          tweenOptions = {this.foodSprite.tweenOptions}
          tweenStart={'fromMethod'}
          loopAnimation={false}
          coordinates={this.foodSprite.coords}
          size={this.foodSize()}
          onTweenFinish={(characterUID) => this.onFoodTweenFinish(characterUID)}
        />
        
        <AnimatedSprite
          ref={'bird'}
          sprite={birdSprite}
          animationFrameIndex={this.state.birdAnimationIndex}
          loopAnimation={false}
          coordinates={this.birdLocation()}
          size={birdSprite.size(2 * this.scale.image)}
          draggable={false}
        />
      
        <AnimatedSprite
          ref={'beltRef'}
          sprite={beltSprite}
          animationFrameIndex={this.state.beltFrameIndex}
          loopAnimation={true}
          coordinates={this.conveyorBeltLocation()}
          size={this.conveyorBeltSize()}
        />
      
        <AnimatedSprite
          ref={'machine'}
          sprite={machineSprite}
          animationFrameIndex={[0]}
          loopAnimation={false}
          coordinates={this.machineLocation()}
          size={this.machineSize()}
          draggable={false}
        />
      
        <AnimatedSprite
          sprite={buttonSprite}
          animationFrameIndex={[0]}
          loopAnimation={false}
          coordinates={this.buttonLocation()}
          size={this.buttonSize()}
          rotate={[{rotateY:'0deg'}]}
          onPressIn={() => this.buttonPressIn()}
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
        
        {this.state.showMatrix ?
          <AnimatedSpriteMatrix
            styles={{
                ...(this.matrixLocation()),
                ...(this.matrixSize()),
                position: 'absolute',
              }}
            dimensions={{columns: this.numColumns, rows: this.numRows}}
            cellSpriteScale={this.cellSpriteScale}
            cellObjs={this.state.cells}
            cellRightMargin={34 * this.scale.image}
            cellBottomMargin={28 * this.scale.image}
            onPress={(cellObj, position) => this.cellPressed(cellObj, position)}
          />    
        : null}
        
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

reactMixin.onClass(Machine, TimerMixin);
AppRegistry.registerComponent('Machine', () => App);
