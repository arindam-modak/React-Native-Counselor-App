import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import firebase from '../Firebase';

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
        <View>
            <Text>
              {'Name'}{'\n'}
              {this.state.board.name}{'\n'}
            </Text>
            <Text>
              {'\n'}{'Summary'}{'\n'}
              {this.state.board.summary}
            </Text>
        </View>
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