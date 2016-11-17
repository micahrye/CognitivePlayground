import React from 'react';
import {
  TouchableOpacity,
  Image,
  View,
} from 'react-native';

import _ from 'lodash';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from '../AnimatedSprite/AnimatedSprite';

// props
import lever from '../../sprites/lever/leverCharacter';
import sign from '../../sprites/sign/signCharacter';
// game character related utils
import gameUtil from './gameUtil';
// styles
import styles from './styles';

const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;
const TRIAL_TIMEOUT = 5000;

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
      level: 1,
    };
    this.scale = this.props.scale;
    this.activeCharacter;
    !this.foodActive;

    this.leftSign = {tweenOptions: {}};
    this.middleSign = {tweenOptions: {}};
    this.rightSign = {tweenOptions: {}};
    this.leftFood = {tweenOptions: {}};
    this.middleFood = {tweenOptions: {}};
    this.rightFood = {tweenOptions: {}};
    this.waitForFoodAt = [150 * this.scale.screenWidth,
      400 * this.scale.screenHeight];

    this.baseFoodLocation = [150, 400];
    this.foodLeftShift = 200;
    this.foodTargetLocation = [300, 550];
    this.targetFoodPosition;
    this.signDropTime = 1500 * this.props.scale.screenHeight;

    this.eatTimeout;
    this.signInterval;
    this.trialTimer;
    this.clearingScene = false;
  }

  componentWillMount () {
    this.characterUIDs = {
      lever: randomstring({ length: 7 }),
    };

    const name = gameUtil.getValidCharacterNameForLevel(this.state.level);
    this.loadCharacter(name);
    // set offscreen
    const coords = this.foodSignDisplayLocations(-150);
    this.leftFood.coords = [coords.top, coords.leftLeft];
    this.middleFood.coords = [coords.top, coords.middleLeft];
    this.rightFood.coords = [coords.top, coords.rightLeft];
  }

  componentDidMount () {

  }

  componentWillUnmount () {
    clearTimeout(this.setDefaultAnimationState);
    clearTimeout(this.eatTimeout);
    clearTimeout(this.switchCharacterTimeout);
  }

  /**
   * used to load character image frames off screen so that image
   * frames are in memory.
   */
  loadCharacter (characterName) {
    // get character
    this.characterUIDs.character = randomstring({ length: 7 });
    this.activeCharacter = gameUtil.getCharacterObject(characterName);
    // want to load character offscreen
    this.activeCharacter.coords = {
      top: 400 * this.scale.screenHeight * this.scale.screenHeight,
      left: -330 * this.scale.screenWidth * this.scale.screenWidth,
    };
    this.activeCharacter.tweenOptions = {tweenOptions: {}};
    this.setState({
      character: this.activeCharacter,
      characterAnimationIndex: this.activeCharacter.animationIndex('ALL'),
      loadingCharacter: true,
      characterAnimationLoop: false,
    }, () => {
      clearTimeout(this.setDefaultAnimationState);
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
    switch (characterUID) {
      case this.characterUIDs.character:
        console.log('onCharacterTweenFinish IDLE')
        this.setState({
          characterAnimationIndex: this.activeCharacter.animationIndex('IDLE'),
          characterAnimationLoop: false,
        });
        break;
    }
  }

  onFoodTweenFinish (foodCharacter) {
    console.log(`onFoodTweenFinish, food = ${foodCharacter}`);
    switch (foodCharacter) {
      case LEFT:
        this.leftFood.character = null;
        break;
      case MIDDLE:
        this.middleFood.character = null;
        break;
      case RIGHT:
        this.rightFood.character = null;
        break;
    }
    this.setState({});
  }

  foodSignDisplayLocations (top = 140, left = 400, shift = 200) {
    return {
      top: top * this.scale.screenHeight,
      leftLeft: left * this.scale.screenWidth,
      middleLeft: (left + shift) * this.scale.screenWidth,
      rightLeft: (left + 2 * shift) * this.scale.screenWidth,
    };
  }

  signDropTween () {
    return {
      tweenType: "bounce-drop",
      startY: -300,
      endY: -10 * this.props.scale.screenHeight,
      duration: this.signDropTime,
      repeatable: false,
      loop: false,
    };
  }

  initializeSignsDropTween () {
    this.leftSign.tweenOptions = this.signDropTween();
    this.middleSign.tweenOptions = this.signDropTween();
    this.rightSign.tweenOptions = this.signDropTween();
  }

  initializeMoveUpTweensForSignsAndFoods () {
    this.leftSign.tweenOptions = this.makeMoveTween([350, 0], [350, -300], 800);
    this.middleSign.tweenOptions = this.makeMoveTween([550, 0], [550, -300], 800);
    this.rightSign.tweenOptions = this.makeMoveTween([750, 0], [750, -300], 800);
  }

  startSignsTween (level) {
    switch (level) {
      case 1:
      case 2:
        this.refs.leftSign.startTween();
        this.refs.middleSign.startTween();
        // this.refs.rightSign.startTween();
        break;
      case 3:
        this.refs.leftSign.startTween();
        this.refs.middleSign.startTween();
        this.refs.rightSign.startTween();
        break;
    }
  }
  startTrialTimer () {
    clearTimeout(this.trialTimer);
    this.trialTimer = setTimeout(()=>{
      this.clearScene();
    }, TRIAL_TIMEOUT);
  }

  leverPressIn () {
    // console.log('leverPressIn');
  }

  leverPress () {
    if (this.state.loadingCharacter
      || this.state.signsVisable || this.clearingScene) {
      return;
    }
    clearTimeout(this.trialTimer);
    // creature enter from left
    const moveFrom = [-300, 400];
    const moveTo = this.waitForFoodAt;
    this.activeCharacter.tweenOptions = this.makeMoveTween(moveFrom, moveTo);

    this.initializeSignsDropTween();

    this.setState({
      characterAnimationIndex: this.activeCharacter.animationIndex('WALK'),
      signsVisable: true,
      characterAnimationLoop: true,
    }, () => {
      this.startSignsTween(this.state.level);
      this.refs.characterRef.startTween();
      // then interval to make food appear on sign.
      clearTimeout(this.showFoodInterval);
      this.showFoodInterval = setTimeout(() => {
        const coords = this.foodSignDisplayLocations();
        this.showFoods(coords, true, this.activeCharacter.name);
        this.foodActive = true;
        this.startTrialTimer();
      }, this.signDropTime);
    });
  }

  leverPressOut () {
    // console.log('leverPressOut');
  }

  showFoods (coords, displayFood, setState = true) {
    // can be case that this.setState is beeing called and setting
    // food key and location is suffecient. In other cases want to explicitly
    // call this.setState.
    const foods = gameUtil.getFoodsToDisplay(this.activeCharacter.name);
    const foodPref = gameUtil.favoriteFood(this.activeCharacter.name);
    const targetFoodIndex = _.findIndex(foods, (food) => food.name === foodPref);
    const numFoods = this.state.level === 3 ? 3 : 2;
    let order = _.shuffle([0, 1, 2]);
    if (this.state.level < 3) {
      const index = _([0, 1, 2]).difference([targetFoodIndex]).shuffle().value().pop();
      order = _.shuffle([index, targetFoodIndex]);
    } else {
      order = _.shuffle([0, 1, 2]);
    }
    this.targetFoodPosition = _.findIndex(order, (val) => val === targetFoodIndex);
    this.leftFood.character = foods[order[0]];
    this.middleFood.character = foods[order[1]];

    this.leftFood.key = randomstring({length: 7});
    this.middleFood.key = randomstring({length: 7});
    // only set those foods that will show.
    this.leftFood.coords = [coords.top, coords.leftLeft];
    this.middleFood.coords = [coords.top, coords.middleLeft];
    if (numFoods === 3) {
      this.rightFood.coords = [coords.top, coords.rightLeft];
      this.rightFood.character = foods[order[2]];
      this.rightFood.key = randomstring({length: 7});
    }
    if (setState) {
      console.log('showFoods setState');
      this.setState({foodDisplayed: displayFood});
    }
  }

  foodDropToCharacter (food, foodStartLocation, dropTimeDuration) {
    // get the x,y of mout location withing image
    const mouthLocation = gameUtil.characterMouthLocation(this.refs.characterRef);
    const endCoords = [(this.waitForFoodAt[0] + mouthLocation[1]), (this.waitForFoodAt[1] + mouthLocation[0])];
    console.log(`coords[0] = ${endCoords[0]}, coords[1] = ${endCoords[1]}`);
    debugger;
    this.foodDrop(food, foodStartLocation, endCoords, dropTimeDuration);
  }

  // food drop then creature eat.
  foodDrop (food, starXY, endXY, duration) {
    this.foodActive = false;
    this[food].tweenOptions = this.makeMoveTween(
      starXY, endXY, duration);
    this.setState({dropFood: true}, () => {
      this['refs'][food].startTween();
    });
    const waitToEatTime = duration - gameUtil.startEatingPriorToFoodDropEnd(this.activeCharacter.name);
    const joyfulEatingIndex = _.concat(
      this.activeCharacter.animationIndex('EAT'),
      this.activeCharacter.animationIndex('CELEBRATE')
    );
    clearTimeout(this.eatTimeout);
    this.eatTimeout = setTimeout(() => {
      this.setState({
        dropFood: false,
        characterAnimationIndex: joyfulEatingIndex,
        characterAnimationLoop: false,
      }, () => {
        this.eatTimeout = setTimeout(() => {
          this.clearScene();
        }, 500);
      });
    }, waitToEatTime);

  }

  foodEndLocation (activeCharacter) {
    switch (activeCharacter.name) {
      case 'monster':
        return [300 * this.scale.screenWidth, 540 * this.scale.screenHeight];
      case 'goat':
        return [300 * this.scale.screenWidth, 540 * this.scale.screenHeight];
      case 'dog':
        return [300 * this.scale.screenWidth, 540 * this.scale.screenHeight];
    }
  }

  unhappyAndLeaving () {
    this.foodActive = false;
    const unhappy = _.concat(
      this.activeCharacter.animationIndex('DISGUST'),
      this.activeCharacter.animationIndex('DISGUST')
    );
    this.setState({
      dropFood: false,
      characterAnimationIndex: unhappy,
      characterAnimationLoop: false,
    }, () => {
      clearTimeout(this.eatTimeout);
      this.eatTimeout = setTimeout(() => {
        this.clearScene();
      }, 500);
    });
  }

  foodPressed (foodId) {
    if (this.state.dropFood || !this.foodActive || this.clearingScene) {
      return;
    }
    if (!(foodId === this.targetFoodPosition)) {
      this.unhappyAndLeaving();
      return;
    }
    clearTimeout(this.trialTimer);

    const foodDropTime = 800;
    const coords = this.foodSignDisplayLocations();
    let foodCoord;
    switch (this.targetFoodPosition) {
      case LEFT:
        foodCoord = [coords.leftLeft, 150];
        this.foodDropToCharacter('leftFood', foodCoord, foodDropTime);
        break;
      case MIDDLE:
        foodCoord = [coords.middleLeft, 150];
        this.foodDropToCharacter('middleFood', foodCoord, foodDropTime);
        break;
      case RIGHT:
        foodCoord = [coords.rightLeft, 150];
        this.foodDropToCharacter('rightFood', foodCoord, foodDropTime);
        break;
    }
  }

  clearScene () {
    this.clearingScene = true;
    clearTimeout(this.trialTimer);
    this.initializeMoveUpTweensForSignsAndFoods();

    const timeToExit = 2000;
    this.activeCharacter.tweenOptions = this.makeMoveTween([150, 400], [1280, 400], timeToExit);

    //hide foods
    const coords = this.foodSignDisplayLocations(-150);
    this.showFoods(coords, false, false);

    clearTimeout(this.signInterval);
    this.signInterval = setTimeout(() => {
      this.setState({
        characterAnimationIndex: this.activeCharacter.animationIndex('WALK'),
        signsVisable: false,
        foodDisplayed: false,
        characterAnimationLoop: true,
      }, () => {
        this.startSignsTween(this.state.level);
        this.refs.characterRef.startTween();
        clearTimeout(this.switchCharacterTimeout);
        this.switchCharacterTimeout = setTimeout(() => {
          this.clearingScene = false;
          const name = gameUtil.getValidCharacterNameForLevel(this.state.level);
          this.loadCharacter(name);
        }, timeToExit);
      });
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

  homeBtnPressed () {
    this.props.navigator.replace({ id: 'Main' });
  }

  render () {
    console.log('MatchByColor Render');
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
            height: sign.size.height * this.scale.image,
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
            height: sign.size.height * this.scale.image,
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
            height: sign.size.height * this.scale.image,
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
              left: this.leftFood.coords[1],
            }}
            size={{
              width: this.foodSize(this.leftFood, 'width'),
              height: this.foodSize(this.leftFood, 'height'),
            }}
            draggable={false}
            tweenOptions={this.leftFood.tweenOptions}
            tweenStart={'fromCode'}
            onPress={() => this.foodPressed(LEFT)}
            onTweenFinish={() => this.onFoodTweenFinish(LEFT)}
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
            onTweenFinish={() => this.onFoodTweenFinish(MIDDLE)}
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
            onTweenFinish={(ref) => this.onFoodTweenFinish(RIGHT)}
          />
        : null}

        <AnimatedSprite
          ref={'characterRef'}
          character={this.state.character}
          characterUID={this.characterUIDs.character}
          key={this.characterUIDs.character}
          style={{opacity: 1}}
          animationFrameIndex={this.state.characterAnimationIndex}
          loopAnimation={this.state.characterAnimationLoop}
          coordinates={{
            top: this.activeCharacter.coords.top,
            left: this.activeCharacter.coords.left,
          }}
          size={{
            width: this.characterSize(this.activeCharacter, 'width'),
            height: this.characterSize(this.activeCharacter, 'height'),
          }}
          rotate={this.activeCharacter.rotate}
          tweenOptions={this.activeCharacter.tweenOptions}
          tweenStart={'fromCode'}
          onTweenFinish={(characterUID) => this.onCharacterTweenFinish(characterUID)}
        />

        <TouchableOpacity
          activeOpacity={1.0}
          style={{width: 150,
            height: 150,
            top:0, left: 0,
            position: 'absolute',
          }}
          onPress={() => this.homeBtnPressed()}>
          <Image
            source={require('../../media/icons/home_btn.png')}
            style={{width: 150,
              height: 150,
            }}
          />
        </TouchableOpacity>

      </View>
    );
  }
}

MatchByColorGame.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};

reactMixin.onClass(MatchByColorGame, TimerMixin);

export default MatchByColorGame;
