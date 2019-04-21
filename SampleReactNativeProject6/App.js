import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import BoardScreen from './components/BoardScreen';
import BoardDetailScreen from './components/BoardDetailScreen';
import AddBoardScreen from './components/AddBoardScreen';
import EditBoardScreen from './components/EditBoardScreen';
import CollapsableList from './components/CollapsableList';
import ChatBot from './components/ChatBot';
import CareerList from './components/CareerList';
import FieldCareers from './components/FieldCareers';
import CareerDetail from './components/CareerDetail';
import chat_ui from './components/chat/chat_ui';
import Register from './components/Register';

const RootStack = createStackNavigator(
  {
    Board: BoardScreen,
    BoardDetails: BoardDetailScreen,
    AddBoard: AddBoardScreen,
    EditBoard: EditBoardScreen,
    CollapseList: CollapsableList,
    ChatBot: ChatBot,
    chat_ui:chat_ui,
    CareerList: CareerList,
    FieldCareers: FieldCareers,
    CareerDetail: CareerDetail,
    Register: Register
  },
  {
    initialRouteName: 'Board',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#777777',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
);

const App = createAppContainer(RootStack);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
*/
