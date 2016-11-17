import React from 'react';
import {
  TouchableOpacity,
  Image,
} from 'react-native';


class HomeButton extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={{width: 150,
          height: 150,
          top:0, left: 0,
          position: 'absolute',
        }}
        onPress={() => this.props.navigator.replace({ id: 'Main' })} >

        <Image
          source={require('../../media/icons/home_btn.png')}
          style={{width: 150,
            height: 150,
          }}
        />
      </TouchableOpacity>
    );
  }
}

HomeButton.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object,
};

export default HomeButton;
