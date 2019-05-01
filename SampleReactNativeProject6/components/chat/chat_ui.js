import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import Voice from 'react-native-voice';
import Dialogflow from "react-native-dialogflow";
import {GiftedChat, Actions, Bubble, SystemMessage} from 'react-native-gifted-chat';
import CustomActions from './CustomActions';
import * as firebase from 'firebase';
import {AsyncStorage} from 'react-native';

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
      loadEarlier: false,
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
      col_loc: [],
      issuggested: false,
      askedcareers: [],
      suggestedcareers : []
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
    var phrases = [];
    var suggestions = [];

    var askedcareers = [];
    askedcareers = this.state.askedcareers;
    var flag3 = 0;
    for(var i=0;i<askedcareers.length;i++)
    {
      if(qu[0].result.parameters.Carrer && (!Array.isArray(qu[0].result.parameters.Carrer)) && askedcareers[i]==qu[0].result.parameters.Carrer)
      {
        flag3=1;
        break;
      }
      else if(qu[0].result.parameters.Carrer && (Array.isArray(qu[0].result.parameters.Carrer)) && askedcareers[i]==qu[0].result.parameters.Carrer[0])
      {
        flag3=1;
        break;
      }
    }
    if(qu[0].result.parameters.Carrer && flag3==0) 
    {
      if(!Array.isArray(qu[0].result.parameters.Carrer))
        askedcareers.push(qu[0].result.parameters.Carrer);
      else
      {
        askedcareers.push(qu[0].result.parameters.Carrer[0]);
      }
      this.setState({
        askedcareers : askedcareers
      })
    }

    //console.log("askedcareers : "+askedcareers);

    AsyncStorage.getItem('Username').then((username) => {
      console.log("**********************");
      firebase.firestore().collection("Users").where("Username", "==", username)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log("&&&&&&&&&&&&&&&&&&&&&&&&");
                console.log(doc.id, " => ", doc.data());
                let searches = doc.data().Searches;
                if(!searches) searches = [];
                var flag=0;
                //console.log("11111111111111111111");
                for(var i=0;i<searches.length;i++)
                {
                  if(qu[0].result.parameters.Carrer && (!Array.isArray(qu[0].result.parameters.Carrer)))
                    if(searches[i] == qu[0].result.parameters.Carrer)
                    {
                      flag=1;
                      break;
                    }
                  else
                  {
                    if(qu[0].result.parameters.Carrer && searches[i] == qu[0].result.parameters.Carrer[0])
                    {
                      flag=1;
                      break;
                    }
                  }
                }
                //console.log("22222222222222222222222");
                if(flag==0 && qu[0].result.parameters.Carrer)
                {
                  if(!Array.isArray(qu[0].result.parameters.Carrer))
                    searches.push(qu[0].result.parameters.Carrer);
                  else
                    searches.push(qu[0].result.parameters.Carrer[0]);
                  firebase.firestore().collection("Users").doc(doc.id).update({'Searches': searches});
                }
                //console.log("333333333333333333333333");
            });
      })
      //console.log("44444444444444444444");

    })
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
    else if(qu[0].result.metadata.intentName=="Default Fallback Intent")
    {
       flag=2;
       phrases.push('Steps to a career in x');
       phrases.push('Ways to do x');
       phrases.push('Path to be a x');
       phrases.push('How to become a x');
       phrases.push('Display leading colleges of x');
       phrases.push('best college of x in india');
       phrases.push('Show me all colleges of x in India');
       phrases.push('Leading colleges of x in India');
       phrases.push('demerits of this job');
       phrases.push('disadvantage of this career');
       phrases.push('Why should we not work in x');
       phrases.push('Tell me some demerits of x');
       phrases.push('x exams');
       phrases.push('Entrance test in x');
       phrases.push('Entry exams in x');
       phrases.push('x important facts');
       phrases.push('Show me some facts of x');
       phrases.push('Important facts of x');
       phrases.push('tell me about the careers in this');
       phrases.push('what are the job opportunities');
       phrases.push('All possible jobs in x');
       phrases.push('All possible x professions or jobs');
       phrases.push('Tell me possible professions in x');
       phrases.push('tell me the pros of this career');
       phrases.push('what are the advantages');
       phrases.push('Tell me pros of x');
       phrases.push('Merits of x');
       phrases.push('Tell me about work in x');
       phrases.push('Work description in x');
       phrases.push('describe x work');
       phrases.push('Career for me if i have x in class 12');
       phrases.push('I have interest in x career paths for me');
       phrases.push('If my stream is x in class 12 what are prefer career paths for me');
       phrases.push('what are the nearest colleges for x around y');
       phrases.push('best colleges for x near y');

       for(var i=0;i<phrases.length;i++){

              promises.push(
                new Promise((resolve, reject) => {
                  resolve(
                    fetch('https://api.dandelion.eu/datatxt/sim/v1/?text1='+phrases[i]+'&text2='+qu[0].result.resolvedQuery+'&token=d4d102846e654c9cbadf563f814ee850')
                      .then(function(response) {
                        //console.log(response);
                        console.log(JSON.parse(response._bodyText));
                        var responseJson = JSON.parse(response._bodyText);
                        let newdata = {
                          'similarity' : responseJson.similarity
                        }
                        //console.log(newdata);
                        return newdata;
                      })
                    )
                  }) 
                );  
            }

    }
    const that2 = this;
    if(flag==1)
    {
      that2.onReceive("Some of the best colleges near you are : ");
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

            for(var i=0;i<minm;i++)
              that2.onReceive("College : "+col_loc[i].College + "\n" + "Location : "+col_loc[i].Location+"\n"+"Website : "+col_loc[i].Website);
        });
      }, 5000);
    }
    else if(flag==2)
    {
        that2.onReceive(that2.state.results[0].speech);
        setTimeout(function afterTwoSeconds() {
          Promise.all(promises)
          .then(function(values){
            console.log(values);
            var maxm = 0;
            var phrase = "";
            for(var i=0;i<values.length;i++)
            {
                if(values[i].similarity>maxm)
                {
                  maxm = values[i].similarity;
                  phrase = phrases[i];
                }

            }

            if(phrase!="")
              that2.onReceive("Did you meant something like this: "+phrase);

        });
       }, 4000);
    }
    else
    {
      if(qu[0].result.metadata.intentName=="Career-stream")
      {
        var num = this.state.results.length;
        if(num > 20) num = 20;
        for(var i=0;i<num;i++)
          this.onReceive(this.state.results[i].speech);
      }
      else
      {
        for(var i=0;i<this.state.results.length;i++)
          this.onReceive(this.state.results[i].speech);
      }
      var issuggested = false;
      var that = this;
      if(!this.state.issuggested)
      {
        firebase.firestore().collection("Recommendation")
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    //console.log(doc.data());
                    var data = doc.data();
                    var dataleft = data.left;
                    var dataright = data.right;
                    var count = 0;
                    //console.log("111111111111111111");
                    for(var j=0;j<dataleft.length;j++)
                    {
                      //console.log("@@@@@@@@@@@@@@@@@@"+j);
                      for(var k=0;k<that.state.askedcareers.length;k++)
                      {
                        //console.log(that.state.askedcareers[k]+ " " +dataleft[j])
                        if(that.state.askedcareers[k]==dataleft[j])
                        {
                          //console.log("@@@@@@@@@@@@@@@@@@");
                          count++;
                          break;
                        }
                      }
                    }
                    //console.log(that.state.askedcareers);
                    //console.log(count);
                    if(count==dataleft.length)
                    {
                      var k = 0;
                      for(k=0;k<that.state.suggestedcareers.length;k++)
                      {
                        if(dataright[0]==that.state.suggestedcareers[k]) break;
                      }
                      if(k==that.state.suggestedcareers.length)
                      {
                        that.onReceive("You my also search for career like : "+dataright[0]);
                        //issuggested = true;
                        var tempArr = that.state.suggestedcareers;
                        tempArr.push(dataright[0]);
                        that.setState({
                          suggestedcareers: tempArr
                        });
                      }
                    }
                    //console.log("!!!!!!!!!!!!!!!!!!!");
                    //console.log(dataleft);
                    //console.log(dataright);
                });
        })
        setTimeout(function afterTwoSeconds() {
          if(issuggested==true)
          {
            that.setState({
              issuggested : true
            })
          }
        }, 4000);
      }
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
    }, 3000)
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
            name: 'Chat Bot',
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
    color: '#000000',
  },
});
