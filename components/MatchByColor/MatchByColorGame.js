import React from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

import _ from 'lodash';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from '../AnimatedSprite/AnimatedSprite';
// foods
import appleCharacter from "../../sprites/apple/appleCharacter";
import grassCharacter from "../../sprites/grass/grassCharacter";
import canCharacter from "../../sprites/can/canCharacter";
import bugfoodCharacter from "../../sprites/bugfood/bugfoodCharacter";
// props
import lever from '../../sprites/lever/leverCharacter';
import sign from '../../sprites/sign/signCharacter';
// utils
import { omnivoreUtils as monsterUtils } from './omnivoreUtils';
// game character related utils
import gameUtil from './gameUtil';

const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;

class MatchByColorGame extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      character: null,
      characterAnimationIndex: [0],
      loadingCharacter: false,
      dropFood: false,
      signsVisable: false,
      foodDisplayed: false,
      level: 0,
    };

    this.activeCharacter;

    this.leftSign = {tweenOptions: {}};
    this.middleSign = {tweenOptions: {}};
    this.rightSign = {tweenOptions: {}};
    this.leftFood = {tweenOptions: {}};
    this.middleFood = {tweenOptions: {}};
    this.rightFood = {tweenOptions: {}};

    this.scale = this.props.scale;
    this.baseFoodLocation = [150, 400];
    this.foodLeftShift = 200;
    this.foodTargetLocation = [300, 550];
    this.foods = [appleCharacter, grassCharacter, canCharacter];
    this.eatInterval;
    this.signInterval;
    this.targetFoodPosition;
  }

  componentWillMount () {
    this.characterUIDs = {
      lever: randomstring({ length: 7 }),
    };

    this.loadCharacter('dog');

    // set offscreen
    const coords = this.foodDisplayAtLocation(-150);
    this.leftFood.coords = [coords.top, coords.leftLeft];
    this.middleFood.coords = [coords.top, coords.middleLeft];
    this.rightFood.coords = [coords.top, coords.rightLeft];
  }

  componentDidMount () {

  }

  componentWillUnmount () {
    clearInterval(this.setDefaultAnimationState);
    clearInterval(this.eatInterval);
    clearInterval(this.switchCharacterInterval);
  }

  /**
   * used to load character image frames off screen so that image
   * frames are in memory.
   */
  loadCharacter (characterName) {
    // get character
    this.characterUIDs.character = randomstring({ length: 7 });

    this.activeCharacter = gameUtil.getCharacter(characterName);
    // want to load character offscreen
    this.activeCharacter.coords = {
      top: 400 * this.scale.screenHeight * this.scale.screenHeight,
      left: -330 * this.scale.screenWidth * this.scale.screenWidth,
    };
    this.activeCharacter.loopAnimation = false;
    this.activeCharacter.tweenOptions = {tweenOptions: {}};

    this.setState({
      character: this.activeCharacter,
      characterAnimationIndex: this.activeCharacter.animationIndex('ALL'),
      loadingCharacter: true,
    }, () => {
      clearInterval(this.setDefaultAnimationState);
      this.setDefaultAnimationState = setTimeout(() => {
        this.setState({
          characterAnimationIndex: this.activeCharacter.animationIndex('IDLE'),
          loadingCharacter: false,
        });
      }, 2000);
    });
  }

  makeMoveTween (startXY=[40, 400], endXY=[600, 400], duration=1500) {
    // WILL NEED to pass character info to since size characters diff etc.
    return (
      {
        tweenType: "linear-move",
        startXY: [startXY[0] * this.scale.screenWidth, startXY[1] * this.scale.screenHeight],
        endXY: [endXY[0] * this.scale.screenWidth, endXY[1] * this.scale.screenHeight],
        duration: duration,
        loop: false,
      }
    );
  }

  onCharacterTweenFinish (characterUID) {
    this.activeCharacter.loopAnimation = false;
    switch (characterUID) {
      case this.characterUIDs.character:
        this.setState({characterAnimationIndex: this.activeCharacter.animationIndex('IDLE')});
        break;
    }
  }

  foodDisplayAtLocation (top = 150, left = 400, shift = 200) {
    return {
      top: top,
      leftLeft: left,
      middleLeft: left + shift,
      rightLeft: left + 2 * shift,
    };
  }

  initializeMoveDownTweensForSignsAndFoods () {
    this.leftSign.tweenOptions = this.makeMoveTween([350, -300], [350, 0], 1000);
    this.middleSign.tweenOptions = this.makeMoveTween([550, -300], [550, 0], 1000);
    this.rightSign.tweenOptions = this.makeMoveTween([750, -300], [750, 0], 1000);
  }

  initializeMoveUpTweensForSignsAndFoods () {
    this.leftSign.tweenOptions = this.makeMoveTween([350, 0], [350, -300], 800);
    this.middleSign.tweenOptions = this.makeMoveTween([550, 0], [550, -300], 800);
    this.rightSign.tweenOptions = this.makeMoveTween([750, 0], [750, -300], 800);
  }

  leverPressIn () {
    // console.warn('leverPressIn');
  }

  leverPress () {
    if (this.state.loadingCharacter || this.state.signsVisable) {
      return;
    }

    // creature enter from left
    this.activeCharacter.tweenOptions = this.makeMoveTween([-300, 400], [150, 400]);

    this.initializeMoveDownTweensForSignsAndFoods();

    this.activeCharacter.loopAnimation = true;

    this.setState({
      characterAnimationIndex: this.activeCharacter.animationIndex('WALK'),
      signsVisable: true},
      () => {
        this.refs.leftSign.startTween();
        this.refs.middleSign.startTween();
        this.refs.rightSign.startTween();
        this.refs.characterRef.startTween();
        // then interval to make food appear on sign.
        clearInterval(this.showFoodInterval);
        this.showFoodInterval = setInterval(() => {
          const coords = this.foodDisplayAtLocation();
          this.showFoods(coords, true);
          clearInterval(this.showFoodInterval)
        }, 1000);
      });
  }

  leverPressOut () {
    // console.warn('leverPressOut');
  }

  showFoods (coords, displayFood, setState = true) {
    // can be case that this.setState is beeing called and setting
    // food key and location is suffecient. In other cases want to explicitly
    // call this.setState.
    if (displayFood) {
      this.targetFoodPosition = Math.floor(Math.random() * 3);
    }
    // random order of food in signs.
    const order = _.shuffle([0, 1, 2]);
    this.leftFood.character = this.foods[order[0]];
    this.middleFood.character = this.foods[order[1]];
    this.rightFood.character = this.foods[order[2]];
    this.leftFood.key = randomstring({length: 7});
    this.middleFood.key = randomstring({length: 7});
    this.rightFood.key = randomstring({length: 7});

    this.leftFood.coords = [coords.top, coords.leftLeft];
    this.middleFood.coords = [coords.top, coords.middleLeft];
    this.rightFood.coords = [coords.top, coords.rightLeft];
    if (setState) {
      this.setState({foodDisplayed: displayFood});
    }
  }

  foodDrop (food, starXY, endXY, duration) {
    this[food].tweenOptions = this.makeMoveTween(
      starXY, endXY, duration);
    this.setState({dropFood: true}, () => {
      this['refs'][food].startTween();
    });
  }

  foodPressed (foodId) {
    if (this.state.dropFood || !(foodId === this.targetFoodPosition)) {
      return;
    }
    console.log(`foodID =  ${foodId}`);
    debugger;
    const foodDropTime = 800;
    const coords = this.foodDisplayAtLocation();
    // this will depend on the character [left, top]
    const endLocation = [300, 540];
    switch (this.targetFoodPosition) {
      case LEFT:
        this.foodDrop('leftFood', [coords.leftLeft, 150], endLocation, foodDropTime);
        break;
      case MIDDLE:
        this.foodDrop('middleFood', [coords.middleLeft, 150], endLocation, foodDropTime);
        break;
      case RIGHT:
        this.foodDrop('rightFood', [coords.rightLeft, 150], endLocation, foodDropTime);
        break;
    }

    this.activeCharacter.loopAnimation = false;
    clearInterval(this.eatInterval);
    this.eatInterval = setInterval(() => {
      this.activeCharacter.loopAnimation = false;
      this.setState({
        dropFood: false,
        characterAnimationIndex: this.activeCharacter.animationIndex('EAT'),
      }, () => {
        this.liftSigns();
      });
      clearInterval(this.eatInterval);
    }, foodDropTime - 500);

  }

  liftSigns () {
    this.initializeMoveUpTweensForSignsAndFoods();

    const timeToExit = 2000;
    this.activeCharacter.tweenOptions = this.makeMoveTween([150, 400], [1280, 400], timeToExit);
    this.activeCharacter.loopAnimation = true;

    //hide foods
    const coords = this.foodDisplayAtLocation(-150);
    this.showFoods(coords, false, false);

    clearInterval(this.signInterval);
    this.signInterval = setInterval(() => {
      this.setState({
        characterAnimationIndex: this.activeCharacter.animationIndex('WALK'),
        signsVisable: false,
        foodDisplayed: false,
      }, () => {
        this.refs.leftSign.startTween();
        this.refs.middleSign.startTween();
        this.refs.rightSign.startTween();
        this.refs.characterRef.startTween();
        clearInterval(this.switchCharacterInterval)
        this.switchCharacterInterval = setInterval(() => {
          const characters = ['monster', 'dog', 'goat'];
          const indx = Math.floor(Math.random() * 3);
          this.loadCharacter(characters[indx]);
          clearInterval(this.switchCharacterInterval)
        }, timeToExit);
      });
      clearInterval(this.signInterval);
    }, 1500);
  }

  foodSize (food, dimension) {
    // scale to 120 x 120 or closest.
    const widthScale = 120/food.character.size.width;
    const heightScale = 120/food.character.size.height;
    const scale = widthScale > heightScale ? heightScale : widthScale;
    switch (dimension) {
      case 'width':
        return Math.floor((food.character.size.width * scale) * this.scale.image);
      case 'height':
        return Math.floor((food.character.size.height * scale) * this.scale.image);
    }
  }

  characterSize (character, dimension) {
    const widthScale = 300/character.size.width;
    const heightScale = 300/character.size.height;
    const scale = widthScale > heightScale ? heightScale : widthScale;
    switch (dimension) {
      case 'width':
        return Math.floor((character.size.width * scale) * this.scale.image);
      case 'height':
        return Math.floor((character.size.height * scale) * this.scale.image);
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Image source={require('../../media/backgrounds/Game_2_Background_1280.png')}
          style={styles.backgroundImage}
        />
        <AnimatedSprite
          character={lever}
          characterUID={this.characterUIDs.lever}
          animationFrameIndex={[0]}
          loopAnimation={false}
          coordinates={{
            top: 240 * this.scale.screenHeight,
            left: 1080 * this.scale.screenWidth }}
          size={{ width: lever.size.width * this.scale.image,
            height: lever.size.height * this.scale.image}}
          rotate={[{rotateY:'180deg'}]}
          onPress={() => this.leverPress()}
          onPressIn={() => this.leverPressIn()}
          onPressOut={() => this.leverPressOut()}
        />

        <AnimatedSprite
          character={sign}
          ref={'leftSign'}
          animationFrameIndex={[0]}
          coordinates={{top: -300 * this.scale.screenHeight,
            left: 350 * this.scale.screenWidth}}
          size={{width: sign.size.width * this.scale.image,
            height: sign.size.height * this.scale.image
          }}
          draggable={false}
          tweenOptions={this.leftSign.tweenOptions}
          tweenStart={'fromCode'}
        />

        <AnimatedSprite
          character={sign}
          ref={'middleSign'}
          animationFrameIndex={[0]}
          coordinates={{top: -300 * this.scale.screenHeight,
            left: 550 * this.scale.screenWidth}}
          size={{width: sign.size.width * this.scale.image,
            height: sign.size.height * this.scale.image
          }}
          draggable={false}
          tweenOptions={this.middleSign.tweenOptions}
          tweenStart={'fromCode'}
        />

        <AnimatedSprite
          character={sign}
          ref={'rightSign'}
          animationFrameIndex={[0]}
          coordinates={{top: -300 * this.scale.screenHeight,
            left: 750 * this.scale.screenWidth}}
          size={{width: sign.size.width * this.scale.image,
            height: sign.size.height * this.scale.image
          }}
          draggable={false}
          tweenOptions={this.rightSign.tweenOptions}
          tweenStart={'fromCode'}
        />

        {this.leftFood.character ?
          <AnimatedSprite
            character={this.leftFood.character}
            ref={'leftFood'}
            key={this.leftFood.key}
            animationFrameIndex={[0]}
            coordinates={{
              top: this.leftFood.coords[0],
              left: this.leftFood.coords[1]
            }}
            size={{
              width: this.foodSize(this.leftFood, 'width'),
              height: this.foodSize(this.leftFood, 'height'),
            }}
            draggable={false}
            tweenOptions={this.leftFood.tweenOptions}
            tweenStart={'fromCode'}
            onPress={() => this.foodPressed(LEFT)}
          />
        : null}

        {this.middleFood.character ?
          <AnimatedSprite
            character={this.middleFood.character}
            ref={'middleFood'}
            key={this.middleFood.key}
            animationFrameIndex={[0]}
            coordinates={{
              top: this.middleFood.coords[0],
              left: this.middleFood.coords[1]}}
            size={{
              width: this.foodSize(this.middleFood, 'width') ,
              height: this.foodSize(this.middleFood, 'height'),
            }}
            draggable={false}
            tweenOptions={this.middleFood.tweenOptions}
            tweenStart={'fromCode'}
            onPress={() => this.foodPressed(MIDDLE)}
          />
        : null}

        {this.rightFood.character ?
          <AnimatedSprite
            character={this.rightFood.character}
            ref={'rightFood'}
            key={this.rightFood.key}
            animationFrameIndex={[0]}
            coordinates={{
              top: this.rightFood.coords[0],
              left: this.rightFood.coords[1]}}
            size={{
              width: this.foodSize(this.rightFood, 'width'),
              height: this.foodSize(this.rightFood, 'height'),
            }}
            draggable={false}
            tweenOptions={this.rightFood.tweenOptions}
            tweenStart={'fromCode'}
            onPress={() => this.foodPressed(RIGHT)}
          />
        : null}

        <AnimatedSprite
          ref={'characterRef'}
          character={this.state.character}
          characterUID={this.characterUIDs.character}
          key={this.characterUIDs.character}
          style={{opacity: 1}}
          animationFrameIndex={this.state.characterAnimationIndex}
          loopAnimation={this.activeCharacter.loopAnimation}
          coordinates={{
            top: this.activeCharacter.coords.top,
            left: this.activeCharacter.coords.left,
          }}
          size={{
            width: this.characterSize(this.activeCharacter, 'width'),
            height: this.characterSize(this.activeCharacter, 'height')
          }}
          rotate={this.activeCharacter.rotate}
          tweenOptions={this.activeCharacter.tweenOptions}
          tweenStart={'fromCode'}
          onTweenFinish={(characterUID) => this.onCharacterTweenFinish(characterUID)}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  // styles for background png image/basic black backgroundColor
  // to go behind it
  container: {
      flex: 1,
      backgroundColor: 'black',
  },
  backgroundImage: {
      flex: 1,
      width: null,
      height: null,
  },
});

MatchByColorGame.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};

reactMixin.onClass(MatchByColorGame, TimerMixin);

export default MatchByColorGame;
