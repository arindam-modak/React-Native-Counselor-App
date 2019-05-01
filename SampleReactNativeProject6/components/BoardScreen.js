import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, Image } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import firebase from '../Firebase';
import SplashScreen from 'react-native-splash-screen';
import AwesomeButton from "react-native-really-awesome-button";
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import chat_ui from './chat/chat_ui'
import {AsyncStorage} from 'react-native';

// const MyDrawerNav = createDrawerNavigator({
//   Chatbot: chat_ui
// })

// const MyDrawer = createAppContainer(MyDrawerNav);

class BoardScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Counseling App',
      headerTitleStyle: {
        fontSize: 25,
        fontWeight: "bold",
        fontFamily: 'RobotoCondensed-LightItalic',
      },
      headerStyle: {
        backgroundColor: '#FDBC5E',
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      questions: [],
      Artistic: 0,
      Conventional: 0,
      Enterprising: 0,
      Investigative: 0,
      Realistic: 0,
      Social: 0,
      loggedIn: false,
      username : ''
    };
  }

  componentDidMount() {
    let temp = [];
    let that = this;
    firebase.firestore().collection("PsychometricQuestions")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                if(doc.exists)
                {
                  //console.log(doc.data());
                  temp.push(doc.data());
                }
            });
    })
    AsyncStorage.getItem('Username').then((username) => {
      that.setState({
        loggedIn : true,
        username : username
      })
    });
    setTimeout(function afterTwoSeconds() {
      console.log(temp);
      that.setState({
        questions: temp
      })
      SplashScreen.hide();
    }, 5000);
  }

  logout() {
    AsyncStorage.removeItem('Username');
    this.setState({
      loggedIn: false,
      username: ''
    })
  }

  render() {
    if(this.state.isLoading){
      return(
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff"/>
          </View>
      )
    }
    var that = this;
    if(this.state.loggedIn) {
      console.log("IIIIIIIIIIIIIIIII" + that.state.username);
      return (
        <View style={styles.container}>
           <View style={styles.container1}>
              <Image style={{width: 500, height: 500}}
              source={require('./src/icon.png')}
              />
              </View>
              <View style={styles.container2}>
                  <View style={styles.container3}>
                      <View style={styles.container4}>
                          <Button buttonStyle={styles.button}
                          type="outline"
                          large
                          leftIcon={{name: 'list'}}
                          title='All Careers'
                          onPress={() => {
                          that.props.navigation.navigate('CareerList');
                          }}
                          />
                      </View>
                      <View style={styles.container4}>
                          <Button buttonStyle={styles.button}
                          large
                          type="outline"
                          leftIcon={{name: 'face'}}
                          title='Chat Bot'
                          onPress={() => {
                          that.props.navigation.navigate('chat_ui');
                          }} />
                      </View>
                  </View>
              <View style={{padding:20,flex:0.3}}>
                  <Button buttonStyle={styles.button}
                  type="outline"
                  large
                  leftIcon={{name: 'list'}}
                  title='Psychometric Test'
                  onPress={() => {
                    that.props.navigation.navigate('psycho',{
                      QuestionList: that.state.questions,
                      Questionno: 0,
                      Artistic: 0,
                      Conventional: 0,
                      Enterprising: 0,
                      Investigative: 0,
                      Realistic: 0,
                      Social: 0
                    });
                  }}
                  />
              </View>
              <View style={{padding:20,flex:0.3}}>
                <Button buttonStyle={styles.button}
                type="outline"
                large
                leftIcon={{name: 'list'}}
                title='Popular Careers'
                onPress={() => {
                  this.props.navigation.navigate('popularCareers');
                }}
                />
              </View>
              <View style={{padding:20,flex:0.3}}>
                <Button buttonStyle={styles.button}
                  type="outline"
                  large
                  leftIcon={{name: 'list'}}
                  title='Logout'
                  onPress={() => {
                    that.logout();
                 }}
                />
              </View>
           </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
         <View style={styles.container1}>
            <Image style={{width: 500, height: 500}}
            source={require('./src/icon.png')}
            />
            </View>
            <View style={styles.container2}>
                <View style={styles.container3}>
                    <View style={styles.container4}>
                        <Button buttonStyle={styles.button}
                        type="outline"
                        large
                        leftIcon={{name: 'list'}}
                        title='All Careers'
                        onPress={() => {
                        this.props.navigation.navigate('CareerList');
                        }}
                        />
                    </View>
                    <View style={styles.container4}>
                        <Button buttonStyle={styles.button}
                        large
                        type="outline"
                        leftIcon={{name: 'face'}}
                        title='Chat Bot'
                        onPress={() => {
                        this.props.navigation.navigate('chat_ui');
                        }} />
                    </View>
                </View>
            <View style={{padding:20,flex:0.3}}>
                <Button buttonStyle={styles.button}
                type="outline"
                large
                leftIcon={{name: 'list'}}
                title='Psychometric Test'
                onPress={() => {
                  this.props.navigation.navigate('psycho',{
                    QuestionList: this.state.questions,
                    Questionno: 0,
                    Artistic: 0,
                    Conventional: 0,
                    Enterprising: 0,
                    Investigative: 0,
                    Realistic: 0,
                    Social: 0
                  });
                }}
                />
            </View>
            <View style={{padding:20,flex:0.3}}>
                <Button buttonStyle={styles.button}
                type="outline"
                large
                leftIcon={{name: 'list'}}
                title='Popular Careers'
                onPress={() => {
                  this.props.navigation.navigate('popularCareers');
                }}
                />
            </View>
            <View style={{padding:20,flex:0.3}}>
                <Button buttonStyle={styles.button}
                type="outline"
                large
                leftIcon={{name: 'list'}}
                title='Login'
                onPress={() => {
                  this.props.navigation.navigate('Register',{
                      boardState: that
                  });
                }}
                />
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
   flex: 1.1,
   padding: 20,
   alignItems: 'center',
    justifyContent: 'center',
    backgroundColor : '#ffffff'

  },
  container2: {
   flex: 0.6,
   flexDirection: 'column',
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor : '#ffffff'
  },
  container3: {
   flex: 0.3,
   flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container4: {
   flex: 0.5,
   padding:5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container5: {
   flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
       borderRadius:3,
       flex: 1  
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