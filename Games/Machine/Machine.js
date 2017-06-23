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
} from 'react-native';

import HomeButton from '../../components/HomeButton/HomeButton';
import AnimatedSprite from 'react-native-animated-sprite';
import birdSprite from '../../sprites/bird2';
import machineSprite from '../../sprites/foodMachine2';

const baseHeight = 800;
const baseWidth = 1280;
const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

export default class Machine extends Component {
  constructor (props) {
    super(props);
    this.state = {
      devMode: false,
    };
    this.scale = this.props.scale;
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
    const size = birdSprite.size(2 * this.scale.image);
    const top = SCREEN_HEIGHT - size.height - 60 * this.scale.screenHeight;
    const left = 80 * this.scale.screenWidth; 
    return {top, left};
  }
  
  machineLocation () {
    const size = machineSprite.size(1.75 * this.scale.image);
    const top = SCREEN_HEIGHT - size.height - 100 * this.scale.screenHeight;
    const left = SCREEN_WIDTH - size.width - 90 * this.scale.screenWidth; 
    return {top, left};
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
          ref={'bird'}
          sprite={birdSprite}
          animationFrameIndex={[0]}
          loopAnimation={false}
          coordinates={this.birdLocation()}
          size={birdSprite.size(2 * this.scale.image)}
          draggable={true}
        />
      
        <AnimatedSprite
          ref={'machine'}
          sprite={machineSprite}
          animationFrameIndex={[0]}
          loopAnimation={false}
          coordinates={this.machineLocation()}
          size={machineSprite.size(2 * this.scale.image)}
          draggable={false}
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


AppRegistry.registerComponent('Machine', () => App);
