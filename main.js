// @flow

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

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Main extends React.Component {
  constructor (props: Object) {
    super(props);
    const iconList: Object[] = [
      {
        name: 'BUBBLE',
        imgSrc: require('./media/icons/game7_icon_color.png'),
        location: {top: 130, left: 60},
      },
      {
        name: 'BUG',
        imgSrc: require('./media/icons/game1_icon_color.png'),
        location: {top: 380, left: 180},
      },
      {
        name: 'MATCH',
        imgSrc: require('./media/icons/game2_icon_color.png'),
        location: {top: 200, left: 400},
      },
      {
        name: 'JUMP',
        imgSrc: require('./media/icons/game3_icon_bw.png'),
        location: {top: 400, left: 600},
      },
      {
        name: 'MATRIX',
        imgSrc: require('./media/icons/game4_icon_bw.png'),
        location: {top: 40, left: 640},
      },
      {
        name: 'FOOD',
        imgSrc: require('./media/icons/game5_icon_bw.png'),
        location: {top: 160, left: 900},
      },
      {
        name: 'COLOR',
        imgSrc: require('./media/icons/game6_icon_bw.png'),
        location: {top: 420, left: 940},
      },
    ];
    this.iconList = iconList;
  }

  componentWillMount () {}

  componentDidMount () {}

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
          style={{width: styles.icon.width,
            height: styles.icon.height,
            top:icon.location.top, left: icon.location.left,
            position: 'absolute',
          }}
          onPress={() => this.launchGame(icon.name)}>
          <Image
            source={icon.imgSrc}
            style={styles.icon}
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

const styles = StyleSheet.create({
  icon: {
    width: 240,
    height: 240,
  },
  scrollView: {
    height:SCREEN_HEIGHT,
    width:SCREEN_WIDTH,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height:SCREEN_HEIGHT,
    width:SCREEN_WIDTH,
    //backgroundColor: '#fff',
  },
  column: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button : {
    backgroundColor: '#4d94ff',
    borderRadius: 10,
    margin: 10,
    height: 75,
    width: 200,
    justifyContent: 'center',
  },
  box: {
    borderColor: 'red',
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 10,
    width: 100,
    height: 100,
  },
});

export default Main;
