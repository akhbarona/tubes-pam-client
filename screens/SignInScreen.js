import React, { useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";

import * as Animatable from "react-native-animatable";
import Feather from "react-native-vector-icons/Feather";
import { Input } from "react-native-elements";
import { SocialIcon } from "react-native-elements";
import { AuthContext } from "../components/context";

import * as Google from 'expo-google-app-auth';

const SignInScreen = ({ navigation }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
    check_texInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });
  const { signIn, signInGoogle } = useContext(AuthContext);

  //aktifkan icon apabila ada text yang dimasukkan
  const textInputChange = (val) => {
    if (val.trim().length >0) {
      setData({
        ...data,
        email: val,
        check_texInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_texInputChange: false,
        isValidUser: false,
      });
    }
  };

  //untuk menghandle value password
  const handlePasswordChange = (val) => {
    if (val.trim().length >0) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  //untuk kondisi show/hide password
  const updateScureTextEntry = (val) => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const loginHandle = (email, password) => {
    if (data.email.length == 0 && data.password.length == 0) {
      Alert.alert("Wrong Input!", "email and password field cannot be empty.", [{ text: "Okay" }]);
    }else if(data.email.length == 0 ){
      Alert.alert("Wrong Input!", "email field cannot be empty.", [{ text: "Okay" }]);
    }else if(data.password.length == 0 ){
      Alert.alert("Wrong Input!", "password field cannot be empty.", [{ text: "Okay" }]);
    }else{
    fetch('https://tubes-pam-server.herokuapp.com/server.php?op=login', {
      method:'post',
			header:{
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body:JSON.stringify({
				// we will pass our input data to server
				email: email,
				password: password
			}),
    }).then((res)=>res.json()).then((json)=> {
      if(json=="wrong password"){
        Alert.alert("Invalid password!", "password is incorrect.", [{ text: "Okay" }])
      }else if(json=="email not registered"){
        Alert.alert("Invalid user!", "email not registered.", [{ text: "Okay" }])
      }else{
        // console.log(JSON.stringify(json))
        signIn(json);
      }
    }).catch((err)=>{console.error(err)})
  }
  };

const signUpGoogle = (result) =>{
  fetch('https://tubes-pam-server.herokuapp.com/server.php?op=creategoogle', {
    method:'post',
    header:{
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body:JSON.stringify({
      // we will pass our input data to server
      name: result.user.name,
      email: result.user.email,
    }),
  }).then((res)=>res.json()).then((json)=> {
    if(json=='user and email already exist'){
       signInGoogle(result)
    }else{
      console.log(json.data.result)
      signInGoogle(result)
    }
  }).catch((err)=>{console.error(err)})
}

  const signWithGoogle = () => {
    const signed = async () => {
      try {
        const result = await Google.logInAsync({
          androidClientId: "686196017733-62o4m8ctb9oc928u6jfbagnudqe9tm18.apps.googleusercontent.com",
          scopes: ["profile", "email"]
        })
        if (result.type === "success") {
          // console.log(result)
          signUpGoogle(result)
          // signInGoogle(result)
        } else {
          console.log("cancelled")
        }
      } catch (e) {
        console.log("error", e)
      }
    }
    signed()
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    >
      <Animatable.View style={styles.container} animation="zoomIn">
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <View style={styles.logo}></View>
        {/** body */}
        <View style={styles.inputStyle}>
          {/** textinput email */}
          <Input
            containerStyle={styles.inputBox}
            inputContainerStyle={data.isValidUser ? null : styles.borderError}
            autoCapitalize='none'
            label="E-mail : "
            labelStyle={styles.labelInput}
            // placeholder="INPUT WITH CUSTOM ICON"
            rightIcon={
              data.check_texInputChange ? (
                /** animatable memberikan efek pada icon saat muncul */
                <Animatable.View animation="bounceIn">
                  <Feather
                    // style={styles.icon}
                    name="check-circle"
                    color="#CC9902"
                    size={35}
                  />
                </Animatable.View>
              ) : null
            }
            rightIconContainerStyle={styles.icon}
            onChangeText={(val) => textInputChange(val)}
            errorMessage={
              data.isValidUser ? null : (
                <Animatable.Text
                  animation="fadeInLeft"
                  duration={500}
                  style={styles.errorMsg}
                >
                  email must not be empty.
                </Animatable.Text>
              )
            }
          />
        </View>
        <View style={styles.inputStyle}>
          {/** textinput password */}
          <Input
            containerStyle={styles.inputBox}
            label="Password : "
            labelStyle={styles.labelInput}
            secureTextEntry={data.secureTextEntry ? true : false}
            inputContainerStyle={
              data.isValidPassword ? null : styles.borderError
            }
            // placeholder="INPUT WITH CUSTOM ICON"
            rightIcon={
              <TouchableOpacity onPress={updateScureTextEntry}>
                {/** icon eye-off aktif akan bernilai true dan password tidak terlihat  */}
                {data.secureTextEntry ? (
                  <Feather
                    // style={styles.icon}
                    name="eye-off"
                    color="#CC9902"
                    size={35}
                  />
                ) : (
                  <Feather
                    // style={styles.icon}
                    name="eye"
                    color="#CC9902"
                    size={35}
                  />
                )}
              </TouchableOpacity>
            }
            onChangeText={(val) => handlePasswordChange(val)}
            errorMessage={
              data.isValidPassword ? null : (
                <Animatable.Text
                  animation="fadeInLeft"
                  duration={500}
                  style={styles.errorMsg}
                >
                  Password must not be empty.
                </Animatable.Text>
              )
            }
          />
        </View>
        {/** button signin */}
        <View style={styles.buttonSigninStyle}>
          <TouchableOpacity
            style={styles.btnLogin}
            onPress={() => {
              loginHandle(data.email, data.password);
            }}
          >
            <Text style={styles.textButton}>login</Text>
          </TouchableOpacity>
        </View>
        <SocialIcon
          title="Sign In With Google"
          button
          type="google"
          onPress={() => signWithGoogle()}
        />
        {/** button signup */}
        <View style={styles.buttonSignupStyle}>
          <Text style={styles.signupText}>Don't have an account yet ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
            <Text style={styles.textButton}> Signup</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </ScrollView>
  );
};
export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
  },
  logo: {
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  inputStyle: {
    alignItems: "center",
    flexBasis: 100,
  },
  labelInput: {
    fontSize: 17,
    color: "#ff8c00",
  },
  inputBox: {
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  borderError: {
    borderColor: "red",
    borderBottomWidth: 2,
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 12,
  },
  btnLogin: {
    backgroundColor: "rgb(204,153,2)",
    borderRadius: 30,
    alignItems: "center",
    paddingVertical: 14,
    margin: 7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 7,
  },
  textButton: {
    textTransform: "uppercase",
    fontWeight: "500",
    fontSize: 17,
  },
  signupText: {
    color: "rgba(0,0,0,0.5)",
    fontSize: 16,
  },
  icon: {
    position: "relative",
    marginVertical: 0,
  },
  buttonSignupStyle: {
    flexGrow: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingVertical: 16,
    flexDirection: "row",
  },
});
