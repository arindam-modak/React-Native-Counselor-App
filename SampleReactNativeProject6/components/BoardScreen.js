import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, Image } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import firebase from '../Firebase';
import SplashScreen from 'react-native-splash-screen';

class BoardScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Counseling App',
      headerRight: (
        <Button
          buttonStyle={{ padding: 0, backgroundColor: 'rgba(52, 52, 52, 0.8)' }}
          icon={{ name: 'add-circle', style: { marginRight: 0, fontSize: 28 } }}
          onPress={() => { navigation.push('AddBoard') }}
        />
      ),
      headerLeft: (
        <Button
          buttonStyle={{ padding: 0, backgroundColor: 'rgba(52, 52, 52, 0.8)' }}
          icon={{ name: 'code', style: { marginRight: 0, fontSize: 28 } }}
          onPress={() => { navigation.push('CollapseList') }}
        />
      ),
    };
  };

  constructor() {
    super();
    this.state = {
      isLoading: false
    };
  }

  componentDidMount() {
    SplashScreen.hide();
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
            <Image
              source={require('./assets/img/dash.png')}
            />
          </View>
          <View style={styles.container2}>
            <View style={styles.container3}>
              <View style={styles.container4}>
                <Button
                large
                leftIcon={{name: 'list'}}
                title='All Careers'
                 />
              </View>
              <View style={styles.container4}>
                <Button
                large
                leftIcon={{name: 'face'}}
                title='Chat Bot'
                onPress={() => {
                  this.props.navigation.navigate('ChatBot');
                }} />
              </View>
            </View>
            <View style={styles.container5}>
                
            </View>
          </View>
        </View>
    );
  }
}

export default BoardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  container1: {
   flex: 0.3,
   padding: 20,
   borderBottomWidth: 2,
   borderBottomColor: '#CCCCCC',
   alignItems: 'center',
    justifyContent: 'center'
  },
  container2: {
   flex: 0.7,
   flexDirection: 'column',
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor : '#f47442'
  },
  container3: {
   flex: 0.3,
   flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container4: {
   flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container5: {
   flex: 0.7,
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