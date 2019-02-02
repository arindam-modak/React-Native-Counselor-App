import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, Image, TextInput } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import firebase from '../Firebase';

class ChatBot extends Component {

  static navigationOptions = {
    title: 'Chat Bot',
  };

  constructor() {
    super();
    this.state = {
      isLoading: false,
      query: ''
    };
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
    return (
        <View style={styles.container}>
          <View style={styles.container1}>
            
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
              <Icon name='mic' />
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
  }
})
