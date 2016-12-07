import React from 'react';
import {
  View,
} from 'react-native';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import randomstring from 'random-string';

class SymbolDigitCoding extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillMount () {}
  componentDidMount () {}

  render () {
    return (
      <View />
    );
  }
}

SymbolDigitCoding.propTypes = {

};

reactMixin.onClass(SymbolDigitCoding, TimerMixin);

export default SymbolDigitCoding;
