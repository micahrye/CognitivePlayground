/*
Copyright (c) 2017 Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Curious Learning : A Global Literacy Project, Inc., The Regents of the University of California, & MIT. 
*/
"use strict";

const hookCardCharacter = {
  name:"hookCard",
  size: {width: 124, height: 142},
  animationTypes: ['BLANK', 'TRIANGLE', 'DIMOND', 'SQUARE', 'CIRCLE', 'ALL'],
  all: [
    require("./hook_and_card_small.png"),
    require("./hook_triangle.png"),
    require("./hook_square.png"),
    require("./hook_dimond.png"),
    require("./hook_circle.png"),
  ],
  animationIndex: function getAnimationIndex (animationType) {
    switch (animationType) {
      case 'BLANK':
        return [0];
      case 'TRIANGLE':
        return [1];
      case 'DIMOND':
        return [3];
      case 'SQUARE':
        return [2];
      case 'CIRCLE':
        return [4];
      case 'ALL':
        return [0, 1, 2, 3, 4];
    }
  },
};

export default hookCardCharacter;
