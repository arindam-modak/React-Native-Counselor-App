import React, { Component } from 'react';
import { StyleSheet, StatusBar,ScrollView, ActivityIndicator, View, Text, Image, TextInput, Dimensions } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import firebase from '../Firebase';
import { PieChart } from 'react-native-chart-kit';


class popularCareers extends Component {

  static navigationOptions = {
    title: 'Popular Careers',
    headerStyle: {
      backgroundColor: '#FDBC5E',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: []
    };
    
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  componentDidMount() {
    let that = this;
    let tempArr = [];
    let tempDict = {};
    var times = 0;
    firebase.firestore().collection("Users")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                if(doc.exists)
                {
                  console.log(doc.data());
                  var temp1 = doc.data();
                  if(temp1.Searches)
                  {
                    times = times + 1;
                    console.log(temp1.Searches.length);
                    //temp.push(doc.data());
                    for(var i=0;i<temp1.Searches.length;i++)
                    {
                      if(tempDict[temp1.Searches[i]])
                      {

                        tempDict[temp1.Searches[i]] = tempDict[temp1.Searches[i]] + 1;
                        
                      }
                      else
                      {
                        tempDict[temp1.Searches[i]] = 1;
                      }
                    }
                  }
                }
            });
    })
    .catch(function (error) {
         this.props.navigation.navigate('board');
     });
    
    setTimeout(function afterTwoSeconds() {
      console.log(tempDict);
      for(var key in tempDict)
      {
          console.log(key);
          tempArr.push({'name': key, 'times': tempDict[key]});
      }
      

    }, 3000);

    setTimeout(function afterTwoSeconds() {
      console.log("!!!!!!!!!!!!!!!!!!!");
      console.log(tempArr);
      if(tempArr)
      {
        tempArr.sort(function(a, b){
            return b.times - a.times;
        });
      }
    }, 5000);

    setTimeout(function afterTwoSeconds() {
      var tempData = [];
      var total = 0.0;
      if(tempArr)
      {
        for(var i=0;i<10;i++)
        {
          total += tempArr[i]['times'];
        }
        for(var i=0;i<10;i++)
        {
          tempData.push({'name': '% '+tempArr[i]['name'], 'times': Math.round((tempArr[i]['times']/total)*100), color: that.getRandomColor(), legendFontColor: '#7F7F7F', legendFontSize: 15});
        }
        that.setState({
          isLoading : false,
          data : tempData 
        });
      }
    }, 7000);

  }

  render() {

    const screenWidth = Dimensions.get('window').width - 20;

    chartConfig={
      backgroundColor: '#e26a00',
      backgroundGradientFrom: '#fb8c00',
      backgroundGradientTo: '#ffa726',
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      }
    };

    const data = this.state.data;

 
    if(this.state.isLoading){
      return(
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff"/>
          </View>
      )
    }
    return (
        <ScrollView style={{flex: 1}}>
          <View style={styles.container}>
            <StatusBar
              hidden={true}
            />
            <Text style={styles.title}>Popularity Stats</Text>
            <PieChart
              data={this.state.data}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              accessor="times"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </ScrollView>
    );

  }
}

export default popularCareers;

const styles = StyleSheet.create({
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    margin: 10
  }
})
