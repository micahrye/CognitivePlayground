/*
Copyright (c) 2017 Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT. 
*/

const monsterCharacter = {
  name:"monster",
  size: {width: 220, height: 220},
  animationTypes: ['IDLE', 'WALK', 'EAT', 'CELEBRATE', 'DISGUST', 'ALL'],
  all: [
    require('./monster_idle.png'),
    require('./monster_walk01.png'),
    require('./monster_walk02.png'),
    require('./monster_walk03.png'),
    require('./monster_eat01.png'),
    require('./monster_eat02.png'),
    require('./monster_celebrate01.png'),
    require('./monster_celebrate02.png'),
    require('./monster_disgust01.png'),
  ],
  animationIndex: function getAnimationIndex (animationType){
    switch (animationType) {
      case 'IDLE':
        return [0];
      case 'WALK':
        return [1,2,3,0];
      case 'EAT':
        return [4,5,4,0];
      case 'CELEBRATE':
        return [6,7,6,0,6,7,6,0];
      case 'DISGUST':
        return [0,8,8,8,8,0];
      case 'ALL':
        return [0,1,2,3,4,5,6,7,8];
    }
  },
};

export default monsterCharacter;
