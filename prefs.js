
import React from 'react';
import {
  View,
  Image,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  AppRegistry,
  TouchableHighlight,
  AsyncStorage,
  ScrollView,
} from 'react-native';

import curious from './components/DataCollection/curiousLearningAPI';
import main from './main.js';

const t = require('tcomb-form-native');

const baseHeight = 800;
const baseWidth = 1280;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Form = t.form.Form;
const Person = t.struct({
  // AlphaNumericID: t.String,   // a required string
  // age: t.Number,               // a required number
  // sex: t.String,
  developMode: t.Boolean,        // a boolean
  BubbleGame: t.Boolean,
  BugZap: t.Boolean,
  MatchGame: t.Boolean,
  MatrixReasoning: t.Boolean,
  UnlockFood: t.Boolean,
  ClawGame: t.Boolean,
  BoxesGame: t.Boolean,
  SymbolDigit: t.Boolean,
});

class Prefs extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
        value: {
        AlphaNumericID: null,
        age: null,
        sex: null,
        developMode: true,
        BubbleGame: true,
        BugZap: true,
        MatchGame: true,
        MatrixReasoning: true,
        UnlockFood: true,
        ClawGame: true,
        BoxesGame: true,
        SymbolDigit: true,
        posts: '',
      },
    };
  }

  componentWillMount () {
    AsyncStorage.getItem('@User:pref', (err, result) => {
      console.log(`GETTING = ${JSON.stringify(result)}`);
      if (result) {
        const prefs = JSON.parse(result);
        this.setState({ value: prefs });
        // this.setState({ value: prefs, posts: `there are ${prefs.keysCount()} items in memory` });
      }
    });
  }

  componentDidMount () {
    
  }

  componentWillUnmount () {
  }

  goToGame = (gameId) => {
    debugger;
    this.props.navigator.replace({id: gameId});
    //this.props.navigator.pop();
  }

  onPress () {
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      console.log(value); // value here is an instance of Person
      try {
        AsyncStorage.setItem('@User:pref', JSON.stringify(value));
      } catch (error) {
        // Error saving data
      }
    }
  }

  onPostDataPress () {
    curious.postAllToServer('http://app-data.globallit.org/dataupload?manufacturer_serial_number=1532165~777777&some-key=_1');
    this.setState({ posts: `there are ${curious.keysCount()} items in memory`});
  }

  render () {
    return (
      <View style={{backgroundColor: '#ffffff', flex: 1}} >
        
        <ScrollView
          style={{height: 800}}
        >
          <View style={styles.button} >
            <Button          
              onPress={() => this.goToGame('Main')}
              title="Game Launcher"
            />
          </View>
          <View style={styles.container}>
            <Form
              ref="form"
              type={Person}
              value={this.state.value}
              options={{}}
            />
          
            <TouchableHighlight 
              style={styles.saveButton} 
              onPress={() => this.onPress()} 
              underlayColor='#99d9f4'
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableHighlight>
          </View>
          
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: 120,
    height: 30,
    top: 20,
    left: 20,
  },
  fontStyle: {
    fontSize: 42,
  },
  container: {
    justifyContent: 'center',
    top: 60,
    marginTop: 50,
    marginBottom: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  postText : {
    fontSize: 23,
    marginBottom: 30
  },
  saveButton: {
    height: 80,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  postbutton: {
    height: 36,
    width: 200,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start'
  }
});


Prefs.propTypes = {
  route: React.PropTypes.object,
  navigator: React.PropTypes.object.isRequired,
  scale: React.PropTypes.object,
};

export default Prefs;
