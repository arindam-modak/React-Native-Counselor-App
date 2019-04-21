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
        constructor() {
          super();
          this.state = {
        
          };
        }
        updateTextInput = (text, field) => {
          const state = this.state
          state[field] = text;
          this.setState(state);
        }
       
        
        render() {
        
          return (
            <ScrollView style={styless.container}>
            <View style={styless.question}>
            <Card style={{borderRadius:15}}>
                    <CardTitle 
                      title={<Text style={{fontSize:40}}>Question 1</Text>}
                      titleStyle={{fontSize:200}}
                      style={{marginTop:10,marginBottom:100,fontSize:200}}
                     />
                    <CardContent text={<Text style={{fontSize:30,fontStyle: 'italic'}}>Here is you first question................................................................</Text>} />  
                  </Card>
            </View>
                  <View style={styless.container3}>
                    <View style={styless.container4}>
                        <Button buttonStyle={styless.button}
                        type="outline"
                        large
                      //  leftIcon={{name: 'list'}}
                        title={<Text style= {{color:'#000000'}}>Yes</Text>}
                        onPress={() => {
                        //this.props.navigation.navigate('CareerList');
                        }}
                        />
                    </View>
                    <View style={styless.container4}>
                        <Button buttonStyle={styless.button}
                        large
                        type="outline"
                      //  leftIcon={{name: 'face'}}
                        title={<Text style= {{color:'#000000'}}>No </Text>}
                        onPress={() => {
                       // this.props.navigation.navigate('chat_ui');
                        }} />
                    </View>
                </View>
             
            </ScrollView>
          );
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
