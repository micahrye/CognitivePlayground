
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

import _ from 'lodash';

var reactMixin = require('react-mixin');
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

import AnimatedSprite from "./components/AnimatedSprite/AnimatedSprite";
import Tweens from "./Tweens/Tweens";
import game_icon from "./media/game_icon/game_icon";

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
        imgSrc: require('./media/game7/game7_icon_color.png'),
        location: this.scaleLocation({top: 130, left: 100}),
        frameIndex: [13],
        delay: 0,
      },
      {
        name: 'BUG',
        imgSrc: require('./media/game1/game1_icon_color.png'),
        location: this.scaleLocation({top: 380, left: 220}),
        frameIndex: [1],
        delay: 100,
      },
      {
        name: 'MATCH',
        imgSrc: require('./media/game2/game2_icon_color.png'),
        location: this.scaleLocation({top: 200, left: 440}),
        frameIndex: [3],
        delay: 200,
      },
      {
        name: 'UNLOCK_FOOD',
        imgSrc: require('./media/game3/game3_icon_bw.png'),
        location: this.scaleLocation({top: 400, left: 640}),
        frameIndex: [4],
        delay: 300,
      },
      {
        name: 'MATRIX',
        imgSrc: require('./media/game4/game4_icon_bw.png'),
        location: this.scaleLocation({top: 80, left: 660}),
        frameIndex: [6],
        delay: 400,
      },
    /*{
        name: 'FOOD',
        imgSrc: require('./media/icons/game5_icon_bw.png'),
        location: this.scaleLocation({top: 160, left: 900}),
        frameIndex: [8],
        delay: 500,
      },*/
      {
        name: 'COLOR',
        imgSrc: require('./media/game6/game6_icon_bw.png'),
        location: this.scaleLocation({top: 260, left: 900}),
        frameIndex: [10],
        delay: 600,
      },
    ];
    this.iconList = iconList;
    this.characterUIDs ={};
    this.setDefaultAnimationState;
    this.game_icon = {tweenOptions: {}};
    this.iconTweenDelays = _.map(this.iconList, 'icon.delay');
    this.iconRefs = [];
  }

  componentWillMount () {
    this.characterUIDs = {
      game_icon: randomstring({ length: 7 }),
    };
    this.setDefaultAnimationState = setTimeout(() => {
      this.setState(() => {this.tweenIconsOnStart(3);});
    }, 1500);
  }

  componentDidMount () {}

  scaleLocation (location) {
    return ({
      top: location.top * this.scale.screenHeight,
      left: location.left * this.scale.screenWidth,
    });
  }

  makeMoveTween (startXY=[-300,500], endXY=[600,400], duration=1500) {
    return ({
      tweenType: "zoom",
      startXY: [startXY[0], startXY[1]],
      endXY: [endXY[0], endXY[1]],
      duration: duration,
      loop:false,
    });
  }

  tweenIconsOnStart (index) {
    let icon = this.refs['gameRef3'];
    console.warn(icon.ref);
    const startXY = [0, 0];
    const endXY = [iconSize.width, iconSize.height];
    this.refs[this.iconRefs[index]].tweenOptions = this.makeMoveTween(startXY, endXY);
    console.warn(this.refs[this.iconrefs[index]].tweenOptions.startXY);
    console.warn(this.refs[this.iconRefs[index]].tweenOptions.endXY);
    this.setState({
      tweenCharacter: true,
    }, () => {this.refs[this.iconRefs[index]].startTween();});
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
      case 'UNLOCK_FOOD':
        this.goToGame('UnlockFoodGame');
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
          character={game_icon}
          key={index}
          characterUID={this.characterUIDs.game_icon}
          animationFrameIndex={icon.frameIndex}
          tweenOptions = {{}}
          tweenStart={'fromCode'}
          loopAnimation={false}
          size={{width: 240 * this.scale.image,
            height: 240 * this.scale.image}}
          coordinates={{top:icon.location.top, left: icon.location.left}}
          onPress={() => this.launchGame(icon.name)}
        />
      );
    });
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
