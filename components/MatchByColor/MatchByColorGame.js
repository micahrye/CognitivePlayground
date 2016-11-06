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
// game characters
import monsterCharacter from '../../sprites/monster/monsterCharacter';
import goatLiteCharacter from '../../sprites/goat/goatCharacter';
import dogCharacter from '../../sprites/dog/dogCharacter';
// foods
import appleCharacter from "../../sprites/apple/appleCharacter";
import grassCharacter from "../../sprites/grass/grassCharacter";
import canCharacter from "../../sprites/can/canCharacter";
import bugfoodCharacter from "../../sprites/bugfood/bugfoodCharacter";
// props
import lever from '../../sprites/lever/leverCharacter';
import signCharacter from '../../sprites/sign/signCharacter';
// utils
import { omnivoreUtils as monsterUtils } from './omnivoreUtils';

const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;

class MatchByColorGame extends React.Component {

  constructor (props) {
    super(props);
    // customizable function for dropping food/signs into the frame
    this.state = {
      monsterAnimationIndex: [0],
      goatAnimationIndex: [0],
      mammalAnimationIndex: [0],
      tweenCharacter: false,
      loadContent: false,
      dropFood: false,
      signsVisable: false,
      foodDisplayed: false,
    };

    this.monster = {tweenOptions: {}};
    this.goat = {tweenOptions: {}};
    this.mammal = {tweenOptions: {}};
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
      monster: randomstring({ length: 7 }),
      goat: randomstring({ length: 7 }),
      mammal: randomstring({ length: 7 }),
    };
    this.setState({
      monsterAnimationIndex: [0,1,2,3,4,5,6,7],
      goatAnimationIndex: [0,1,2,3,4,5,6,7],
      mammalAnimationIndex: [0,1,2,3,4,5,6],
      loadContent: true,
    }, () => {

    });
    this.setDefaultAnimationState = setTimeout(() => {
      this.setState({
        monsterAnimationIndex: [0],
        goatAnimationIndex: [0],
        mammalAnimationIndex: [0],
        loadContent: false,
      });
    }, 2000);

