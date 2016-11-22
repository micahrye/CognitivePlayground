import React from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from "../AnimatedSprite/AnimatedSprite";
import HomeButton from '../HomeButton/HomeButton';
import Lever from '../Lever/Lever';
import bubbleCharacter from '../../sprites/bubbles/bubblesCharacter';
import monsterCharacter from '../../sprites/monster/monsterCharacter';
import leverCharacter from '../../sprites/lever/leverCharacter';
import fountainCharacter from '../../sprites/fountain/fountainCharacter';
import canCharacter from '../../sprites/can/canCharacter';
//import styles from './styles';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const TOP_OFFSET = 20;

const GAME_TIME_OUT = 115000;
const MAX_NUMBER_BUBBLES = 15;
const FOUTAIN_LOCATION = {top: 0, left: 0};
const LEVER_LOCATION = {top: 0, left: 0};


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
    this.scale = this.props.scale;
    this.characterUIDs = {};
    this.animations = ['eat', 'bubble', 'bubbleCan', 'bubbleBug', 'bubbleGrass'];
    this.setDefaultAnimationState;
    this.bubbleFountainInterval;
    this.targetBubble = {active: false, uid: '', name: '', stopTweenOnPress: true};
    this.food = {active: false, uid: '', name: ''};
    this.monster = {tweenOptions: {}};
    // This all needs to be adjusted
    FOUTAIN_LOCATION.top = SCREEN_HEIGHT - (fountainCharacter.size.height*this.scale.screenHeight);
    FOUTAIN_LOCATION.left = (SCREEN_WIDTH/2) - (fountainCharacter.size.width/2)*this.scale.screenWidth;
    LEVER_LOCATION.top = FOUTAIN_LOCATION.top + 60 ;
    LEVER_LOCATION.left = FOUTAIN_LOCATION.left + (fountainCharacter.size.width - 40 );

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

  makeMoveTween (startXY=[-300, 500], endXY=[600, 400], duration=1500) {
    return ({
      tweenType: "linear-move",
      startXY: [startXY[0], startXY[1]],
      endXY: [endXY[0], endXY[1]],
      duration:duration,
      loop: false,
    });
  }

  characterWalkOn () {
    const monstStartLoc = this.monsterStartLocation();
    const monstEndLoc = this.monsterEndLocation();
    const startXY = [monstStartLoc.left, monstStartLoc.top];
    const endXY = [monstEndLoc.left, monstEndLoc.top];
    this.monster.tweenOptions = this.makeMoveTween(startXY, endXY);
    this.monster.loopAnimation = true;
    this.setState({
      monsterAnimationIndex: monsterCharacter.animationIndex('WALK'),
      tweenCharacter: true,
    }, ()=> {this.refs.monsterRef.startTween();});
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
    this.setState({monsterAnimationIndex: monsterCharacter.animationIndex('IDLE')});
  }

  // random time for background bubbles to be on screen, between 2 and 6 seconds
  getRandomDuration () {
    return (Math.floor(Math.random() *  (4000)) + 2000);
  }

  // populate array of background bubbles
  createBubbles () {
    const uid = randomstring({ length: 7 });
    const displayTargetBubble = Math.random() < 0.5;
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
    bubbleSize = {
      width: Math.floor(bubbleDeminsions * this.scale.image),
      height: Math.floor(bubbleDeminsions * this.scale.image),
    };
    const fountainSize = this.foutainSize();
    const fountainLoc = this.fountainLocation();
    const fountainCenter = (fountainLoc.left + fountainSize.width/2);
    const offsetLeft = 80 * this.scale.screenWidth;
    const startLeft = fountainCenter - (bubbleSize.width/2 - offsetLeft);
    const startTop = fountainLoc.top - (bubbleSize.width * 0.7);

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
      duration: createTargetBubble
        ? 4000 : this.getRandomDuration(),
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

  monsterMouthLocation () {
    const monstLoc = this.monsterEndLocation();
    const monstSize = this.monsterSize();
    const x = monstLoc.left + monstSize.width/2;
    const y = monstLoc.top + monstSize.height/2;
    debugger;
    return [x, y];
  }
  foodFall (startX, startY) {
    const mouthLoc = this.monsterMouthLocation();
    debugger;
    this.food.tweenOptions = {
      tweenType: 'sine-wave',
      startXY: [startX, startY],
      xTo: [mouthLoc[0]],
      yTo: [mouthLoc[1]],
      duration: 1000,
      loop: false,
    };

    this.food.active = true;
    this.food.uid = randomstring({length: 7});
    this.food.name = 'can';
    this.food.character = canCharacter;
    this.food.location = {top: startY * this.scale.screenHeight, left:startX * this.scale.screenWidth};
    this.food.size = {width: 109 * this.scale.screenWidth, height: 116 * this.scale.screenHeight};
    this.setState({showFood: true});

    clearInterval(this.eatInterval);
    this.eatInterval = setInterval(() => {
      this.setState({
        monsterAnimationIndex: monsterCharacter.animationIndex('EAT'),
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
    // NOTE: b/c of bug and use of opacity it is possible to pop the
    // transparent bubbble, since this should not happen we check if
    // targetBubble.opacity == 0 and ignore.
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
  foutainSize () {
    return ({
      width: fountainCharacter.size.width * this.scale.image,
      height: fountainCharacter.size.height * this.scale.image,
    });
  }
  fountainLocation () {
    //placement for fountain and lever
    const size = this.foutainSize();
    const left = ((SCREEN_WIDTH - size.width)/2);
    const top = (SCREEN_HEIGHT - size.height) - TOP_OFFSET;
    return ({top, left});
  }
  leverSize () {
    return ({
      width: leverCharacter.size.width * this.scale.image,
      height: leverCharacter.size.height * this.scale.image,
    });
  }
  leverLocation () {
    const locatoinFoutain = this.fountainLocation();
    const foutainSize = this.foutainSize();
    const leverSize = this.leverSize();
    const left = locatoinFoutain.left + foutainSize.width - 15 * this.scale.screenWidth;
    const top = (SCREEN_HEIGHT - leverSize.height*1.2) - TOP_OFFSET;
    return {top, left};
  }

  monsterSize () {
    return {
      width: monsterCharacter.size.width * this.scale.image,
      height: monsterCharacter.size.height * this.scale.image,
    };
  }

  monsterStartLocation () {
    const top = (SCREEN_HEIGHT - monsterCharacter.size.height);
    const left = -300 * this.scale.screenWidth;
    return {top, left};
  }

  monsterEndLocation () {
    const top = (SCREEN_HEIGHT - monsterCharacter.size.height);
    const left = 40 * this.scale.screenWidth;
    return {top, left};
  }

  render () {
    return (
      <Image source={require('../../media/backgrounds/Game_7_Background_1280.png')} style={styles.backgroundImage}>
          <View style={styles.gameWorld}>
          <Lever
            character={lever}
            coordinates={{
              top: LEVER_LOCATION.top,
              left: LEVER_LOCATION.left}}
            characterUID={this.characterUIDs.lever}
            size = {{
              width: lever.size.width * this.scale.image,
              height: lever.size.height * this.scale.image}}
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
              ref={'monsterRef'}
              character={monsterCharacter}
              characterUID={this.characterUIDs.monster}
              animationFrameIndex={this.state.monsterAnimationIndex}
              tweenStart={'fromCode'}
              tweenOptions={this.monster.tweenOptions}
              onTweenFinish={(characterUID)=> this.onCharacterTweenFinish(characterUID)}
              loopAnimation={this.monster.loopAnimation}
              coordinates={this.monsterStartLocation()}
              size={{ width: Math.floor(300 * this.scale.image),
                height: Math.floor(285 * this.scale.screenHeight)}}
              rotate={[{rotateY:'180deg'}]}
            />

            <AnimatedSprite
              character={fountainCharacter}
              characterUID={this.characterUIDs.fountain}
              animationFrameIndex={[0]}
              loopAnimation={false}
              coordinates={{top: FOUNTAIN_LOCATION.top,
                left: FOUNTAIN_LOCATION.left}}
              size={{ width: fountain.size.width * this.scale.image,
                height: fountain.size.height * this.scale.image}}
            />
          </View>

          <HomeButton
            route={this.props.route}
            navigator={this.props.navigator}
            routeId={{ id: 'Main' }}
            styles={{
              width: 150 * this.scale.image,
              height: 150 * this.scale.image,
              top:0, left: 0, position: 'absolute' }}
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
  },
  backgroundImage: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
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
