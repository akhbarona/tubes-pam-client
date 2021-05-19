import React, { useState } from "react";
import {View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, ScrollView} from "react-native";

import * as Animatable from "react-native-animatable";
import Feather from "react-native-vector-icons/Feather";
import { Input } from "react-native-elements";


const SignInScreen = ({ navigation }) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    check_textInputChangeName: false,
    check_textInputChangeEmail: false,
    checkValidEmail: true,
    checkRegEmail: true,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
    isValidName: false,
    isValidEmail: true,
    isValidPassword: false,
    isValidConfirmPassword: false,
  });

  //untuk validasi jumlah string nama
  const textInputChangeName = (val) => {
    if (val.trim().length != 0) {
      setData({
        ...data,
        name: val,
        check_textInputChangeName: true,
        isValidName: true
      });
    } else {
      setData({
        ...data,
        name: val,
        check_textInputChangeName: false,
        isValidName: false
      });
    }
  };

  //untuk validasi jumlah string email
  const textInputChangeEmail = (val) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if (val.trim().length != 0) {
      if(reg.test(val) === false){
        setData({
          ...data,
          email: val,
          check_textInputChangeEmail: true,
          checkValidEmail: true,
          checkRegEmail: false
        });
      }else{
        setData({
          ...data,
          email: val,
          check_textInputChangeEmail: true,
          checkValidEmail: true,
          checkRegEmail: true
        });
      }
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChangeEmail: false,
        checkValidEmail: false,
      });
    }
  };

  //untuk validasi jumlah string password
  const handlePasswordChange = (val) => {
    if (val.trim().length >=8) {
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
  const handleConfirmPasswordChange = (val) => {
    if(val.trim().length == data.password.length && val.trim() == data.password){
      setData({
        ...data,
        confirm_password: val,
        isValidConfirmPassword: true
      });
    }else{
      setData({
        ...data,
        confirm_password: val,
        isValidConfirmPassword: false
      });

    }
  };


  //untuk hide/show passsword dan on/off icon eye
  const updateScureTextEntry = (val) => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  const updateConfirmScureTextEntry = (val) => {
    setData({
      ...data,
      confirm_secureTextEntry: !data.confirm_secureTextEntry,
    });
  };

  const signupHandle = (name, email, password) => {
    fetch('https://tubes-pam-server.herokuapp.com/server.php?op=create', {
      method:'post',
			header:{
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body:JSON.stringify({
				name: name,
				email: email,
				password: password,
			}),
    }).then((res)=>res.json()).then((json)=> {
      if(json=="email already exist"){
        setData({
          ...data,
          email: '',
          isValidEmail: false
        })
      }else{
        Alert.alert("Success!", "User registered Successfully.", [{ text: "Okay" },])
        navigation.goBack()
      }
    }).catch((err)=>{console.error(err)})

  };

  return (
    <ScrollView
    contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    >
    <Animatable.View style={styles.container} animation="slideInUp" duration={200}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <Input
        containerStyle={styles.inputBox}
        label="Nama: "
        labelStyle={styles.labelInput}
        rightIcon={
          data.check_textInputChangeName ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="#CC9902" size={35} />
            </Animatable.View>
          ) : null
        }
        rightIconContainerStyle={styles.icon}
        onChangeText={(val) => textInputChangeName(val)}
        autoCapitalize='words'
      />

      <Input
        containerStyle={styles.inputBox}
        label="Email: "
        labelStyle={styles.labelInput}
        rightIcon={
          data.check_textInputChangeEmail ? (
            <Animatable.View animation="bounceIn">
              <Feather
                name="check-circle"
                color="#CC9902"
                size={35}
              />
            </Animatable.View>
          ) : null
        }
        rightIconContainerStyle={styles.icon}
        onChangeText={(val) => textInputChangeEmail(val)}
        autoCapitalize="none"
        value={data.email}
        errorMessage={
          data.checkValidEmail ? (data.checkRegEmail ?  ( data.isValidEmail ? null : (
            <Animatable.Text
              animation="fadeInLeft"
              duration={500}
              style={styles.errorMsg}
            >
              email already exist.
            </Animatable.Text>
          ))  : (
            <Animatable.Text
            animation="fadeInLeft"
            duration={500}
            style={styles.errorMsg}
          >
            email not standart.
          </Animatable.Text>
          ))  : (data.check_textInputChangeEmail && data.checkValidEmail ? null : (
            <Animatable.Text
            animation="fadeInLeft"
            duration={500}
            style={styles.errorMsg}
          >
            email must not be empty.
          </Animatable.Text>
          ) )
        }
      />

      <Input
        containerStyle={styles.inputBox}
        secureTextEntry={data.secureTextEntry ? true : false}
        label="Password: "
        labelStyle={styles.labelInput}
        // placeholder="INPUT WITH CUSTOM ICON"
        rightIcon={
          <TouchableOpacity onPress={updateScureTextEntry}>
            {data.secureTextEntry ? (
              <Feather
                style={styles.icon}
                name="eye-off"
                color="#CC9902"
                size={35}
              />
            ) : (
              <Feather
                style={styles.icon}
                name="eye"
                color="#CC9902"
                size={35}
              />
            )}
          </TouchableOpacity>
        }
        rightIconContainerStyle={styles.icon}
        onChangeText={(val) => handlePasswordChange(val)}
        autoCapitalize="none"
        errorMessage={
          data.password.trim().length==0 ? null : (data.isValidPassword ? null : (
            <Animatable.Text
              animation="fadeInLeft"
              duration={500}
              style={styles.errorMsg}
            >
              Password must be 8 characters.
            </Animatable.Text>
          ))
        }
      />

      <Input
        containerStyle={styles.inputBox}
        secureTextEntry={data.confirm_secureTextEntry ? true : false}
        label="Confirm Password: "
        labelStyle={styles.labelInput}
        // placeholder="INPUT WITH CUSTOM ICON"
        rightIcon={
          <TouchableOpacity onPress={updateConfirmScureTextEntry}>
            {data.confirm_secureTextEntry ? (
              <Feather
                style={styles.icon}
                name="eye-off"
                color="#CC9902"
                size={35}
              />
            ) : (
              <Feather
                style={styles.icon}
                name="eye"
                color="#CC9902"
                size={35}
              />
            )}
          </TouchableOpacity>
        }
        rightIconContainerStyle={styles.icon}
        onChangeText={(val) => handleConfirmPasswordChange(val)}
        autoCapitalize="none"
        errorMessage={
          data.confirm_password.trim().length==0 ? null :
          (data.isValidConfirmPassword? null : (
            <Animatable.Text
              animation="fadeInLeft"
              duration={500}
              style={styles.errorMsg}
            >
              Confirm password not same.
            </Animatable.Text>
          ))
        }
      />

      <View style={styles.buttonSignupStyle}>
          <TouchableOpacity
            style={styles.btnSignup}
            onPress={() => {
              data.isValidName && data.checkRegEmail && data.isValidEmail && data.isValidPassword && data.isValidConfirmPassword == true ? signupHandle(data.name, data.email, data.password) :
              alert('Mohon isi dengan benar')
              
            }}
          >
            <Text style={styles.textButton}>Signup</Text>
          </TouchableOpacity>
        </View>

        {/** button signin */}
        <View style={styles.buttonSigninStyle}>
          <Text style={styles.signinText}>Already have an account ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
            <Text style={styles.textButton}>Signin</Text>
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
    marginTop: 30
  },
  btnSignup: {
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
  signinText: {
    color: "rgba(0,0,0,0.5)",
    fontSize: 16,
  },
  icon: {
    position: "relative",
    marginVertical: 0,
  },
  buttonSigninStyle: {
    flexGrow: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingVertical: 16,
    flexDirection: "row",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 12,
  },
});
