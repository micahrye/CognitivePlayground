
import React from 'react';
import {
  View,
  Dimensions,
} from 'react-native';

import _ from 'lodash';

var reactMixin = require('react-mixin');
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from "./components/AnimatedSprite/AnimatedSprite";
import gameIcon from "./media/gameIcon/gameIcon";

const baseHeight = 800;
const baseWidth = 1280;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      iconArray: [],
    };
    const scaleWidth = screenWidth / baseWidth;
    const scaleHeight = screenHeight / baseHeight;
    this.scale = {
      screenWidth: scaleWidth,
      screenHeight: scaleHeight,
      image: scaleHeight > scaleWidth ? scaleWidth : scaleHeight,
    };
    const iconList = [
      {
        name: 'BUBBLE',
        imgSrc: require('./media/gameIcon/game7_icon_color.png'),
        location: this.scaleLocation({top: 130, left: 100}),
        frameIndex: [13],
      },
      {
        name: 'BUG',
        imgSrc: require('./media/gameIcon/game1_icon_color.png'),
        location: this.scaleLocation({top: 380, left: 220}),
        frameIndex: [1],
      },
      {
        name: 'MATCH',
        imgSrc: require('./media/gameIcon/game2_icon_color.png'),
        location: this.scaleLocation({top: 200, left: 440}),
        frameIndex: [3],
      },
      {
        name: 'UNLOCK_FOOD',
        imgSrc: require('./media/gameIcon/game3_icon_color.png'),
        location: this.scaleLocation({top: 400, left: 640}),
        frameIndex: [5],
      },
      {
        name: 'MATRIX',
        imgSrc: require('./media/gameIcon/game4_icon_color.png'),
        location: this.scaleLocation({top: 80, left: 660}),
        frameIndex: [7],
      },
      {
        name: 'SYMBOL',
        imgSrc: require('./media/gameIcon/game6_icon_color.png'),
        location: this.scaleLocation({top: 260, left: 900}),
        frameIndex: [11],
      },
    ];
    this.iconList = iconList;
    this.characterUIDs ={};
    this.setDefaultAnimationState;
    this.gameIcon = {tweenOptions: {}};
    this.iconRefs = [];
  }

  componentWillMount () {
    this.characterUIDs = {
      gameIcon: randomstring({ length: 7 }),
    };
  }

  componentDidMount () {
    for (let i=0; i < this.iconList.length; i++) {
      this.setDefaultAnimationState = setTimeout(() => {
        this.tweenIconsOnStart(i);
      }, 100 * i);
    }
  }

  startSize () {
    return ({
      width: 240 * this.scale.image,
      height: 240 * this.scale.image,
    });
  }

  scaleLocation (location) {
    return ({
      top: location.top * this.scale.screenHeight,
      left: location.left * this.scale.screenWidth,
    });

  }

  makeZoomTween (startScale=0.01, endScale= 1, duration=1000) {
    //React bug (I think): Scale of 0 is set to 1 on load
    if (startScale == 0) {
      startScale = 0.01;
    }
    else if (endScale == 0) {
      endScale == 0.01;
    }
    return ({
      tweenType: "scale",
      startScale: startScale,
      endScale: endScale,
      duration: duration,
      loop: false,
    });
  }

  tweenIconsOnStart (index) {
    let icon = this.refs[this.iconRefs[index]];
    const startScale = icon.props.scale;
    const endScale = 1;
    this.gameIcon.tweenOptions = this.makeZoomTween(startScale, endScale, 1000);
    this.setState({
      tweenCharacter: true,
    }, () => {
      icon.startTween();
    });
  }

  goToGame = (gameId) => {
    //console.warn('goToGame : ', gameId);
    this.props.navigator.replace({id: gameId});
  }

  launchGame (game: string) {
    switch (game) {
      case 'BUBBLE':
        this.goToGame('BubblesGame');
        break;
      case 'BUG':
        this.goToGame('BugZapGame');
        break;
      case 'MATCH':
        this.goToGame('MatchByColorGame');
        break;
      case 'MATRIX':
        this.goToGame('MatrixReasoningGame');
        break;
      case 'UNLOCK_FOOD':
        this.goToGame('UnlockFoodGame');
        break;
      case 'SYMBOL':
        this.goToGame('SymbolDigitCodingGame');
        break;
      default:
        // console.warn('touched me');
        break;
    }
  }

  render () {

    const icons = _.map(this.iconList, (icon, index) => {
      const ref = ("gameRef" + index);
      this.iconRefs.push(ref);
      return (
        <AnimatedSprite
          ref={ref}
          character={gameIcon}
          style={{opacity: 1}}
          key={index}
          characterUID={this.characterUIDs.gameIcon}
          animationFrameIndex={icon.frameIndex}
          tweenOptions = {this.gameIcon.tweenOptions}
          tweenStart={'fromCode'}
          loopAnimation={false}
          size={this.startSize()}
          scale={0.01}
          coordinates={{top:icon.location.top, left: icon.location.left}}
          onPress={() => this.launchGame(icon.name)}
        />
      );
    });
    this.iconRefs.push('testRef');
    return (
      <View style={{backgroundColor: '#738599', flex: 1}} >
        {icons}
      </View>
    );
  }
}

Main.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object.isRequired,
  scale: React.PropTypes.object,
};
reactMixin.onClass(Main, TimerMixin);





export default Main;
