/*
Copyright (c) 2017 Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT. 
*/
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
    } else if (route.id === 'UnlockFoodGame') {
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
