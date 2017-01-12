import React from 'react';
import {View, Image} from 'react-native';

import _ from 'lodash';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';
import styles from './styles';

import HomeButton from '../../components/HomeButton/HomeButton';
import AnimatedSprite from '../../components/AnimatedSprite/AnimatedSprite';
import dogSprite from '../../sprites/dog/dogCharacter';
import Matrix from '../../components/Matrix';

import gameTiles from './gameTiles';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const LEFT_EDGE = 150;

class MatrixReasoningGame extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectionTiles: {},
      gameBoardTiles: {},
      level: 1,
      trial: 1,
      dog: {
        frameIndex: [0],
      },

    };
    // gameBoardTiles = {
    //   sprite,
    //   frames,
    //   active,
    // }
    this.gameCharacters = ['dog', 'hookedCard'];
    this.characterUIDs = this.makeCharacterUIDs(this.gameCharacters);
  }

  loadCharacter () {
    let dog = _.cloneDeep(this.state.dog);
    dog.frameIndex = _.concat(
      dogSprite.animationIndex('ALL'),
      dogSprite.animationIndex('IDLE')
    );
    this.setState({ dog });
  }

  componentWillMount () {
    this.readyTrial(1, 1);
    this.loadCharacter();
  }

  componentDidMount () {}

  makeCharacterUIDs () {
    return _.zipObject(this.gameCharacters,
      _.map(this.gameCharacters, ()=> randomstring({ length: 7 })));
  }

  spriteSize (sprite, scale) {
    return _.mapValues(sprite.size, (val) => val * scale);
  }

  dogSize (dogScale = 1.25) {
    return this.spriteSize(dogSprite, dogScale * this.props.scale.image);
  }

  dogStartLocation () {
    const size = this.dogSize();
    const left = LEFT_EDGE * this.props.scale.screenWidth;
    const top = SCREEN_HEIGHT - size.height - 60 * this.props.scale.screenHeight;
    return {top, left};
  }

  readyTrial (level, trial) {
    this.setState({
      level,
      trial,
      gameBoardTiles: gameTiles.gameBoardTilesForTrial(level, trial),
      selectionTiles: gameTiles.selectionTilesForTrial(level, trial),
    });
  }

  gameCharacterAction (action) {
    let dog = _.cloneDeep(this.state.dog);
    dog.frameIndex = _.concat(
      dogSprite.animationIndex(action),
      dogSprite.animationIndex(action)
    );
    this.setState(
      {
        dog,
      }, () => {
        this.readTrialTimeout = setTimeout(() => {
          this.readyTrial(this.state.level, this.state.trial + 1);
        }, 2000);
    });

  }

  leverLocation (scale) {
    const size = this.leverSize(scale);
    const left = SCREEN_WIDTH - size.width;
    const top = (SCREEN_HEIGHT - size.height) / 2;
    return {top, left};
  }

  pressStub () {}

  selectionTilePress (tile, index) {
    console.log(`index = ${index}, frameKey = ${tile.frameKey}`);
    const level = this.state.level;
    const trial = this.state.trial;
    if (tile.frameKey === gameTiles.correctSelection(level, trial)) {
      console.log('WINNER WINNER');
      // redraw matrix with correct
      this.setState({
        gameBoardTiles: gameTiles.gameBoardTilesWithSelectionResult(level, trial, tile.frameKey),
      });
      this.gameCharacterAction('CELEBRATE');
    } else {
      console.log('NO NO NO');
      this.gameCharacterAction('DISGUST');
    }
  }
  selectionTilePressIn (tile, index) {
    console.log('selectionTilePressIn');
  }
  selectionTilePressOut (tile, index) {
    console.log('selectionTilePressOut');
  }

  gameBoardTilePress (tile, index) {
    console.log(`tileInfo = ${index}`);
  }

  componentWillUnmount () {
    clearInterval(this.matrixShifterInterval);
    clearTimeout(this.readTrialTimeout);
  }

  render () {
    return (
      <View style={styles.container}>
        <Image source={require('../../media/backgrounds/Game_4_Background_1280.png')} style={{
          width: 1280 * this.props.scale.screenWidth,
          height: 800 * this.props.scale.screenHeight,
          flex: 1,
        }}
        />
        <AnimatedSprite
          character={dogSprite}
          characterUID={this.characterUIDs.dog}
          animationFrameIndex={this.state.dog.frameIndex}

          loopAnimation={false}
          tweenOptions={{}}
          tweenStart={'fromCode'}
          coordinates={this.dogStartLocation()}
          onTweenFinish={(characterUID) => this.onCharacterTweenFinish(characterUID)}

          size={this.dogSize()}
          rotate={[{rotateY:'180deg'}]}
          onPress={() => this.pressStub()}
          onPressIn={() => this.pressStub()}
          onPressOut={() => this.pressStub()}
        />

        <Matrix
          styles={{
            top: 40 * this.props.scale.screenHeight,
            left: 200 * this.props.scale.screenWidth,
            position: 'absolute',
            width: 600 * this.props.scale.screenWidth,
            height: 600 * this.props.scale.screenHeight,
          }}
          tileScale={0.9}
          tiles={this.state.selectionTiles}
          scale={this.props.scale}
          onPress={(tile, index) => this.selectionTilePress(tile, index)}
          onPressIn={(tile, index) => this.selectionTilePressIn(tile, index)}
          onPressOut={(tile, index) => this.selectionTilePressOut(tile, index)}
        />

        <Matrix
          styles={{
            top: 40 * this.props.scale.screenHeight,
            left: 600 * this.props.scale.screenWidth,
            position: 'absolute',
            width: 600 * this.props.scale.screenWidth,
            height: 600 * this.props.scale.screenHeight,
          }}
          tileScale={1.5}
          tiles={this.state.gameBoardTiles}
          scale={this.props.scale}
          onPress={(tile, index) => this.gameBoardTilePress(tile, index)}
        />

        <HomeButton
          route={this.props.route}
          navigator={this.props.navigator}
          routeId={{id: 'Main'}}
          styles={{
            width: 150 * this.props.scale.image,
            height: 150 * this.props.scale.image,
            top: 0, left: 0,
            position: 'absolute',
          }}
        />
      </View>
    );
  }

}

MatrixReasoningGame.propTypes = {
  route: React.PropTypes.object.isRequired,
  navigator: React.PropTypes.object.isRequired,
  scale: React.PropTypes.object.isRequired,
};

reactMixin.onClass(MatrixReasoningGame, TimerMixin);

export default MatrixReasoningGame;
