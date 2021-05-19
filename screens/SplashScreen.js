import React, { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  ImageBackground,
} from "react-native";

import * as Animatable from "react-native-animatable";

const SplashScreen = ({ navigation }) => {
  useEffect(()=>{
    setTimeout(()=>{
        navigation.replace('SignInScreen')
    },3000)
  },[])

  return (
    <ImageBackground style={styles.container}>
      <Animatable.Image  animation="bounceIn" source={require("../assets/gambar/bukukas-logo.png")} style={styles.logo} />
    </ImageBackground>
  );
};
export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gold",
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
});
