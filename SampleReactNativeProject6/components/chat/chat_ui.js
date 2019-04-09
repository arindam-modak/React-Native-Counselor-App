import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Voice from 'react-native-voice';
import Dialogflow from "react-native-dialogflow";
import {GiftedChat, Actions, Bubble, SystemMessage} from 'react-native-gifted-chat';
import CustomActions from './CustomActions';
import * as firebase from 'firebase';

if (!firebase.apps.length) {
  firebase.initializeApp({
      "projectId": "counselling-bot-10fda",
      "apiKey": "AIzaSyA1QuFJ-oeqLp0Q0akmBPVy9YUY84cxsoc",
      "authDomain": "counselling-bot-10fda.firebaseapp.com",
      "databaseURL": "https://counselling-bot-10fda.firebaseio.com",
      "storageBucket": "counselling-bot-10fda.appspot.com",
      "messagingSenderId": "984760016813"
  })
}
const db = firebase.firestore();

class chat_ui extends React.Component {

  static navigationOptions = {
    title: 'Chat Bot',
    headerStyle: {
      backgroundColor: '#FDBC5E',
      },
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      isLoading: false,
      query: '',
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
      isVoiceOn: false,
      col_loc: []
    };

    this.getDistance = this.getDistance.bind(this);
    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);
    this._isAlright = null;
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

  componentWillMount() {
    this._isMounted = true;
    this.setState(() => {
      return {
        messages: require('./data/messages.js'),
      };
    });
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
    this._isMounted = false;
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, require('./data/old_messages.js')),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }

  getDistance(lat1,long1,lat2,long2)
  {
    var R = 6371e3; // metres
    var φ1 = lat1* (Math.PI / 180);
    var φ2 = lat2* (Math.PI / 180);
    var Δφ = (lat2-lat1)* (Math.PI / 180);
    var Δλ = (long2-long1)* (Math.PI / 180);
    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d;
  }


  updateResult = (qu) => {
    this.setState({
        results: qu[0].result.fulfillment.messages,
        query: ""
    });
    console.log("**************");
    console.log(this.state.results);
    let flag=0;
    let promises = [];
    let col_loc = [];
    var description = [];
    if (qu[0].result.metadata.intentName=="nearest_colleges")
    {
        flag=1;
        let career = qu[0].result.parameters.Carrer;
        let location = qu[0].result.parameters['geo-city'];
        promises.push(
          new Promise((resolve, reject) => {
            resolve(
              fetch('https://www.mapquestapi.com/geocoding/v1/address?key=%20rZiYsbTVoDtG20gAtHZxaXarvFdpbCTH&location='+location)
                .then(function(response) {
                  //console.log(JSON.parse(response._bodyText));
                  var responseJson = JSON.parse(response._bodyText);
                  lat = responseJson.results[0].locations[0].latLng.lat;
                  lng = responseJson.results[0].locations[0].latLng.lng;
                  let newdata = {
                    'lat' : lat,
                    'lng' : lng
                  }
                  //console.log(newdata);
                  return newdata;
                })
              )
            }) 
          );
        console.log("YAAAAAAAAAAAAAA");
        
        const ref = db.collection('AllCareers').where('name','==',career);
        //console.log(navigation.getParam('CareerName').toString().slice(1,-3));
        
        ref.get().then((snapshot) => {
          //console.log(snapshot);
          if (!snapshot.empty) {
            //console.log(snapshot.docs[0]);
            //var description=[];
            description = snapshot.docs[0].data().leading_colleges;
            var len=description.length;
            for(var i=0;i<len;i++){

              promises.push(
                new Promise((resolve, reject) => {
                  resolve(
                    fetch('https://www.mapquestapi.com/geocoding/v1/address?key=%20rZiYsbTVoDtG20gAtHZxaXarvFdpbCTH&location='+description[i].location)
                      .then(function(response) {
                        //console.log(JSON.parse(response._bodyText));
                        var responseJson = JSON.parse(response._bodyText);
                        lat = responseJson.results[0].locations[0].latLng.lat;
                        lng = responseJson.results[0].locations[0].latLng.lng;
                        let newdata = {
                          'lat' : lat,
                          'lng' : lng
                        }
                        //console.log(newdata);
                        return newdata;
                      })
                    )
                  }) 
                );  
            }
          }
      });
    }
    const that2 = this;
    if(flag==1)
    {
      setTimeout(function afterTwoSeconds() {
        Promise.all(promises)
        .then(function(values){
          console.log(values);
            for(var i=1;i<values.length;i++)
            {
              console.log(values[i]);
              let newd = {
                          'College' : description[i-1].college,
                          'Location' : description[i-1].location,
                          'Website' : description[i-1].website,
                          'lat' : values[i].lat,
                          'lng' : values[i].lng
              }

              col_loc.push(newd);

            }

            console.log(col_loc);

            col_loc.sort(function(a, b){
                return that2.getDistance(a.lat,a.lng,values[0].lat,values[0].lng) - that2.getDistance(b.lat,b.lng,values[0].lat,values[0].lng);
            })

            //console.log(col_loc);
            var minm = 5;
            if(col_loc.length<5)
            {
              minm = col_loc.length;
            }
            that2.onReceive("Some of the best colleges near you are : ");
            for(var i=0;i<minm;i++)
              that2.onReceive("College : "+col_loc[i].College + "\n" + "Location : "+col_loc[i].Location+"\n"+"Website : "+col_loc[i].Website);
        });
      }, 5000);
    }
    else
    {
      for(var i=0;i<this.state.results.length;i++)
        this.onReceive(this.state.results[i].speech);
    }
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
    const qu = [];
    const that = this;
    console.log("**************");
    console.log(messages[0].text);
    Dialogflow.requestQuery(messages[0].text, result=>{ qu.push(result); }, error=>console.log(error));
    setTimeout(function afterTwoSeconds() {
      console.log(qu);
      that.updateResult(qu);
    }, 2000)
    // for demo purpose
    //this.answerDemo(messages);
  }

  answerDemo(messages) {
    if (messages.length > 0) {
      if ((messages[0].image || messages[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          return {
            typingText: 'React Native is typing'
          };
        });
      }
    }

    setTimeout(() => {
      if (this._isMounted === true) {
        if (messages.length > 0) {
          if (messages[0].image) {
            this.onReceive('Nice picture!');
          } else if (messages[0].location) {
            this.onReceive('My favorite place');
          } else {
            if (!this._isAlright) {
              this._isAlright = true;
              this.onReceive('Alright');
            }
          }
        }
      }

      this.setState((previousState) => {
        return {
          typingText: null,
        };
      });
    }, 1000);
  }

  onReceive(text) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            // avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      };
    });
  }

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
    const options = {
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      'Cancel': () => {},
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  }



  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        loadEarlier={this.state.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier}

        user={{
          _id: 1, // sent messages should have same user._id
        }}

        renderActions={this.renderCustomActions}
        renderBubble={this.renderBubble}
        renderSystemMessage={this.renderSystemMessage}
        renderFooter={this.renderFooter}
      />
    );
  }
}
export default chat_ui;

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});
