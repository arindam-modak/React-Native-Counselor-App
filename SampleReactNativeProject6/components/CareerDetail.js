import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import firebase from '../Firebase';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { Thumbnail, Separator } from 'native-base';
import Panel from './components/Panel';
import Style from './Style';
import {
  Image,
  BackHandler } from 'react-native';
class CareerDetail extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Career Detail',
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      board: {},
      key: ''
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const ref = await firebase.firestore().collection('AllCareers').where('name','==',navigation.getParam('CareerName').toString().slice(1,-3));
    console.log(navigation.getParam('CareerName').toString().slice(1,-3));
    ref.get().then((snapshot) => {
      if (!snapshot.empty) {
        doc = snapshot.docs[0];
        this.setState({
          board: doc.data(),
          key: doc.id,
          isLoading: false
        });
      } else {
        console.log("No such document!");
      }
    });
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
      <ScrollView style={styles.container}>
         <Collapse>
                      <CollapseHeader>
                        <Separator bordered>
                          <Text>Summary</Text>
                        </Separator>
                      </CollapseHeader>
                      <CollapseBody>
                        <Text>{this.state.board.summary}</Text>
                      </CollapseBody>
                    </Collapse>

        <Collapse>
          <CollapseHeader>
              <Separator bordered>
              <Text>Career Opportunities</Text>
              </Separator>
          </CollapseHeader>
          <CollapseBody>
          {

          this.state.board.professions.map((item, i) => (
              Object.keys(item).map( (key, index) => (

              <Panel title={key}>
              <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'column'}} >
              
               <Text style={Style.list_item}>{item[key]}</Text>
              
               </View>
              </View>
              </Panel>
            ))
            ))
          }
          </CollapseBody>
      </Collapse>

     
      </ScrollView>
    );
  }
}

export default CareerDetail;

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingBottom: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
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