import React from 'react';
import {
  View,
  Image,
} from 'react-native';

import _ from 'lodash';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import styles from './styles';
import AnimatedSprite from '../../components/AnimatedSprite/AnimatedSprite';
import HomeButton from '../../components/HomeButton/HomeButton';
import monsterSprite from '../../sprites/monster/monsterCharacter';
import Matrix from '../../components/Matrix';

import symbolTable from '../../sprites/symbolTable/symbolTableCharacter';
import Signs from './Signs';
import gameUtil from './gameUtil';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

class SymbolDigitCodingGame extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      level: 1,
      trial: 1,
      symbolOrder: [],
      showFood: false,
      monsterAnimationIndex: [0],
      selectionTiles: {},
    };
    this.monsterScale = 1.5;
    this.tableScale = 1.3;
    this.food = {
      sprite : {},
      tweenOptions: {},
      coords: {},
      size: {},
    };
  }

  componentWillMount () {
    const level = 1;
    const trial = 1;

    this.food.sprite = gameUtil.foodSprite(level, trial);
    this.food.coords = this.foodStartLocation(1);
    this.food.size = this.spriteSize(this.food.sprite, 1);
    const tiles = gameUtil.selectionTilesForTrial(1,1);
    debugger;
    this.setState({
      level,
      trial,
      tweenOptions: this.makeFoodTweenObject(),
      symbolOrder: gameUtil.symbols(level, trial),
      selectionTiles: gameUtil.selectionTilesForTrial(level, trial),
    });
  }

  componentDidMount () {}

  componentWillUnmount () {
    clearTimeout(this.stateTimeout);
  }

  monsterMouthLocation () {
    const size = this.spriteSize(monsterSprite, this.monsterScale);
    const loc = this.monsterStartLocation();
    const top = loc.top + size.height * 0.4;
    const left = loc.left + size.width * 0.5;
    return {
      top,
      left,
    };
  }

  makeFoodTweenObject () {
    const mouthLocation = this.monsterMouthLocation();
    return {
      tweenType: "linear-move",
      startXY: [this.food.coords.left, this.food.coords.top],
      endXY: [mouthLocation.left, mouthLocation.top],
      duration: 1000,
      loop: false,
    };
  }

  foodStartLocation (position) {
    console.log(`food position = ${position}`);
    const scaleWidth = this.props.scale.screenWidth;
    const top = 100 * this.props.scale.screenHeight;
    const baseLeft = 320;
    switch (position) {
      case 0:
        return {top, left: baseLeft * scaleWidth};
      case 1:
        return {top, left: (baseLeft + 200) * scaleWidth};
      case 2:
        return {top, left: (baseLeft + 400) * scaleWidth};
      case 3:
        return {top, left: (baseLeft + 600) * scaleWidth};
    }

    return {top, left: baseLeft * this.props.scale.screenWidth};
  }

  spriteSize (sprite, scale) {
    const scaleBy = scale * this.props.scale.image;
    return _.mapValues(sprite.size, (val) => val * scaleBy);
  }

  monsterStartLocation () {
    const height = this.spriteSize(monsterSprite, this.monsterScale).height;
    const left = 150 * this.props.scale.screenWidth;
    const top = SCREEN_HEIGHT - height - (50 * this.props.scale.screenHeight);
    return {top, left};
  }

  tableLocation () {
    const size = this.spriteSize(symbolTable, this.tableScale);
    const left = SCREEN_WIDTH - size.width - (40 * this.props.scale.screenWidth);
    const top = SCREEN_HEIGHT - size.height - (160 * this.props.scale.screenHeight);
    return {top, left};
  }

  foodFall (item) {
    this.food.coords = this.foodStartLocation(item);
    this.setState({
      showFood: true,
      tweenOptions: this.makeFoodTweenObject(),
      },
    () => {
      this.refs.food.startTween();
      this.stateTimeout = setTimeout(() => {
        this.setState({ monsterAnimationIndex: monsterSprite.animationIndex('EAT') });
      }, 500 * this.props.scale.screenHeight);
    });
  }

  nextTrial () {
    const level = this.state.level;
    const trial = this.state.trial + 1;
    const symbolOrder = gameUtil.symbols(level, trial);
    this.food.sprite = gameUtil.foodSprite(level, trial);
    this.setState({
      level,
      trial,
      symbolOrder: symbolOrder,
      selectionTiles: gameUtil.selectionTilesForTrial(level, trial),
    });
  }

  signPressed (signInfo) {
    const correctSymbol = gameUtil.correctSymbol(this.state.level, this.state.trial);
    if (_.isEqual(correctSymbol, signInfo.symbol)) {
      const symbolOrder = gameUtil.symbols(this.state.level, this.state.trial);
      const showSymbols = _.map(symbolOrder, (symbol) => (
        _.isEqual(correctSymbol, symbol) ? 'BLANK' : symbol
      ));
      // start food fall, monster eat and celebrate
      this.setState({
        symbolOrder: showSymbols,
      }, () => {
        this.stateTimeout = setTimeout(() => {
          this.foodFall(signInfo.signNumber);
        }, 120);

      });
    } else {
      this.setState({
        monsterAnimationIndex: monsterSprite.animationIndex('DISGUST'),
        resetTrial: true,
      }, () => {
        this.stateTimeout = setTimeout(() => {
          this.nextTrial();
        }, 500)
      });
    }
  }

  onFoodTweenFinish () {
    this.setState({
      showFood: false,
    }, () => {
      this.nextTrial();
    });
  }

  cloudStyle () {
    const width = 193 * 1.5 * this.props.scale.image;
    const height =  135 * 1.5 * this.props.scale.image;
    const top = this.monsterStartLocation().top - (height * 0.6);
    const left = this.monsterStartLocation().left - (width * 0.45);

    return {
      width,
      height,
      top,
      left,
      position: 'absolute',
    };
  }

  matrixStyle () {
    const cloudStyle = this.cloudStyle();
    return {
      width: 200,
      height: 100,
      top: cloudStyle.top + 30 * this.props.scale.screenHeight,
      left: cloudStyle.left + 40 * this.props.scale.screenWidth,
      position: 'absolute',
    };
  }

  render () {
    return (
      <View style={styles.container}>
        <Image source={require('../../media/backgrounds/Game_6_Background_1280.png')}
          style={{width: 1280 * this.props.scale.screenWidth,
          height: 800 * this.props.scale.screenHeight, flex: 1}}
        />
        <View style={{
            top: 0, left: 280,
            width: 780 * this.props.scale.screenWidth,
            height: 300 * this.props.scale.screenHeight,
            position: 'absolute',
          }}>

          <Signs
            symbolOrder={this.state.symbolOrder}
            scale={this.props.scale}
            onPress={(signInfo) => this.signPressed(signInfo)}
          />
        </View>

        {this.state.showFood ?
          <AnimatedSprite
            character={this.food.sprite}
            ref={'food'}
            animationFrameIndex={[0]}
            coordinates={this.food.coords}
            size={this.food.size}
            draggable={false}
            tweenOptions={this.state.tweenOptions}
            tweenStart={'fromCode'}
            onTweenFinish={() => this.onFoodTweenFinish()}
          />
        : null}

        <Image source={require('../../sprites/thoughtBubble/thought_bubble.png')}
          style={this.cloudStyle()}
        />

        <Matrix
          styles={this.matrixStyle()}
          tileScale={0.25}
          tiles={this.state.selectionTiles}
          scale={this.props.scale}
        />

        <AnimatedSprite
          character={monsterSprite}
          characterUID={'sasdkfja'}
          animationFrameIndex={this.state.monsterAnimationIndex}
          loopAnimation={false}
          tweenOptions={{}}
          tweenStart={'fromCode'}
          coordinates={this.monsterStartLocation()}
          size={this.spriteSize(monsterSprite, this.monsterScale)}
          rotate={[{rotateY:'180deg'}]}
        />

        <AnimatedSprite
          character={symbolTable}
          characterUID={randomstring({ length: 7})}
          animationFrameIndex={[0]}
          loopAnimation={false}
          tweenOptions={{}}
          tweenStart={'fromCode'}
          coordinates={this.tableLocation()}
          size={this.spriteSize(symbolTable, this.tableScale)}
          rotate={[{rotateY:'0deg'}]}
        />

        <HomeButton
          route={this.props.route}
          navigator={this.props.navigator}
          routeId={{ id: 'Main' }}
          styles={{
            width: 150 * this.props.scale.image,
            height: 150 * this.props.scale.image,
            top:0, left: 0, position: 'absolute' }}
        />
      </View>
    );
  }

}

SymbolDigitCodingGame.propTypes = {
  route: React.PropTypes.object.isRequired,
  navigator: React.PropTypes.object.isRequired,
  scale: React.PropTypes.object.isRequired,
};

reactMixin.onClass(SymbolDigitCodingGame, TimerMixin);

export default SymbolDigitCodingGame;
