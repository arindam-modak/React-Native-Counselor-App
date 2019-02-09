import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, Image, TextInput } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import firebase from '../Firebase';
import Voice from 'react-native-voice';
import Dialogflow from "react-native-dialogflow";

class ChatBot extends Component {

  static navigationOptions = {
    title: 'Chat Bot',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      query: '',
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: '',
      partialResults: [],
      isVoiceOn: false
    };
    Dialogflow.setConfiguration(
            "77c9f4ea1f5b45999a9194bba81e99fe", Dialogflow.LANG_ENGLISH 
    );
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart = e => {
    // eslint-disable-next-line
    console.log('onSpeechStart: ', e);
    this.setState({
      started: '√',
    });
  };

  onSpeechRecognized = e => {
    // eslint-disable-next-line
    console.log('onSpeechRecognized: ', e);
    this.setState({
      recognized: '√',
    });
  };

  onSpeechEnd = e => {
    // eslint-disable-next-line
    console.log('onSpeechEnd: ', e);
    this.setState({
      end: '√',
    });
  };

  onSpeechError = e => {
    // eslint-disable-next-line
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  updateResult = (e,qu) => {
    this.setState({
        results: qu[0],
        query: e.value[0]
    });
  }

  onSpeechResults = e => {
    // eslint-disable-next-line
    console.log('onSpeechResults: ', e);
    const qu = [];
    const that = this;
    Dialogflow.requestQuery(e.value[0], result=>{ qu.push(result); }, error=>console.log(error));
    setTimeout(function afterTwoSeconds() {
      console.log(qu);
      that.updateResult(e,qu);
    }, 2000)
    
  };

  onSpeechPartialResults = e => {
    // eslint-disable-next-line
    console.log('onSpeechPartialResults: ', e);
    this.setState({
      partialResults: e.value,
    });
  };

  onSpeechVolumeChanged = e => {
    // eslint-disable-next-line
    console.log('onSpeechVolumeChanged: ', e);
    this.setState({
      pitch: e.value,
    });
  };

  onMicButtonPress = async () => {
    const state = this.state
    state['isVoiceOn'] = !state['isVoiceOn'];
    this.setState(state);
    
    if(this.state.isVoiceOn)
    {
      this.setState({
        recognized: '',
        pitch: '',
        error: '',
        started: '',
        results: '',
        partialResults: [],
        end: '',
        isLoading: false,
        query: '',
        isVoiceOn: true
      });

      try {
        await Voice.start('en-US');
      } catch (e) {
        //eslint-disable-next-line
        console.error(e);
      }
    }
    else 
    {
      try {
        await Voice.stop();
      } catch (e) {
        //eslint-disable-next-line
        console.error(e);
      }
    }
  }

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  render() {
    if(this.state.isLoading){
      return(
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff"/>
          </View>
      )
    }

    var Reply;
    if(this.state.results=='')
      Reply = 'Hi';
    else
      Reply = this.state.results.result.fulfillment.messages.length > 1 ? this.state.results.result.fulfillment.messages[1].speech:
                                                                              this.state.results.result.fulfillment.messages[0].speech;
    return (

        <View style={styles.container}>
          <View style={styles.container1}>
            <Text style={styles.stat}>Results</Text>
                <Text key={`result`} style={styles.stat}>
                  {Reply}
                </Text>
          </View>
          <View style={styles.container2}>
            <View style={styles.container3}>
              <TextInput
                multiline = {true}
                style={{height: 60}}
                placeholder={'Query'}
                value={this.state.query}
                onChangeText={(text) => this.updateTextInput(text, 'query')}
              />
            </View>
            <View style={styles.container4}>
              {this.state.isVoiceOn==false ? <Icon name='mic' onPress={()=>{this.onMicButtonPress()}}/> :
                                            <Icon name='hearing' onPress={()=>{this.onMicButtonPress()}}/> 
              }
            </View>
          </View>
        </View>
    );
  }
}

export default ChatBot;

const styles = StyleSheet.create({
  container0: {
   flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor : '#f47442'
  },
  container1: {
     flex: 0.9,
     padding: 50,
     borderWidth: 3,
     borderColor: '#CCCCCC',
     alignItems: 'center',
    justifyContent: 'center',
    marginRight:10,
    marginLeft:10,
    marginTop:10,
    paddingTop:20,
    paddingBottom:20,
    borderRadius:10,
    backgroundColor : '#f2f2f2'
  },
  container2: {
   flex: 0.1,
   flexDirection: 'row',
   padding: 20,
   borderWidth: 3,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight:10,
    marginLeft:10,
    marginTop:10,
    marginBottom:5,
    borderRadius:10,
    backgroundColor : '#f2f2f2'
  },
  container3: {
   flex: 0.9,
   alignItems: 'center',
   justifyContent: 'center',

  },
  container4: {
   flex: 0.1,
   marginLeft: 30,
   alignItems: 'center',
   justifyContent: 'center',

  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
})
