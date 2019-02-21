import React, { Component } from 'react';
import {StyleSheet,Text,View,Image,TouchableHighlight,Animated} from 'react-native';
import Style from '../Style';
class Panel extends Component{
    constructor(props){
        super(props);

        this.icons = {
            'up'    : require('../assets/img/Arrowhead-01-128.png'),
            'down'  : require('../assets/img/Arrowhead-Down-01-128.png')
        };

        this.state = {
            title       : props.title,
            expanded    : false,
            animation   : new Animated.Value()
        };
    }

    toggle(){
        let initialValue    = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue      = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState({
            expanded : !this.state.expanded
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    }

    _setMaxHeight(event) {
       if (!this.state.maxHeight) {
         this.setState({
           maxHeight: event.nativeEvent.layout.height,
         });
       }
     }

     _setMinHeight(event) {
       if (!this.state.minHeight) {
         this.setState({
           minHeight: event.nativeEvent.layout.height,
           animation: new Animated.Value(event.nativeEvent.layout.height),
         });
       }
     }

    render(){
        let icon = this.icons['down'];

        if(this.state.expanded){
            icon = this.icons['up'];
        }

        return (
            <Animated.View
                style={[styles.container,{height: this.state.animation}]}>
                <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
                    <Text style={Style.list_header} onPress={this.toggle.bind(this)}>{this.state.title}</Text>
                    <TouchableHighlight
                        style={styles.button}
                        onPress={this.toggle.bind(this)}
                        underlayColor="#f1f1f1">
                        <Image
                            style={styles.buttonImage}
                            source={icon}
                        ></Image>
                    </TouchableHighlight>
                </View>
                <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
                    {this.props.children}
                </View>
            </Animated.View>
        );
    }
}

var styles = StyleSheet.create({
    container   : {
        backgroundColor: '#fff',
        
        borderWidth:4,
        //margin:5,
        borderColor: '#FDBC5E',
        overflow:'hidden'
    },
    titleContainer : {
        flexDirection: 'row',
        paddingBottom:10
    },
    title       : {
        fontStyle:'italic',
        flex    : 0.5,
        padding : 10,
        color   :'#2a2f43',
        fontWeight:'bold'
    },
    button      : {

    },
    buttonImage : {
        width   : 30,
        height  : 30
    },
    body        : {
        padding     : 0,
        paddingTop  : 0
    }
});

export default Panel;