    // set offscreen
    const coords = this.foodDisplayAtLocation(-150);
    this.leftFood.coords = [coords.top, coords.leftLeft];
    this.middleFood.coords = [coords.top, coords.middleLeft];
    this.rightFood.coords = [coords.top, coords.rightLeft];
  }

  componentDidMount () {

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

  onTweenFinish (characterUID) {
    switch (characterUID) {
      case this.characterUIDs.monster:
        this.setState({monsterAnimationIndex: monsterUtils.normalIndx});
        break;
    }
  }

  onCharacterTweenFinish (characterUID) {
    switch (characterUID) {
      case this.characterUIDs.monster:
      //  this.monster.loopAnimation = false;
        this.setState({monsterAnimationIndex: monsterUtils.normalIndx});
        break;
    }
  }

  leverPressIn () {
    // console.warn('leverPressIn');
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

  leverPress () {
    if (this.state.loadContent || this.state.signsVisable) {
      return;
    }

    // creature enter from left
    this.monster.tweenOptions = this.makeMoveTween([-300, 400], [150, 400]);
    // this.goat.tweenOptions = this.makeMoveTween([-300, 400], [150, 400]);

    this.initializeMoveDownTweensForSignsAndFoods();

    this.monster.loopAnimation = true;
    // this.goat.loopAnimation = true;

    this.setState({
      monsterAnimationIndex: monsterUtils.walkIndx,
      tweenCharacter: true,
      signsVisable: true},
      () => {
        this.refs.leftSign.startTween();
        this.refs.middleSign.startTween();
        this.refs.rightSign.startTween();
        this.refs.monsterRef.startTween();
        // then interval to make food appear on sign.
        clearInterval(this.showFoodInterval);
        this.showFoodInterval = setInterval(() => {
          const coords = this.foodDisplayAtLocation();
          this.showFoods(coords, true);
          clearInterval(this.showFoodInterval)
        }, 1000);
      });
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

  leverPressOut () {
    // console.warn('leverPressOut');
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

    clearInterval(this.eatInterval);
    this.eatInterval = setInterval(() => {
      this.monster.loopAnimation = false;
      // this.goat.loopAnimation = false;
      this.setState({
        dropFood: false,
        monsterAnimationIndex: monsterUtils.eatIndx,
      }, () => {
        this.liftSigns();
      });
      clearInterval(this.eatInterval);
    }, foodDropTime - 500);

  }

  liftSigns () {
    this.initializeMoveUpTweensForSignsAndFoods();

    this.monster.tweenOptions = this.makeMoveTween([150, 400], [1280, 400], 2000);
    this.monster.loopAnimation = true;

    // this.goat.tweenOptions = this.makeMoveTween([150, 400], [1280, 400], 2000);
    // this.goat.loopAnimation = true;
    const coords = this.foodDisplayAtLocation(-150);
    this.showFoods(coords, false, false);
    clearInterval(this.signInterval);
    this.signInterval = setInterval(() => {
      this.setState({
        monsterAnimationIndex: monsterUtils.walkIndx,
        tweenCharacter: true,
        signsVisable: false,
        foodDisplayed: false,
      }, () => {
        this.refs.leftSign.startTween();
        this.refs.middleSign.startTween();
        this.refs.rightSign.startTween();
        this.refs.monsterRef.startTween();
      });
      clearInterval(this.signInterval);
    }, 1500);
  }

  render () {
    // console.warn('width = ', this.scale.screenWidth);
    // console.warn('height = ', this.scale.screenHeight);
    return (
      <View style={styles.container}>
        <Image source={require('../../media/backgrounds/Game_2_Background_1280.png')}
          style={styles.backgroundImage}>

          <AnimatedSprite
            character={lever}
            characterUID={this.characterUIDs.lever}
            animationFrameIndex={[0]}
            loopAnimation={false}
            coordinates={{
              top: 240 * this.scale.screenHeight,
              left: 1080 * this.scale.screenWidth }}
            size={{ width: Math.floor(213 * this.scale.image),
              height: Math.floor(189 * this.scale.image)}}
            rotate={[{rotateY:'180deg'}]}
            onPress={() => this.leverPress()}
            onPressIn={() => this.leverPressIn()}
            onPressOut={() => this.leverPressOut()}
          />

          <AnimatedSprite
            character={signCharacter}
            ref={'leftSign'}
            animationFrameIndex={[0]}
            coordinates={{top: -300 * this.scale.screenHeight,
              left: 350 * this.scale.screenWidth}}
            size={{width: 188 * this.scale.image,
              height: 300 * this.scale.image}}
            draggable={false}
            tweenOptions={this.leftSign.tweenOptions}
            tweenStart={'fromCode'}
          />

          <AnimatedSprite
            character={signCharacter}
            ref={'middleSign'}
            animationFrameIndex={[0]}
            coordinates={{top: -300 * this.scale.screenHeight,
              left: 550 * this.scale.screenWidth}}
            size={{width: 188 * this.scale.image,
              height: 300 * this.scale.image}}
            draggable={false}
            tweenOptions={this.middleSign.tweenOptions}
            tweenStart={'fromCode'}
          />

          <AnimatedSprite
            character={signCharacter}
            ref={'rightSign'}
            animationFrameIndex={[0]}
            coordinates={{top: -300 * this.scale.screenHeight,
              left: 750 * this.scale.screenWidth}}
            size={{width: 188 * this.scale.image,
              height: 300 * this.scale.image}}
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
                left: this.leftFood.coords[1]}}
              size={{width: 100 * this.scale.image,
                height: 108 * this.scale.image}}
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
              size={{width: 120 * this.scale.image,
                height: 120 * this.scale.image}}
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
                size={{width: 120 * this.scale.image,
                  height: 120 * this.scale.image}}
              draggable={false}
              tweenOptions={this.rightFood.tweenOptions}
              tweenStart={'fromCode'}
              onPress={() => this.foodPressed(RIGHT)}
            />
          : null}

          <AnimatedSprite
            ref={'monsterRef'}
            character={monsterCharacter}
            characterUID={this.characterUIDs.monster}
            style={{opacity: 1}}
            animationFrameIndex={this.state.monsterAnimationIndex}
            loopAnimation={this.monster.loopAnimation}
            coordinates={{top: 400 * this.scale.screenHeight,
              left: -330 * this.scale.screenWidth}}
            size={{ width: 330 * this.scale.image,
              height: 330 * this.scale.image}}
            rotate={[{rotateY:'180deg'}]}
            tweenOptions={this.monster.tweenOptions}
            tweenStart={'fromCode'}
            onTweenFinish={(characterUID) => this.onCharacterTweenFinish(characterUID)}
          />

          <AnimatedSprite
            ref={'goatRef'}
            character={goatLiteCharacter}
            characterUID={this.characterUIDs.goat}
            style={{opacity: 1}}
            animationFrameIndex={this.state.goatAnimationIndex}
            loopAnimation={this.goat.loopAnimation}
            coordinates={{top: 420, left: -300 }}
            size={{ width: 300,height: 252 }}
            tweenOptions={this.goat.tweenOptions}
            tweenStart={'fromCode'}
            onTweenFinish={(characterUID) => this.onTweenFinish(characterUID)}
          />

        </Image>
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
