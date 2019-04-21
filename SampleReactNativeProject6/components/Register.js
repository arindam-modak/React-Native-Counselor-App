import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput, TouchableHighlight,Text } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from '../Firebase';
import {AsyncStorage} from 'react-native';

class Register extends Component {
  static navigationOptions = {
    title: 'Register',
  };
  constructor() {
    super();
    this.state = {
      Username: '',
      Password: '',
    };
  }
  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  saveBoard() {
    var that = this;
    var flag=0;
    firebase.firestore().collection("Users").where("Username", "==", that.state.Username)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                if(doc.exists)
                {
                  console.log("HIIIIIIIIII");
                  flag=1;
                }
            });
    })
    setTimeout(function afterTwoSeconds() {
      if(flag==0)
        firebase.firestore().collection('Users').add({
            Username: that.state.Username,
            Password: that.state.Password,
        })
    }, 2000);

    
    try {
      AsyncStorage.setItem('Username', this.state.Username);
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Username'}
              value={this.state.Username}
              onChangeText={(text) => this.updateTextInput(text, 'Username')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Password'}
              value={this.state.Password}
              onChangeText={(text) => this.updateTextInput(text, 'Password')}
          />
        </View>
        <View style={styles.button}>
          <Button
            large
            leftIcon={{name: 'save'}}
            title='Save'
            onPress={() => this.saveBoard()} />
        </View>
      </ScrollView>
    );
  }
}

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    marginBottom: 20,
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
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