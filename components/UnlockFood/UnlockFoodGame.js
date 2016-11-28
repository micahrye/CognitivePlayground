import React from 'react';
import {
  Image,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from "../AnimatedSprite/AnimatedSprite";
import HomeButton from '../HomeButton/HomeButton';
import Lever from '../Lever/Lever';
import birdCharacter from "../../sprites/bird/birdCharacter";
import fruitSprite from "../../sprites/apple/appleCharacter";
import foodMachineCharacter from "../../sprites/foodMachine/foodMachineCharacter";
import beltCharacter from "../../sprites/belt/beltCharacter";
import ledCharacter from "../../sprites/led/ledCharacter";
import buttonCharacter from "../../sprites/button/buttonCharacter";
import arrowCharacter from "../../sprites/arrow/arrowCharacter";
import lightbulbCharacter from "../../sprites/lightbulb/lightbulbCharacter";

const SCREEN_WIDTH = require ('Dimensions').get('window').width;
const SCREEN_HEIGHT = require ('Dimensions').get('window').height;
const TOP_OFFSET = 20;

const GAME_TIME_OUT = 115000;

class UnlockFoodGame extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      spriteAnimationKey: 'all',
      spriteAnimationKeyIndex: 0,
      leverAnimationIndex: [0],
      buttonArray: [],
      buttonAnimationIndex: [0],
      birdAnimationIndex: [0],
      machineAnimationIndex: [0],
      arrowAnimationIndex: [0],
      ledAnimationIndex: [0],
      beltAnimationIndex: [0],
      lightbulbAnimationIndex: [0],
      fruitAnimationIndex: [0],
      loadContent: false,
      showFood: false,
    };
    this.scale = this.props.scale;
    this.characterUIDs = {};
    this.bird = {tweenOptions: {}};
  }

  componentWillMount () {
    this.characterUIDs = {
      fruit: randomstring({ length: 7 }),
      lever: randomstring({ length: 7 }),
      machine: randomstring({ length: 7 }),
      belt: randomstring({ length: 7 }),
      led: randomstring({ length: 7 }),
      button: randomstring({ length: 7 }),
      arrow: randomstring({ length: 7 }),
      lightbulb: randomstring({ length: 7 }),
      bird: randomstring({ length: 7 }),
    };
    this.setState({
      buttonAnimationIndex: buttonCharacter.animationIndex('ALL'),
      birdAnimationIndex: birdCharacter.animationIndex('ALL'),
      machineAnimationIndex: foodMachineCharacter.animationIndex('ALL'),
      arrowAnimationIndex: arrowCharacter.animationIndex('ALL'),
      ledAnimationIndex: ledCharacter.animationIndex('ALL'),
      beltAnimationIndex: beltCharacter.animationIndex('ALL'),
      fruitAnimationIndex: fruitSprite.animationIndex('ALL'),
    });
    this.setDefaultAnimationState = setTimeout(() =>{
      this.setState({
        birdAnimationIndex: [0],
        fruitAnimationIndex: [0],
      }, ()=>{this.characterWalkOn();});
    }, 1500);
  }

  componentDidMount () {
    this.timeoutGameOver = setTimeout(()=>{
      this.props.navigator.replace({
        id: "Main",
      });
    }, GAME_TIME_OUT);
  }
  componentWillUnmount () {
    clearInterval (this.eatInterval);
    clearTimeout (this.timeoutGameOver);
    clearTimeout (this.celebrateTimeout);
    clearTimeout (this.setDefaultAnimationState);
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
    const birdStartLoc = this.birdStartLocation();
    const birdEndLoc = this.birdEndLocation();
    const startXY = [birdStartLoc.left, birdStartLoc.top];
    const endXY = [birdEndLoc.left, birdEndLoc.top];
    this.bird.tweenOptions = this.makeMoveTween(startXY, endXY);
    this.bird.loopAnimation = true;
    this.setState({
      birdAnimationIndex: birdCharacter.animationIndex('WALK'),
      tweenCharacter: true,
    }, ()=> {this.refs.birdRef.startTween();});
  }

  onCharacterTweenFinish () {
    this.bird.loopAnimation = false;
    this.setState({birdAnimationIndex: birdCharacter.animationIndex('IDLE')});
  }

  birdMouthLocation () {
    const birdLoc = this.birdEndLocation();
    const birdSize = this.birdSize();
    const x = birdLoc.left + birdSize.width/2;
    const y = birdLoc.top + birdSize.height/2;
    return [x, y];
  }

  foodSize (food, dimension) {
    // scale to 120 x 120 or closest.
    const widthScale = 120/fruitSprite.character.size.width;
    const heightScale = 120/fruitSprite.character.size.height;
    const scale = widthScale > heightScale ? heightScale : widthScale;
    switch (dimension) {
      case 'width':
        return Math.floor((fruitSprite.character.size.width * scale) * this.scale.image);
      case 'height':
        return Math.floor((fruitSprite.character.size.height * scale) * this.scale.image);
    }
  }

  foodFall (startX, startY) {
    this.setState({showFood: true});

    clearInterval(this.eatInterval);
    this.eatInterval = setInterval(() => {
      this.setState({
        birdAnimationIndex: birdCharacter.animationIndex('EAT'),
      }, () => {
        this.celebrateTimeout = setTimeout(() => {
          this.setState({
            birdAnimationIndex: birdCharacter.animationIndex('CELEBRATE'),
          });
        }, 600);
      });
      clearInterval(this.eatInterval);
    }, 600);
  }

  onFoodTweenFinish () {
    this.setState({
      showFood: false,
    });
  }

  leverPressIn () {
    this.setState({
      leverAnimationIndex: Lever.animationIndex('SWITCH_ON'),
    });
  }

  leverPress () {
    // console.warn('lever PRESS');
  }

  leverPressOut () {
    this.setState({
      leverAnimationIndex: Lever.animationIndex('SWITCH_OFF'),
    });
  }

  machineSize () {
    return ({
      width: foodMachineCharacter.size.width * this.scale.image,
      heigth: foodMachineCharacter.size.height * this.scale.image,
    });
  }

  machineLocation () {
    //placement for food machine
    const size = this.machineSize();
    const left = ((SCREEN_WIDTH - size.width)/2);
    const top = ((SCREEN_HEIGHT- size.height)- TOP_OFFSET);
    return ({top, left});
  }

  leverSize () {
    const scaleLever = 1.5;
    return ({
      width: Lever.size.width * scaleLever * this.scale.image,
      height: Lever.size.height * scaleLever * this.scale.image,
    });
  }

  leverLocation () {
    const locationMachine = this.machineLocation();
    const machineSize = this.machineSize();
    const leverSize = this.leverSize();
    const left = locationMachine.left + machineSize.width - (15 * this.scale.screenWidth);
    const top = SCREEN_HEIGHT - machineSize.height * 1.05;

    return {top, left};
  }

  beltSize () {
    const scaleBelt = 1;
    return ({
      width: beltCharacter.size.width * scaleBelt * this.scale.image,
      height: beltCharacter.size.height * scaleBelt * this.scale.image,
    });
  }

  beltLocation () {
    const locationMachine = this.machineLocation();
    const machineSize = this.machineSize();
    const beltSize = this.beltSize();
    const left = locationMachine.left + machineSize.width - (20 * this.scale.screenWidth);
    const top = SCREEN_HEIGHT - machineSize.height * 1.05;

    return {top, left};
  }

  birdSize () {
    return {
      width: birdCharacter.size.width * this.scale.image,
      height: birdCharacter.size.height * this.scale.image,
    };
  }

  birdStartLocation () {
    const characterOffset = 140 * this.scale.screenHeight;
    const characterHeight = birdCharacter.size.height * this.scale.image;
    const top = (SCREEN_HEIGHT - characterHeight - characterOffset);
    const left = -300 * this.scale.screenWidth;
    return {top, left};
  }

  birdEndLocation () {
    const characterOffset = 140 * this.scale.screenHeight;
    const characterHeight = birdCharacter.size.height * this.scale.image;
    const top = (SCREEN_HEIGHT - characterHeight - characterOffset);
    const left = 40 * this.scale.screenWidth;
    return {top, left};
  }

  render () {
    return (
      <Image
        source={require('../../media/backgrounds/Game_3_Background_1280.png')}
        style={{
          flex: 1,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
        }}>
            <AnimatedSprite
              character= {Lever}
              characterUID={this.characterUIDs.lever}
              animationFrameIndex={this.state.leverAnimationIndex}
              loopAnimation={false}
              coordinates={this.leverLocation()}
              size={this.leverSize()}
              rotate={[{rotateY:'0deg'}]}
              onPress={() => this.leverPress()}
              onPressIn={() => this.leverPressIn()}
              onPressOut={() => this.leverPressOut()}
            />
          {this.state.showFood ?
            <AnimatedSprite
              character={this.fruitSprite.character}
              characterUID={this.food.uid}
              key={this.food.uid}
              animationFrameIndex={this.fruitSprite.index}
              tweenOptions={this.fruitSprite.tweenOptions}
              tweenStart='auto'
              onTweenFinish={(characterUID) => this.onFoodTweenFinish(characterUID)}
              loopAnimation={false}
              coordinates={this.food.location}
              size={this.food.size}
            />
          : null}
          <AnimatedSprite
            ref={'birdRef'}
            character={birdCharacter}
            characterUID={this.characterUIDs.bird}
            animationFrameindex={this.state.birdAnimationIndex}
            tweenStart={'auto'}
            tweenOptions={this.bird.tweenOptions}
            onTweenFinish={(characterUID)=> this.onCharacterTweenFinish(characterUID)}
            loopAnimation={this.birdStartLocation()}
            size={{width: Math.floor(300 * this.scale.image),
              height: Math.floor(285 * this.scale.screenHeight)}}
            rotate={[{rotateY: '180deg'}]}
          />

          <AnimatedSprite
            character={foodMachineCharacter}
            characterUID={this.characterUIDs.machine}
            animationFrameIndex={[0]}
            loopAnimation={false}
            coordinates={this.machineLocation()}
            size={{ width: foodMachineCharacter.size.width * this.scale.image,
              height: foodMachineCharacter.size.height * this.scale.image}}
          />

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
UnlockFoodGame.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};

reactMixin.onClass(UnlockFoodGame, TimerMixin);

export default UnlockFoodGame;
