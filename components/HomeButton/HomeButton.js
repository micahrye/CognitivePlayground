/*
Copyright (c) 2017 Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT. 
*/
import React from 'react';
import {
  TouchableOpacity,
  Image,
} from 'react-native';

// Expects styles
// {width: 150,
//   height: 150,
//   top:0, left: 0,
//   position: 'absolute',
// }

const HomeButton = function (props) {
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      style={props.styles}
      onPress={() => props.navigator.replace(props.routeId)}>
      <Image
        source={require('../../media/icons/home_btn02.png')}
        style={{width: props.styles.width, height: props.styles.height}}
      />
    </TouchableOpacity>
  );
};

HomeButton.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  routeId: React.PropTypes.object.isRequired,
  styles: React.PropTypes.object.isRequired,
  scale: React.PropTypes.number,
};

// {width: 150,
//   height: 150,
//   top:0, left: 0,
//   position: 'absolute',
// }

export default HomeButton;
