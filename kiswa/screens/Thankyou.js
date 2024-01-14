import React, { useEffect, useState } from "react";

import {
    StyleSheet,
    ImageBackground,
    Dimensions,
    StatusBar,
    KeyboardAvoidingView,
    TextInput,
    View,
    Platform,
    PixelRatio,
    Image,
    ScrollView
} from "react-native";
import { Block, Checkbox, Text, theme, Button } from "galio-framework";

import { Images, argonTheme } from "../constants";

import * as Location from "expo-location";
import { Alert } from "react-native";

const { width, height } = Dimensions.get("screen"); 
const scale = width / 834;

const Thankyou = ({ navigation }) => {
    return(
        <Block flex middle>
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
  
          <Block safe flex middle>
            <Block style={styles.registerContainer}>
                <Block style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{alignSelf: 'center', fontSize: 20, fontWeight: 'bold', margin: '5%', }}>Thankyou For Your Donation!</Text>
                <Text>Help us improve our app. How was your experience?</Text>

                <Button style={{alignSelf: 'center', marginTop: '10%'}} onPress={() => navigation.navigate('Home')}>GO BACK</Button>
                </Block>
          </Block>
        </Block>
      </ImageBackground>
    </Block>
    )
}

const styles = StyleSheet.create({
    registerContainer: {
      width: width * 0.9,
      height: height * 0.875,
      backgroundColor: "#F4F5F7",
      borderRadius: 10,
      shadowColor: argonTheme.COLORS.BLACK,
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowRadius: 8,
      shadowOpacity: 0.1,
      elevation: 1,
      overflow: "hidden",
    },
    passwordCheck: {
      paddingLeft: 15,
      paddingTop: 13,
      paddingBottom: 30
    },
    createButton: {
      width: width * 0.5,
      marginTop: 25,
      alignSelf: 'center'
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      width: '80%',
      height: 40,
      margin: 15,
      borderWidth: 1,
      padding: 10,
      borderRadius: 10
    },
    error: {
      color: 'red',
    },
    button: {
      width: width - theme.SIZES.BASE * 4,
      height: theme.SIZES.BASE * 3,
      shadowRadius: 0,
      shadowOpacity: 0
    },
  });


export default Thankyou;
