
import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import _ from 'lodash';

var reactMixin = require('react-mixin');
import TimerMixin from 'react-timer-mixin';
import Tweens from "./Tweens/Tweens";

const baseHeight = 800;
const baseWidth = 1280;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


class Main extends React.Component {
  constructor (props) {
    super(props);
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
        imgSrc: require('./media/icons/game7_icon_color.png'),
        location: this.scaleLocation({top: 130, left: 60}),
      },
      {
        name: 'BUG',
        imgSrc: require('./media/icons/game1_icon_color.png'),
        location: this.scaleLocation({top: 380, left: 180}),
      },
      {
        name: 'MATCH',
        imgSrc: require('./media/icons/game2_icon_color.png'),
        location: this.scaleLocation({top: 200, left: 400}),
      },
      {
        name: 'UNLOCK',
        imgSrc: require('./media/icons/game3_icon_color.png'),
        location: this.scaleLocation({top: 400, left: 600}),
      },
      {
        name: 'MATRIX',
        imgSrc: require('./media/icons/game4_icon_bw.png'),
        location: this.scaleLocation({top: 40, left: 640}),
      },
      {
        name: 'FOOD',
        imgSrc: require('./media/icons/game5_icon_bw.png'),
        location: this.scaleLocation({top: 160, left: 900}),
      },
      {
        name: 'COLOR',
        imgSrc: require('./media/icons/game6_icon_bw.png'),
        location: this.scaleLocation({top: 420, left: 940}),
      },
    ];
    this.iconList = iconList;
  }

  componentWillMount () {}

  componentDidMount () {}

  scaleLocation (location) {
    return ({
      top: location.top * this.scale.screenHeight,
      left: location.left * this.scale.screenWidth,
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
      case 'UNLOCK':
        this.goToGame('UnlockFoodGame');
        break;
      default:
        // console.warn('touched me');
        break;
    }
  }

  render () {

    const icons = _.map(this.iconList, (icon, index) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={1.0}
          style={{width: 240 * this.scale.image,
            height: 240 * this.scale.image,
            top:icon.location.top, left: icon.location.left,
            position: 'absolute',
          }}
          onPress={() => this.launchGame(icon.name)}>
          <Image
            source={icon.imgSrc}
            style={{width: 240 * this.scale.image,
              height: 240 * this.scale.image}}
          />
        </TouchableOpacity>
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
  navigator: React.PropTypes.object.isRequired,
};

reactMixin.onClass(Main, TimerMixin);



Main.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
  scale: React.PropTypes.object,
};

export default Main;
