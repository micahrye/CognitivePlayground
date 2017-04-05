/*
Copyright (c) 2017 Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT. 
*/
const frogCharacter = {
  name:"frogCharacter",
  size: {width: 228, height: 288},
  animationTypes: ['IDLE', 'WALK', 'EAT', 'CELEBRATE', 'DISGUST', 'ALL'],
  all: [
    require('./blue_frog_idle.png'),
    require('./blue_frog_hop01.png'),
    require('./blue_frog_hop02.png'),
    require('./blue_frog_eat01.png'),
    require('./blue_frog_eat02.png'),
    require('./blue_frog_celebrate01.png'),
    require('./blue_frog_celebrate02.png'),
    require('./blue_frog_disgust01.png'),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'IDLE':
        return [0];
      case 'WALK':
        return [1,2,0];
      case 'EAT':
        return [0,3,3,4,0];
      case 'CELEBRATE':
        return [5,6,6,6,5,0];
      case 'DISGUST':
        return [0,7,7,7,7,7,0];
      case 'ALL':
        return [0,1,2,3,4,5,6,7];
      case 'HOPON':
          return [1];
      case 'HOPOFF':
          return [2];
    }
  },
};

export default frogCharacter;
