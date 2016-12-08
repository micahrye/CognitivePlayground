/**
* Sample React Native App
* https://github.com/facebook/react-native
*/

import React from 'react';
import {
  AppRegistry,
  Navigator,
  Dimensions,
  PixelRatio,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

import Main from "./main";
import BubblesGame from './Games/Bubbles/BubblesGame';
import BugZapGame from './Games/BugZap/BugZapGame';
import MatchByColorGame from './Games/MatchByColor/MatchByColorGame';
import MatrixReasoningGame from './Games/MatrixReasoning/MatrixReasoningGame';
import SymbolDigitCodingGame from './Games/SymbolDigitCoding/SymbolDigitCodingGame';
import UnlockFoodGame from './Games/UnlockFood/UnlockFoodGame';

const baseHeight = 800;
const baseWidth = 1280;
const screenWidth = Dimensions.get('window').width; // * PixelRatio.get();
const screenHeight = Dimensions.get('window').height; // * PixelRatio.get();

class CognitivePlayground extends React.Component {
  constructor (props) {
    super(props);
    const scaleWidth =  screenWidth / baseWidth ;
    const scaleHeight = screenHeight / baseHeight ;
    this.scale = {
      screenWidth: scaleWidth,
      screenHeight: scaleHeight,
      image: scaleHeight > scaleWidth ? scaleWidth : scaleHeight,
    };
  }

  componentDidMount () {

  }

  renderScene (route, navigator) {
    if (route.id === 'Main') {
      return <Main
        navigator={navigator}
        route={route}
        scale={this.scale}
      />;
    } else if (route.id === 'BubblesGame') {
      return (
        <BubblesGame
          navigator={navigator}
          route={route}
          scale={this.scale}
        />);
    } else if (route.id === 'BugZapGame') {
      return (
        <BugZapGame
          navigator={navigator}
          route={route}
          scale={this.scale}
        />);
    } else if (route.id === 'MatchByColorGame') {
      return (
        <MatchByColorGame
          navigator={navigator}
          route={route}
          scale={this.scale}
        />);
    } else if (route.id === 'MatrixReasoningGame') {
      return (
        <MatrixReasoningGame
          navigator={navigator}
          route={route}
          scale={this.scale}
        />);
    } else if (route.id === 'SymbolDigitCodingGame') {
      return (
        <SymbolDigitCodingGame
          navigator={navigator}
          route={route}
          scale={this.scale}
        />);
    }else if (route.id === 'UnlockFoodGame') {
      return (<UnlockFoodGame
        navigator={navigator}
        route={route}
        scale={this.scale}
      />);
    }
  }

  render () {
    return (
      <Navigator
        initialRoute={{name: 'Game Launcher', id: 'Main'}}
          renderScene={(route, navigator) => {
            return this.renderScene(route, navigator);
        }}
      />
    );
  }
}

reactMixin.onClass(CognitivePlayground, TimerMixin);

AppRegistry.registerComponent('CognitivePlayground', () => CognitivePlayground);
