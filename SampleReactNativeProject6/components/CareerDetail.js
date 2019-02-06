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
    this.ref = firebase.firestore().collection('AllCareers').where("name", "==", JSON.parse(this.props.navigation.getParam('CareerName')));
    this.unsubscribe = null;
    this.state = {
      
      isLoading: true,
      fields: []
    };
  }

  onCollectionUpdate = async (querySnapshot) => {
    const fields = [];
    await querySnapshot.forEach(async (doc) => {
      fields.push({
        key: doc.id,
        name: doc.name,
        career_path: doc.career_path,
        cons: doc.cons,
        entrance_exams: doc.entrance_exams,
        important_facts: doc.important_facts,
        institutions_abroad: doc.institutions_abroad,
        leading_colleges: doc.leading_colleges,
        professions: doc.professions,
        summary: doc.summary,
        superCareer: doc.superCareer,
        work_description: doc.work_description
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
        <View>
          this.state.fields.map((item, i) => (
            <Text>
              {'Name'}{'\n'}
              {item.name}{'\n'}
            </Text>
            <Text>
              {'\n'}{'Summary'}{'\n'}
              {item.summary}
            </Text>
          ))
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