import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput, TouchableHighlight,Text } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from '../Firebase';
import {AsyncStorage} from 'react-native';
import styles, { colors } from './src/styles/index.style';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'

 class App extends Component {
        static navigationOptions = {
          title: 'Psychometric Test',
          headerStyle: {
            backgroundColor: '#FDBC5E',
          },
        };
        constructor(props) {
          super(props);
          this.state = {
             //isLoading: false
          };
        }
        updateTextInput = (text, field) => {
          const state = this.state
          state[field] = text;
          this.setState(state);
        }
       
        
        render() {
           // const questions = ["question1","question2"];
          const questions = this.props.navigation.getParam('QuestionList');
          const ques = this.props.navigation.getParam('Questionno');
          let q = ques+1;
          let Artistic= this.props.navigation.getParam('Artistic');
          let Conventional= this.props.navigation.getParam('Conventional');
          let Enterprising= this.props.navigation.getParam('Enterprising');
          let Investigative= this.props.navigation.getParam('Investigative');
          let Realistic= this.props.navigation.getParam('Realistic');
          let Social= this.props.navigation.getParam('Social');
          if(ques>0 && ques!=questions.length)
          {
            if(this.props.navigation.getParam('answer')=="yes")
            {
              if(questions[ques-1].Tag=="Artistic") Artistic++;
              if(questions[ques-1].Tag=="Conventional") Conventional++;
              if(questions[ques-1].Tag=="Enterprising") Enterprising++;
              if(questions[ques-1].Tag=="Investigative") Investigative++;
              if(questions[ques-1].Tag=="Realistic") Realistic++;
              if(questions[ques-1].Tag=="Social") Social++;
            }

          }

            // this.setState({
            //   isLoading: true
            // })
          
            let arr = [];
            let listchoices = [];
            let carchoice = "";
            arr.push({'score': Artistic, 'name' : 'Artistic'});
            arr.push({'score': Conventional, 'name': 'Conventional'});
            arr.push({'score': Enterprising, 'name' : 'Enterprising'});
            arr.push({'score': Investigative, 'name' : 'Investigative'});
            arr.push({'score': Realistic, 'name' : 'Realistic'});
            arr.push({'score': Social, 'name' : 'Social'});
            arr.sort(function(a,b){
              return a.score > b.score ? 1 : -1;
            });

            firebase.firestore().collection("AllCareers")
                .where(arr[0].name,'>=',arr[0].score-0.5)
                .where(arr[0].name,'<=',arr[0].score+0.5)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        if(doc.exists)
                        {
                          data = doc.data();
                          listchoices.push(data.name);
                          carchoice += data.name+", ";
                        }
                    });
                })
                // setTimeout(function afterTwoSeconds() {
                //   this.setState({
                //     isLoading : false
                //   })
                // }, 4000);
                
                // if(this.state.isLoading)
                // {
                //   return(
                //       <View style={styles.activity}>
                //         <ActivityIndicator size="large" color="#0000ff"/>
                //       </View>
                //   )
                // }

                let carchoice2= this.props.navigation.getParam('Carchoice');

                return(
                  <ScrollView style={styless.container}>
                    <View style={styless.question}>
                    <Card style={{borderRadius:15}}>
                            <CardTitle 
                              title={<Text style={{fontSize:40}}>{"Final Score : "}</Text>}
                              titleStyle={{fontSize:200}}
                              style={{marginTop:10,marginBottom:100,fontSize:200}}
                             />
                            <CardContent text={<Text style={{fontSize:20,fontStyle: 'italic'}}>{'Artistic : '+Artistic+'\nConventional : '+Conventional+'\nEnterprising : '+Enterprising+'\nInvestigative : '+Investigative+'\nRealistic : '+Realistic+'\nSocial : '+Social}</Text>} />  
                            <CardContent text={<Text style={{fontSize:20,fontStyle: 'italic'}}>{carchoice2}</Text>} />  

                          </Card>
                    </View>
                  </ScrollView>
                )
        }
      }
      
      export default App;
      
      const styless = StyleSheet.create({
        question:{
            flex:0.8,
            marginBottom:200,
          flexDirection: 'column',
        },
        container: {
          flex: 1,
          padding: 20,
          backgroundColor:'#ffffff',
        },
        bullet: {
            width: 10
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
        },
        detailButton: {
            marginTop: 10
          },
          button:{
            borderRadius:3,
            flex: 1,
            backgroundColor:'#FDBC5E',  
       },
          container3: {
            flex: 0.2,
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
      })
