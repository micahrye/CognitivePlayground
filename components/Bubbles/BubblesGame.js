import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from "../AnimatedSprite/AnimatedSprite";
import HomeButton from '../HomeButton/HomeButton';
import bubbleCharacter from '../../sprites/bubbles/bubblesCharacter';
import monster from '../../sprites/monster/monsterCharacter';
import lever from '../../sprites/lever/leverCharacter';
import fountain from '../../sprites/fountain/fountainCharacter';
import fountainLever from '../../sprites/fountainLever/fountainLeverCharacter';
import canCharacter from '../../sprites/can/canCharacter';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const SCALE = {
  width: Dimensions.get('window').width / 1280,
  height: Dimensions.get('window').height / 800,
};
// TODO: do we need offset?
const OFFSET = 10;
const GAME_TIME_OUT = 115000;
const MAX_NUMBER_BUBBLES = 15;
const FOUTAIN_LOCATION = {top: 0, left: 0};
const LEVER_LOCATION = {top: 0, left: 0};
const FOUTAIN_SIZE = {width: 0, height: 0};

class BubblesGame extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      spriteAnimationKey: 'all',
      spriteAnimationKeyIndex: 0,
      bubbleArray: [],
      bubbleAnimationIndex: [0],
      monsterAnimationIndex: [0],
      loadContent: false,
      showFood: false,
    };
    this.characterUIDs = {};
    this.animations = ['eat', 'bubble', 'bubbleCan', 'bubbleBug', 'bubbleGrass'];
    this.setDefaultAnimationState;
    this.bubbleFountainInterval;
    this.targetBubble = {active: false, uid: '', name: '', stopTweenOnPress: true};
    this.food = {active: false, uid: '', name: ''};
    this.monster = {tweenOptions: {}};
  	FOUTAIN_LOCATION.top = SCREEN_HEIGHT - (fountain.size.height + OFFSET);
    FOUTAIN_LOCATION.left = (SCREEN_WIDTH/2) - (fountain.size.width/2);
    LEVER_LOCATION.top = FOUTAIN_LOCATION.top + 60;
    LEVER_LOCATION.left = FOUTAIN_LOCATION.left + (fountain.size.width - 40);
    this.scale = this.props.scale;
    FOUTAIN_SIZE = { width: 270 * this.scale.screenWidth, height: 258 * this.scale.screenHeight};
  }

  componentWillMount () {
    this.characterUIDs = {
      bubble: randomstring({ length: 7 }),
      monster: randomstring({ length: 7 }),
      lever: randomstring({ length: 7 }),
      fountain: randomstring({ length: 7 }),
    };
    this.setState({
      bubbleAnimationIndex: [0,1,2,3,4,5,6,7,8,9],
      monsterAnimationIndex: [0,1,2,3,4,5,6,7],
      loadContent: true,
    });
    this.setDefaultAnimationState = setTimeout(() => {
      this.setState({
        bubbleAnimationIndex: [0],
        monsterAnimationIndex: [0],
        loadContent: false,
      }, ()=>{this.characterWalkOn();});
    }, 1500);
  }

  componentDidMount () {
    this.timeoutGameOver = setTimeout(() => { // start trial timeout
      this.props.navigator.replace({
        id: "Main",
      });
    }, GAME_TIME_OUT); // game over when 15 seconds go by without bubble being popped
  }

  componentWillUnmount () {
    clearTimeout(this.setDefaultAnimationState);
    clearTimeout(this.timeoutGameOver);
  }

  makeMoveTween (startXY=[-300, 500], endXY=[600, 400], duration=1500){
    return({
      tweenType: "linear-move",
      startXY: [startXY[0]*this.scale.screenWidth, startXY[1]*this.scale.screenHeight],
      endXY: [endXY[0]*this.scale.screenWidth, endXY[1]*this.scale.screenHeight],
      duration:duration,
      loop: false,
    });
  }

  characterWalkOn() {
    this.monster.tweenOptions = this.makeMoveTween([-300,505], [40,505]);
    this.monster.loopAnimation = true;
    this.setState({
      monsterAnimationIndex: monster.animationIndex('WALK'),
      tweenCharacter: true,
    }, ()=> {this.refs.monsterRef.startTween();});
  }

  // random time for background bubbles to be on screen, between 2 and 6 seconds
  getRandomDuration () {
    return (Math.floor(Math.random() *  (4000)) + 2000) * this.scale.screenWidth;
  }

  onTweenFinish (characterUID) {
    const remainingBubbles = this.state.bubbleArray.filter((item) => {
      if (item.props.characterUID === characterUID) {
        return false;
      }
      return true;
    });
    this.setState({bubbleArray: remainingBubbles});
  }

  onCharacterTweenFinish () {
    this.monster.loopAnimation = false;
    this.setState({monsterAnimationIndex: monster.animationIndex('IDLE')});
  }

  // populate array of background bubbles
  createBubbles () {
    const uid = randomstring({ length: 7 });
    const displayTargetBubble = Math.random() < 0.4;
    let createTargetBubble = displayTargetBubble && !this.state.targetBubbleActive;

    let bubbles = [];
    let bubbleSize = {};
    let locSequence = [];
    let bubbleDeminsions;
    if (createTargetBubble) {
      bubbleDeminsions = 200;
    } else {
      bubbleDeminsions = Math.floor(Math.random()* 100) + 50;
    }
    // const startLeft = Math.floor(Math.random() * SCREEN_WIDTH - bubbleDeminsions);
    const fountainCenter = (FOUTAIN_LOCATION.left + fountain.size.width/2);
    const startLeft = fountainCenter - (bubbleDeminsions/2 - 50);
    const startTop = FOUTAIN_LOCATION.top - (bubbleDeminsions * 0.7);

    bubbleSize = {
      width: Math.floor(bubbleDeminsions * this.scale.image),
      height: Math.floor(bubbleDeminsions * this.scale.image),
    };
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    const minusOrPlus = plusOrMinus > 0 ? -1 : 1;
    locSequence = [
      startLeft + plusOrMinus * Math.random() * (SCREEN_WIDTH/8),
      startLeft + minusOrPlus * Math.random() * (SCREEN_WIDTH/6),
      startLeft + plusOrMinus * Math.random() * (SCREEN_WIDTH/4),
      startLeft + minusOrPlus * Math.random() * (SCREEN_WIDTH/3),
    ];
    if (createTargetBubble) {
      locSequence = [startLeft];
    }

    let backgroundBubbleTween = {
      tweenType: "sine-wave",
      startXY: [startLeft, startTop],
      xTo: locSequence,
      yTo: [-bubbleDeminsions],
      duration: createTargetBubble ? 4000 * this.scale.screenWidth : this.getRandomDuration(),
      loop: false,
    };

    if (createTargetBubble) {
      const target = Math.floor(Math.random() * 4);
      switch (target) {
        case 0:
          this.targetBubble.frameIndex = [2];
          this.targetBubble.name = 'can';
          break;
        case 1:
          this.targetBubble.frameIndex = [3];
          this.targetBubble.name = 'fly';
          break;
        case 2:
          this.targetBubble.frameIndex = [4];
          this.targetBubble.name = 'fruit';
          break;
        case 3:
          this.targetBubble.frameIndex = [5];
          this.targetBubble.name = 'grass';
          break;
      }
      this.targetBubble.opacity = 1;
      this.targetBubble.uid = uid;
      this.targetBubble.tweenOptions = backgroundBubbleTween;
      this.targetBubble.coordinates = {
        top: startTop * this.scale.screenHeight,
        left: startLeft * this.scale.screenWidth,
      };
      this.targetBubble.size = bubbleSize;
      this.setState({targetBubbleActive: true});
    } else if (bubbles.length < MAX_NUMBER_BUBBLES) {
      bubbles.push(
        <AnimatedSprite
          character={bubbleCharacter}
          key={randomstring({ length: 7 })}
          characterUID={uid}
          animationFrameIndex={[0]}
          tweenOptions={backgroundBubbleTween}
          tweenStart={'auto'}
          onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
          loopAnimation={false}
          coordinates={{
            top: startTop * this.scale.screenHeight,
            left: startLeft * this.scale.screenWidth}}
          size={bubbleSize}
        />
      );

      if (this.state.bubbleArray.length <= MAX_NUMBER_BUBBLES) {
        this.setState({bubbleArray: this.state.bubbleArray.concat(bubbles)});
      }
    }
  }

  foodFall (startX, startY) {
    debugger;
    this.food.tweenOptions = {
      tweenType: 'sine-wave',
      startXY: [startX, startY],
      xTo: [150 * this.scale.screenWidth],
      yTo: [500 * this.scale.screenHeight],
      duration: 1000 * this.scale.screenWidth,
      loop: false,
    };

    this.food.active = true;
    this.food.uid = randomstring({length: 7});
    this.food.name = 'can';
    this.food.character = canCharacter;
    this.food.location = {top: startY * this.scale.screenHeight, left:startX * this.scale.screenWidth};
    this.food.size = {width: 109 * this.scale.screenWidth, height: 116 * this.scale.screenHeight};
    this.setState({showFood: true});

    clearInterval(this.eatInterval)
    this.eatInterval = setInterval(() => {
      this.setState({
        monsterAnimationIndex: monster.animationIndex('EAT'),
      });
      clearInterval(this.eatInterval);
    }, 600);
  }

  onFoodTweenFinish () {
    this.setState({
      showFood: false,
    });
  }

  popBubble (stopValues) {
    // NOTE: b/c of bug and use of opacity it is possible to pop the transparent
    // bubbble, since this should not happen we check if targetBubble.opacity == 0
    // and ignore.
    if (!this.targetBubble.opacity) {
      return;
    }
    const stopValueX = stopValues[0];
    const stopValueY = stopValues[1];
    // TODO: opacity part of hack to what may be a
    // RN bug associated with premiture stopping of Tween and removing
    // The related component
    this.targetBubble.opacity = 0;
    this.setState({targetBubbleActive: true});
    // time to play pop sound
    debugger;
    this.foodFall(stopValueX, stopValueY);
  }

  targetBubbleTweenFinish () {
    this.targetBubble.opacity = 1;
    this.setState({targetBubbleActive: false});
  }

  leverPressIn () {
    this.bubbleFountainInterval = setInterval(() => {
      this.createBubbles();
    }, 200);
  }

  leverPress () {
    // console.warn('lever PRESS');
  }

  leverPressOut () {
    clearInterval(this.bubbleFountainInterval);
  }

  render () {
    return (
      <Image source={require('../../media/backgrounds/Game_7_Background_1280.png')} style={styles.backgroundImage}>
          <View style={styles.gameWorld}>
            <AnimatedSprite
              character={lever}
              characterUID={this.characterUIDs.lever}
              animationFrameIndex={[0]}
              loopAnimation={false}
              coordinates={{
                top: LEVER_LOCATION.top,
                left: LEVER_LOCATION.left}}
              size={{
                width: Math.floor(lever.size.width * this.scale.image),
                height: Math.floor(lever.size.height * this.scale.image)}}
              rotate={[{rotateY:'0deg'}, {rotateX: '10deg'}]}
              onPress={() => this.leverPress()}
              onPressIn={() => this.leverPressIn()}
              onPressOut={() => this.leverPressOut()}
            />

            {this.state.loadContent ?
              <AnimatedSprite
                character={bubbleCharacter}
                characterUID={randomstring({length: 7})}
                animationFrameIndex={this.state.bubbleAnimationIndex}
                loopAnimation={false}
                coordinates={{top: 400 * this.scale.screenHeight,
                  left: -300 * this.scale.screenWidth}}
                size={{ width: Math.floor(300 * this.scale.image),
                  height: Math.floor(285 * this.scale.image)}}
              />
            : null}

            <AnimatedSprite
              ref={'monsterRef'}
              character={monster}
              characterUID={this.characterUIDs.monster}
              animationFrameIndex={this.state.monsterAnimationIndex}
              tweenStart={'fromCode'}
              tweenOptions={this.monster.tweenOptions}
              onTweenFinish={(characterUID)=> this.onCharacterTweenFinish(characterUID)}
              loopAnimation={this.monster.loopAnimation}
              coordinates={{top: (505) * this.scale.screenHeight,
                left: -300 * this.scale.screenWidth}}
              size={{ width: Math.floor(300 * this.scale.image),
                height: Math.floor(285 * this.scale.screenHeight)}}
              rotate={[{rotateY:'180deg'}]}
            />

            {this.state.bubbleArray}

            {this.state.targetBubbleActive ?
              <AnimatedSprite
                style={{opacity: this.targetBubble.opacity}}
                character={bubbleCharacter}
                characterUID={this.targetBubble.uid}
                animationFrameIndex={this.targetBubble.frameIndex}
                loopAnimation={false}
                tweenOptions={this.targetBubble.tweenOptions}
                tweenStart={'auto'}
                onTweenFinish={(characterUID) => this.targetBubbleTweenFinish(characterUID)}
                coordinates={this.targetBubble.coordinates}
                size={this.targetBubble.size}
                stopAutoTweenOnPressIn={this.targetBubble.stopTweenOnPress}
                onTweenStopped={(stopValues) => this.popBubble(stopValues)}
              />
            : null}

            {this.state.showFood ?
              <AnimatedSprite
                character={this.food.character}
                characterUID={this.food.uid}
                animationFrameIndex={[0]}
                tweenOptions={this.food.tweenOptions}
                tweenStart='auto'
                onTweenFinish={(characterUID) => this.onFoodTweenFinish(characterUID)}
                loopAnimation={false}
                coordinates={this.food.location}
                size={this.food.size}
              />
            : null}

            <AnimatedSprite
              character={fountain}
              characterUID={this.characterUIDs.fountain}
              animationFrameIndex={[0]}
              loopAnimation={false}
              coordinates={{top: FOUTAIN_LOCATION.top,
                left: FOUTAIN_LOCATION.left}}
              size={{ width: fountain.size.width * this.scale.image,
                height: fountain.size.height * this.scale.image}}
            />
          </View>

          <HomeButton
            route={this.props.route}
            navigator={this.props.navigator}
            routeId={{ id: 'Main' }}
            styles={{ width: 150,height: 150,top:0, left: 0, position: 'absolute' }}
          />
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  topLevel :{
    alignItems: 'center',
  },
  gameWorld: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    borderStyle: 'solid',
    borderWidth: 2,
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
  topBar: {
    alignItems: 'center',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 700,
    borderStyle: 'solid',
    borderWidth: 2,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    left: 10,
    borderStyle: 'solid',
    borderColor: '#ff00ff',
  },
  button: {
    backgroundColor: '#4d94ff',
    borderRadius: 10,
    width: 100,
    height: 50,
    justifyContent: 'center',
  },
});

BubblesGame.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};

reactMixin.onClass(BubblesGame, TimerMixin);

export default BubblesGame;
