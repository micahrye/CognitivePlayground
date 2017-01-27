import React from 'react';
import {
  View,
  Image,
} from 'react-native';

import _ from 'lodash';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from '../../components/AnimatedSprite/AnimatedSprite';
import HomeButton from '../../components/HomeButton/HomeButton';
import LoadScreen from '../../components/LoadScreen';

import leverSprite from '../../sprites/lever/leverCharacter';
import birdSprite from "../../sprites/bird/birdCharacter";
import foodSprite from "../../sprites/apple/appleCharacter";
import foodMachineSprite from "../../sprites/foodMachine/foodMachineCharacter";
import beltSprite from "../../sprites/conveyorBelt/beltCharacter";
import ledSprite from "../../sprites/led/ledCharacter";
import buttonSprite from "../../sprites/button/buttonCharacter";
import arrowSprite from "../../sprites/arrow/arrowCharacter";

import Matrix from '../../components/Matrix';
import gameTiles from './gameTiles';

import styles from "./styles";

const SCREEN_WIDTH = require ('Dimensions').get('window').width;
const SCREEN_HEIGHT = require ('Dimensions').get('window').height;

const GAME_TIME_OUT = 115000;

class UnlockFoodGame extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      leverAnimationIndex: [0],
      buttonAnimationIndex: [0],
      birdAnimationIndex: [0],
      machineAnimationIndex: [0],
      arrowAnimationIndex: [0],
      ledAnimationIndex: [0],
      beltAnimationIndex: [0],
      lightbulbAnimationIndex: [0],
      loadContent: false,
      showFood: true,
      tiles: {},
      trial: 0,
      loadingScreen: true,
    };
    this.scale = this.props.scale;
    this.characterUIDs = {};
    this.setDefaultAnimationState;
    this.bird = {tweenOptions: {}};
    this.foodSprite = {
      tweenOptions: {},
      coords: {top: 0, left: 0},
    };

    this.pressSequence = [];
    this.btnTimeout;
    this.blinkTimeout;
    this.blinkTimeoutArray = [];
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
      buttonAnimationIndex: buttonSprite.animationIndex('ALL'),
      birdAnimationIndex: birdSprite.animationIndex('ALL'),
      machineAnimationIndex: foodMachineSprite.animationIndex('ALL'),
      arrowAnimationIndex: arrowSprite.animationIndex('ALL'),
      ledAnimationIndex: ledSprite.animationIndex('ALL'),
      beltAnimationIndex: beltSprite.animationIndex('ALL'),
    });

    this.nextTrial(0);

    this.foodSprite.coords = this.foodStartLocation();
    const beltCoords = this.conveyorBeltLocation();
    const birdMouthLoc = this.birdMouthLocation();
    const pastBelt = 50 * this.props.scale.screenWidth;
    this.foodSprite.tweenOptions = {
      tweenType: 'sine-wave',
      startXY: [this.foodSprite.coords.left, this.foodSprite.coords.top],
      xTo: [beltCoords.left - pastBelt, birdMouthLoc.left],
      yTo: [this.foodSprite.coords.top, birdMouthLoc.top],
      duration: 1500,
      loop: false,
    };

  }

  componentDidMount () {
    this.timeoutGameOver = setTimeout(()=>{
      this.props.navigator.replace({
        id: "Main",
      });
    }, GAME_TIME_OUT);
  }

  componentWillUnmount () {
    clearInterval(this.eatInterval);
    clearTimeout(this.timeoutGameOver);
    clearTimeout(this.celebrateTimeout);
    clearTimeout(this.setDefaultAnimationState);
    clearTimeout(this.btnTimeout);
    clearInterval(this.matrixShifterInterval);
    clearTimeout(this.blinkTimeout);
    _.forEach(this.blinkTimeoutArray, blinkTimeout => clearTimeout(blinkTimeout));
  }

  nextTrial (trial) {
    this.setState({
      trial,
      tiles: gameTiles.gameBoardTilesForTrial(trial),
    });
  }

  foodStartLocation () {
    // machine location - machine size
    const beltCoords = this.conveyorBeltLocation();
    const beltSize = this.conveyorBeltSize();
    const foodSize = this.foodSize();
    const coords = {
      top: beltCoords.top - foodSize.height,
      left: beltCoords.left + beltSize.width,
    };
    return coords;
  }

  birdMouthLocation () {
    const birdLoc = this.birdEndLocation();
    const birdSize = this.birdSize();
    const left = birdLoc.left + birdSize.width * 0.6;
    const top = birdLoc.top + birdSize.height * 0.6;
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

  conveyorBeltEndLocation () {
    const beltLocation = this.conveyorBeltLocation();
    const beltSize = this.conveyorBeltSize();
    const foodSize = this.foodSize();
    const left = beltLocation.left-(foodSize.width/2);
    const top = beltLocation.top - (beltSize.height * 1.42);
    return {top, left};
  }

  onFoodTweenFinish () {
    this.foodSprite.coords = this.foodStartLocation();
    this.setState({
      showFood: false,
    });
  }

  blink (blinkSeq) {
    _.forEach(blinkSeq, (blinkIndex, index) => {
      const blinkTimeout = setTimeout(()=> {
        const tiles = _.cloneDeep(this.state.tiles);
        _.forEach(tiles, tile => tile.frameKey = 'IDLE');
        tiles[blinkIndex].frameKey = 'BLINK_0';
        this.setState({ tiles });
      }, (400 + 600 * index));
      this.blinkTimeoutArray.push(blinkTimeout);
    });
  }

  leverPressIn () {
    const blinkSeq = gameTiles.tileBlinkSequence(this.state.trial);
    this.blink(blinkSeq);
    this.setState({
      leverAnimationIndex: leverSprite.animationIndex('SWITCH_ON'),
    });

  }

  leverPressOut () {
    this.pressSequence = [];
    _.forEach(this.blinkTimeoutArray, blinkTimeout => clearTimeout(blinkTimeout));
    const tiles = gameTiles.gameBoardTilesForTrial(this.state.trial);
    this.setState({
      tiles,
      leverAnimationIndex: leverSprite.animationIndex('SWITCH_OFF'),
    });
  }

  leverSize () {
    const scaleLever = 1.25;
    return ({
      width: leverSprite.size.width * scaleLever * this.scale.image,
      height: leverSprite.size.height * scaleLever * this.scale.image,
    });
  }

  leverLocation () {
    const locationMachine = this.machineLocation();
    const machineSize = this.machineSize();
    const leftOffset = (15 * this.scale.screenWidth);
    const left = locationMachine.left + machineSize.width - leftOffset;
    const top = SCREEN_HEIGHT - machineSize.height;

    return {top, left};
  }

  machineSize () {
    return ({
      width: foodMachineSprite.size.width * this.scale.image,
      height: foodMachineSprite.size.height * this.scale.image,
    });
  }

  machineLocation () {
    //placement for food machine
    const machineSize = this.machineSize();
    const leverSize = this.leverSize();
    const leftOffset = 20 * this.scale.screenWidth;
    const left = ((SCREEN_WIDTH - machineSize.width) - leverSize.width - leftOffset);
    const top = ((SCREEN_HEIGHT - machineSize.height));
    return ({top, left});
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
    const left = locationMachine.left - machineSize.width + leftOffset;
    const top = SCREEN_HEIGHT - (machineSize.height * 0.53);
    return {top, left};
  }

  ledSize () {
    const scaleLed = 1;
    return ({
      width: ledSprite.size.width * scaleLed * this.scale.image,
      height: ledSprite.size.height * scaleLed * this.scale.image,
    });
  }

  ledLocation () {
    const locationMachine = this.machineLocation();
    const machineSize = this.machineSize();
    const leftOffset = 320 * this.scale.screenWidth;
    const topOffset = 5 * this.scale.screenHeight;
    const left = locationMachine.left + machineSize.width - leftOffset;
    const top = locationMachine.top - this.ledSize().height + topOffset;
    return {top, left};
  }

  buttonSize () {
    const scaleButton= 1;
    return ({
      width: buttonSprite.size.width * scaleButton * this.scale.image,
      height: buttonSprite.size.width * scaleButton * this.scale.image,
    });
  }

  buttonLocation () {
    const locationMachine = this.machineLocation();
    const machineSize = this.machineSize();
    const leftOffset = 418 * this.scale.screenWidth;
    const topOffset = 135 * this.scale.screenHeight;
    const left = locationMachine.left + machineSize.width - leftOffset;
    const top = SCREEN_HEIGHT - machineSize.height + topOffset;
    return {top, left};
  }

  birdSize () {
    const scaleBird = 1.9;
    return {
      width: birdSprite.size.width * scaleBird * this.scale.image,
      height: birdSprite.size.height * scaleBird * this.scale.image,
    };
  }

  birdStartLocation () {
    const topOffset = 60 * this.scale.screenHeight;
    const birdHeight = this.birdSize().height;
    const top = SCREEN_HEIGHT - birdHeight - topOffset;
    const left = 20 * this.scale.screenWidth;
    return {top, left};
  }

  birdEndLocation () {
    const topOffset = 140 * this.scale.screenHeight;
    const birdHeight = this.birdSize().height;
    const top = SCREEN_HEIGHT - birdHeight - topOffset;
    const left = 40 * this.scale.screenWidth;
    return {top, left};
  }

  characterDisapointed () {
    const frameIndex = _.concat(
      birdSprite.animationIndex('DISGUST'),
      birdSprite.animationIndex('DISGUST'),
      birdSprite.animationIndex('DISGUST')
    );
    this.setState({
      birdAnimationIndex: frameIndex,
      showFood: false,
    });
  }

  characterCelebrateAndEat () {
    this.refs.foodRef.spriteTween();
    const frameIndex = birdSprite.animationIndex('CELEBRATE');
    this.setState({
      birdAnimationIndex: frameIndex,
      showFood: true,
    }, () => {
      this.celebrateTimeout = setTimeout(() => {
        this.nextTrial(this.state.trial + 1);
        this.setState({
          birdAnimationIndex: birdSprite.animationIndex('EAT'),
        });
      }, 1200 );
    });
  }

  gameBoardTilePress (tile, index) {
    const tiles = _.cloneDeep(this.state.tiles);
    tiles[index].frameKey = 'PRESSED';
    tiles[index].uid = randomstring({ length: 7 });
    this.setState(
      { tiles },
      () => {
        this.btnTimeout = setTimeout(() => {
          const tiles = _.cloneDeep(this.state.tiles);
          tiles[index].frameKey = 'IDLE';
          tiles[index].uid = randomstring({ length: 7 });
          this.setState({ tiles });
        }, 80);
    });
    this.pressSequence.push(index);
    const blinkSeq = gameTiles.tileBlinkSequence(this.state.trial);
    const correct = _.every(this.pressSequence, (seqNum, index) => {
      return seqNum === blinkSeq[index];
    });
    if (correct && (this.pressSequence.length === blinkSeq.length)) {
      this.characterCelebrateAndEat();
    } else if (!correct) {
      this.characterDisapointed();
    }
  }

  onLoadScreenFinish () {
    this.setState({loadingScreen: false});
  }

  render () {
    const fruitVisable = this.state.showFood ? true : false;
    return (
      <View style={styles.container}>
        <Image
          source={require('../../media/backgrounds/Game_6_Background_1280.png')}
          style={{
            flex: 1,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
          }}>
            <AnimatedSprite
              sprite={leverSprite}
              spriteUID={this.characterUIDs.lever}
              animationFrameIndex={this.state.leverAnimationIndex}
              loopAnimation={false}
              coordinates={this.leverLocation()}
              size={this.leverSize()}
              rotate={[{rotateY:'180deg'}]}
              onPressIn={() => this.leverPressIn()}
              onPressOut={() => this.leverPressOut()}
            />
            <AnimatedSprite
              visable={fruitVisable}
              sprite={foodSprite}
              ref={'foodRef'}
              spriteUID={this.characterUIDs.fruit}
              animationFrameIndex={foodSprite.animationIndex('IDLE')}
              tweenOptions = {this.foodSprite.tweenOptions}
              tweenStart={'fromMethod'}
              onTweenFinish={(characterUID) => this.onFoodTweenFinish(characterUID)}
              loopAnimation={false}
              coordinates={this.foodSprite.coords}
              size={this.foodSize()}
            />
            <AnimatedSprite
              ref={'birdRef'}
              sprite={birdSprite}
              spriteUID={this.characterUIDs.bird}
              animationFrameIndex={this.state.birdAnimationIndex}
              loopAnimation={false}
              coordinates={this.birdStartLocation()}
              size={this.birdSize()}
            />
            <AnimatedSprite
              sprite={beltSprite}
              spriteUID={this.characterUIDs.belt}
              animationFrameIndex={[0, 1]}
              loopAnimation={true}
              coordinates={this.conveyorBeltLocation()}
              size={this.conveyorBeltSize()}
            />
            <AnimatedSprite
              sprite={ledSprite}
              spriteUID={this.characterUIDs.led}
              animationFrameIndex={[0]}
              loopAnimation={false}
              coordinates={this.ledLocation()}
              size={this.ledSize()}
            />
            <AnimatedSprite
              sprite={foodMachineSprite}
              spriteUID={this.characterUIDs.machine}
              animationFrameIndex={[0]}
              loopAnimation={false}
              coordinates={this.machineLocation()}
              size={this.machineSize()}
            />

            <Matrix
              styles={{
                  top: 350 * this.props.scale.screenHeight,
                  left: 650 * this.props.scale.screenWidth,
                  position: 'absolute',
                  width: 400 * this.props.scale.screenWidth,
                  height: 400 * this.props.scale.screenHeight,
                }}
              tileScale={1}
              tiles={this.state.tiles}
              scale={this.props.scale}
              onPress={(tile, index) => this.gameBoardTilePress(tile, index)}
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
            {this.state.loadingScreen ?
              <LoadScreen
                onTweenFinish={() => this.onLoadScreenFinish()}
                width={SCREEN_WIDTH}
                height={SCREEN_HEIGHT}
              />
            : null}

          </Image>
        </View>
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
