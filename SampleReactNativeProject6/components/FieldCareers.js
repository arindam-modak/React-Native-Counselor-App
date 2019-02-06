import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import firebase from '../Firebase';

class FieldCareers extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Careers',
    };
  };

  constructor() {
    super();
    this.state = {
      isLoading: false,
      Careers: [],
      FieldName: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const ref = JSON.parse(navigation.getParam('FieldName'));
      this.setState({
        Careers: JSON.parse(navigation.getParam('Careers')),
        FieldName: JSON.parse(navigation.getParam('FieldName')),
        isLoading: false
      });
  }

  render() {
    if(this.state.isLoading){
      return(
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
      )
    }
    return (
      <ScrollView style={styles.container}>
        <List>
          {
            this.state.Careers.map((item, i) => (
              <ListItem
                key={i}
                title={item}
                leftIcon={{name: 'book', type: 'font-awesome'}}
                
              />
            ))
          }
        </List>
      </ScrollView>
    );
  }
}

export default FieldCareers;

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