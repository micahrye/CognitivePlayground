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
      showFood: false,
      matrixTiles: [true, true, true, true, true, true, true, true, true],
      tiles: {},
      level: 1,
      trial: 1,
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

    const level = 1; const trial = 1;
    this.setState({
      level,
      trial,
      tiles: gameTiles.gameBoardTilesForTrial(level, trial),
    });

    this.foodSprite.coords = this.foodStartLocation(this.scale);
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

  // makeMoveTween (startXY=[-300, 500], endXY=[600, 400], duration=1500) {
  //   return ({
  //     tweenType: "linear-move",
  //     startXY: [startXY[0], startXY[1]],
  //     endXY: [endXY[0], endXY[1]],
  //     duration:duration,
  //     loop: false,
  //   });
  // }

  // birdFlyIntoScene () {
  //   const birdStartLoc = this.birdStartLocation();
  //   const birdEndLoc = this.birdEndLocation();
  //   const startXY = [birdStartLoc.left, birdStartLoc.top];
  //   const endXY = [birdEndLoc.left, birdEndLoc.top];
  //   this.bird.tweenOptions = this.makeMoveTween(startXY, endXY);
  //   this.bird.loopAnimation = true;
  //   // BUG: need to look into bug
  //   // this.setState({
  //   //   birdAnimationIndex: birdSprite.animationIndex('FLY'),
  //   //   tweenCharacter: true,
  //   // }, ()=> {this.refs.birdRef.startTween();});
  // }

  // onCharacterTweenFinish () {
  //   console.log('onCharacterTweenFinish');
  //   this.bird.loopAnimation = false;
  //   this.setState({birdAnimationIndex: birdSprite.animationIndex('IDLE')});
  // }

  birdMouthLocation () {
    const birdLoc = this.birdEndLocation();
    const birdSize = this.birdSize();
    const x = birdLoc.left + birdSize.width/2;
    const y = birdLoc.top + birdSize.height/2;
    return [x, y];
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

  foodFall (startX, startY) {
    console.log('foodFall');
    this.setState({showFood: true});

    clearInterval(this.eatInterval);
    this.eatInterval = setInterval(() => {
      this.setState({
        birdAnimationIndex: birdSprite.animationIndex('EAT'),
      }, () => {
        this.celebrateTimeout = setTimeout(() => {
          this.setState({
            birdAnimationIndex: birdSprite.animationIndex('CELEBRATE'),
          });
        }, 600);
      });
      clearInterval(this.eatInterval);
    }, 600);
  }

  onFoodTweenFinish () {
    console.log('onFoodTweenFinish');
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
    })
  }

  leverPressIn () {
    console.log('leverPressIn');
    // MICAH
    const blinkSeq = gameTiles.tileBlinkSequence(1, 1);
    this.blink(blinkSeq);
    this.setState({
      leverAnimationIndex: leverSprite.animationIndex('SWITCH_ON'),
    });
  }

  leverPressOut () {
    this.pressSequence = [];
    console.log('leverPressOut');
    _.forEach(this.blinkTimeoutArray, blinkTimeout => clearTimeout(blinkTimeout));
    const tiles = gameTiles.gameBoardTilesForTrial(this.state.level, this.state.trial);
    debugger;
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
    const scaleBird = 1.2;
    return {
      width: birdSprite.size.width * scaleBird * this.scale.image,
      height: birdSprite.size.height * scaleBird * this.scale.image,
    };
  }

  birdStartLocation () {
    const topOffset = 60 * this.scale.screenHeight;
    const birdHeight = this.birdSize().height;
    const top = SCREEN_HEIGHT - birdHeight - topOffset;
    const left = 40 * this.scale.screenWidth;
    return {top, left};
  }

  birdEndLocation () {
    const topOffset = 140 * this.scale.screenHeight;
    const birdHeight = this.birdSize().height;
    const top = SCREEN_HEIGHT - birdHeight - topOffset;
    const left = 40 * this.scale.screenWidth;
    return {top, left};
  }

  characterCelebrateAndEat () {
    const frameIndex = birdSprite.animationIndex('CELEBRATE');
    this.setState({ birdAnimationIndex: frameIndex });
  }

  gameBoardTilePress (tile, index) {
    console.log(`gameBoardTilePress tileInfo = ${index}`);
    // tile press animation
    this.pressSequence.push(index);
    // test if sequence matched
    const blinkSeq = gameTiles.tileBlinkSequence(this.state.level, this.state.trial);
    const correct = _.every(blinkSeq, (seqNum, index) => {
      return seqNum === this.pressSequence[index];
    });
    if (correct) {
      console.log('WINNER WINNER');
      this.characterCelebrateAndEat();
    }
    const tiles = _.cloneDeep(this.state.tiles);
    tiles[index].frameKey = 'PRESSED';
    tiles[index].uid = randomstring({ length: 7 });
    console.log('SET STATE');
    this.setState(
      { tiles }, () => {
        this.btnTimeout = setTimeout(() => {
          const tiles = _.cloneDeep(this.state.tiles);
          tiles[index].frameKey = 'IDLE';
          tiles[index].uid = randomstring({ length: 7 });
          console.log('SET STATE');
          this.setState({ tiles });
        }, 80);
      });
  }

  gameBoardTilePressIn (tile, index) {
    console.log(`onPressIn tileInfo = ${index}`);
  }

  gameBoardTilePressOut (tile, index) {
    console.log(`onPressOut tileInfo = ${index}`);
  }

  render () {
    console.log('RENDERING');
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
              character= {leverSprite}
              characterUID={this.characterUIDs.lever}
              animationFrameIndex={this.state.leverAnimationIndex}
              loopAnimation={false}
              coordinates={this.leverLocation()}
              size={this.leverSize()}
              rotate={[{rotateY:'180deg'}]}
              onPressIn={() => this.leverPressIn()}
              onPressOut={() => this.leverPressOut()}
            />
            <AnimatedSprite
              character={foodSprite}
              characterUID={this.characterUIDs.fruit}
              animationFrameIndex={foodSprite.animationIndex('IDLE')}
              tweenOptions = {this.foodSprite.tweenOptions}
              tweenStart={'fromCode'}
              onTweenFinish={(characterUID) => this.onFoodTweenFinish(characterUID)}
              loopAnimation={false}
              coordinates={this.foodSprite.coords}
              size={this.foodSize()}
            />
            <AnimatedSprite
              ref={'birdRef'}
              character={birdSprite}
              characterUID={this.characterUIDs.bird}
              animationFrameIndex={this.state.birdAnimationIndex}
              loopAnimation={false}
              coordinates={this.birdStartLocation()}
              size={this.birdSize()}
            />
            <AnimatedSprite
              character={beltSprite}
              characterUID={this.characterUIDs.belt}
              animationFrameIndex={[0, 1]}
              loopAnimation={true}
              coordinates={this.conveyorBeltLocation()}
              size={this.conveyorBeltSize()}
            />
            <AnimatedSprite
              character={ledSprite}
              characterUID={this.characterUIDs.led}
              animationFrameIndex={[0]}
              loopAnimation={false}
              coordinates={this.ledLocation()}
              size={this.ledSize()}
            />
            <AnimatedSprite
              character={foodMachineSprite}
              characterUID={this.characterUIDs.machine}
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
              onPressIn={(tile, index) => this.gameBoardTilePressIn(tile, index)}
              onPressOut={(tile, index) => this.gameBoardTilePressOut(tile, index)}
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
