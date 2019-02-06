import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import firebase from '../Firebase';

class CareerList extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Career List',
    };
  };

  constructor() {
    super();
    this.ref = firebase.firestore().collection('Fieldlist');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      fields: []
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const fields = [];
    querySnapshot.forEach((doc) => {
      const { name, careers } = doc.data();
      fields.push({
        key: doc.id,
        doc, // DocumentSnapshot
        name,
        careers,
      });
    });
    this.setState({
      fields,
      isLoading: false,
   });
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
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
        <List>
          {
            this.state.fields.map((item, i) => (
              <ListItem
                key={i}
                title={item.name}
                leftIcon={{name: 'book', type: 'font-awesome'}}
                
              />
            ))
          }
        </List>
      </ScrollView>
    );
  }
}

export default CareerList;

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