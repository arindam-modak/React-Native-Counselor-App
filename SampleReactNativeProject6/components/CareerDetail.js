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
import { Platform,  StatusBar, SafeAreaView } from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from './src/styles/SliderEntry.style';
import SliderEntry from './src/components/SliderEntry';
import styles, { colors } from './src/styles/index.style';
import { ENTRIES1, ENTRIES2 } from './src/static/entries';
import { scrollInterpolators, animatedStyles } from './src/utils/animations';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'


const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;


class CareerDetail extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Career Detail',
      headerStyle: {
      backgroundColor: '#FDBC5E',
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      isLoading: true,
      board: {},
      key: ''
    };
  }
  _renderItem ({item, index}) {
    return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
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
      _renderItemWithParallax ({item, index}, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              //even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
            />
        );
    }

    _renderLightItem ({item, index}) {
        return <SliderEntry data={item} even={false} />;
    }

    _renderDarkItem ({item, index}) {
        return <SliderEntry data={item} even={true} />;
}
layoutExample (number, title, type) {
        const isTinder = type === 'tinder';
        return (
            <View style={[styles.exampleContainer, isTinder ? styles.exampleContainerDark : styles.exampleContainerLight]}>
                <Carousel
                  data={isTinder ? ENTRIES2 : ENTRIES1}
                  renderItem={isTinder ? this._renderLightItem : this._renderItem}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  layout={type}
                  loop={true}
                />
            </View>
        );
}
  mainExample (number, title) {
        const { slider1ActiveSlide } = this.state;

        return (
            <View style={styles.exampleContainer}>
                <Carousel
                  ref={c => this._slider1Ref = c}
                  data={ENTRIES1}
                  renderItem={this._renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={true}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.7}
                  // inactiveSlideShift={20}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  loop={false}
                  loopClonesPerSide={2}
                  autoplay={false}
                  autoplayDelay={500}
                
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />
                <Pagination
                  dotsLength={ENTRIES1.length}
                  activeDotIndex={slider1ActiveSlide}
                  containerStyle={styles.paginationContainer}
                  dotColor={'rgba(255, 255, 255, 0.92)'}
                  dotStyle={styles.paginationDot}
                  inactiveDotColor={colors.black}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={this._slider1Ref}
                  tappableDots={!!this._slider1Ref}
                />
            </View>
        );
}
 
  render() {
    if(this.state.isLoading){
      return(
          <View style={styless.activity}>
            <ActivityIndicator size="large" color="#0000ff"/>
          </View>
      )
    }
    const numbers=[]; 
    const example4 = this.layoutExample(4, '"Tinder-like" layout | Loop', 'tinder');
    const example3 = this.layoutExample(3, '"Stack of cards" layout | Loop', 'stack');
    const example1 = this.mainExample(1, 'Default layout | Loop | Autoplay | Parallax | Scale | Opacity | Pagination with tappable dots');
    return (
      <ScrollView style={styless.container}>
         <Collapse duration={300}>
                      <CollapseHeader>
                        <Separator bordered style={styless.sep}>
                          <Text style={styless.item}>Summary</Text>
                        </Separator>
                      </CollapseHeader>
                      <CollapseBody style={{borderWidth:5,borderColor:"#FDBC5E"}}>
                        <Text style={{padding:15}}>{this.state.board.summary}</Text>
                      </CollapseBody>
                    </Collapse>

        <Collapse collapsedHeight="2">
          <CollapseHeader containerStyle={{backgroundColor:"#ffedd2"}}>
              <Separator bordered style={styless.sep}>
              <Text style={styless.item}>Career Opportunities</Text>
              </Separator>
          </CollapseHeader>
          <CollapseBody style={{borderWidth:4,borderColor:"#FDBC5E"}} >
          {

          this.state.board.professions.map((item, i) => (
              Object.keys(item).map( (key, index) => (

              <Panel title={key} height={1} key={index}>
              <View style={{flex: 1, flexDirection: 'row', borderWidth: 3, borderColor:"#FDBC5E"}}>
              <View style={{flex: 1, flexDirection: 'column', borderWidth: 3, borderColor:"#FDBC5E"}} >
              
               <Text style={{padding:20}}>{item[key]}</Text>
              
               </View>
              </View>
              </Panel>
            ))
            ))
          }
          </CollapseBody>
      </Collapse>
       <Collapse collapsedHeight="2">
          <CollapseHeader>
              <Separator bordered style={styless.sep}>
              <Text style={styless.item}>Path</Text>
              </Separator>
          </CollapseHeader>
          <CollapseBody style={{borderWidth:4,borderColor:"#FDBC5E"}}>
          {
              this.state.board.career_path.map((item, i) => (
              <Panel title={"Path " + (i+1)} height={1} titleStyle={styless.list} key={i}>
              <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'column'}} >
             {
                   <Card >
                    <CardTitle 
                     title="Stream"
                     style={{marginTop:-20,fontSize:20}}
                     />
                    <CardContent text={item['stream']} />  
                  </Card>
              }
              {
                  <Card>
                    <CardTitle 
                      title="Graduation" 
                      style={{marginTop:-20}}
                     />
                    <CardContent text={item['graduation']} textStyle={{fontSize:20}} />  
                  </Card>
              }
              {
                  <Card>
                    <CardTitle 
                      title="Post Graduation" 
                      style={{marginTop:-20}}
                     />
                    <CardContent text={item['after-graduation']} />  
                  </Card>
              }
              {
                  <Card>
                    <CardTitle 
                      title="After Post Graduation" 
                      style={{marginTop:-20}}
                     />
                    <CardContent text={item['after-post-graduation']} />  
                  </Card>
              }
           </View>
          </View>
          </Panel>    
          ))    
         }
       
          </CollapseBody>
      </Collapse>
      </ScrollView>
    );
//     return (
//             <SafeAreaView style={styles.safeArea}>
//                 <View style={styles.container}>
//                     <StatusBar
//                       translucent={true}
//                       backgroundColor={'rgba(0, 0, 0, 0.3)'}
//                       barStyle={'light-content'}
//                     />
//                     { this.gradient }
//                     <ScrollView
//                       style={styles.scrollview}
//                       scrollEventThrottle={200}
//                       directionalLockEnabled={true}
//                     >
//                         { example3 }
                        
                        
//                     </ScrollView>
//                 </View>
//             </SafeAreaView>
// );
  }
}

export default CareerDetail;

const styless = StyleSheet.create({
  container: {
   flex: 1,
   paddingBottom: 100,
  },
  item: {
    paddingTop: 10,
    fontSize: 20,
    height: 44,
    // textAlign: 'center',

  },
  list:{
    padding: 15,
    fontWeight: "bold",
    color: "#000000",
    fontSize: 20,
  },
  sep:{

    height:50,
    backgroundColor:"#ffedd2",
    borderWidth: 5,
    borderRadius:5,
    borderBottomWidth:5,
    borderColor: '#FDBC5E'
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