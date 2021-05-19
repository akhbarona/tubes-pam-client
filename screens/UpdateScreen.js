import React, { useEffect, useState} from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import CurrencyInput from "react-native-currency-input";

import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
const UpdateScreen = ({route, navigation}) => {

    const [post, setPost] = useState({
        income: null,
        spending: null,
        note: '',
        isValidIncome: true,
        isValidSpending: true,
        isValidNote: true
    })

    const { id_user, id_post, refresh } = route.params;

    useEffect(()=>{
        getData()
    },[])
    const getData = async () => {
        await fetch('https://tubes-pam-server.herokuapp.com/server.php?op=showdatapost&id='+id_post+'&id_user='+id_user).then((res)=> res.json())
        .then((json)=>{
            setPost({...post, income: json.data.result[0].income, spending: json.data.result[0].spending, note: json.data.result[0].note })
        }).catch((err)=>{console.log(err)})
    }

    const updatePost = (income,spending,note) => {
      if(income ===null && spending===null ){
        Alert.alert("Warning!", "income or spending minimum 0", [{ text: "Okay" }])
      }else if(income===null){
        Alert.alert("Warning!", "income minimum 0", [{ text: "Okay" }])
      }else if(spending===null){
        Alert.alert("Warning!", "spending minimum 0", [{ text: "Okay" }])
      }else{
        const validationCreate = async () => {
            fetch('https://tubes-pam-server.herokuapp.com/server.php?op=update&id='+id_post+'&id_user='+id_user,{ 
                method:'POST',
                header:{
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                  },
            body:JSON.stringify({
            income: income,
            spending: spending,
            note: note
                }),
            }).then((res)=>res.json()).then((json)=> { 
              if(json.data.result=='Data berhasil diupdate'){
              Alert.alert("Success!", "Data berhasil diupdate.", [{ text: "Okay" }])
                navigation.goBack()

            }else{
                Alert.alert("failed!", "Gagal diupdate.", [{ text: "Okay" }])
            }
        }).catch((err)=>{console.error(err)})
        }
        validationCreate()
      }
  }

  const handleIncome = (val) => {
    if(isNaN(val)){
      console.log('ini bukan number')
      setPost({
        ...post,
        income: null,
        isValidIncome: false
      })
    }else{
      setPost({
        ...post,
        income: val,
        isValidIncome: true
      })
    }
  }
  const handleSpending = (val) => {
    if(isNaN(val)){
      console.log('ini bukan number')
      setPost({
        ...post,
        spending: null,
        isValidSpending: false
      })
    }else{
      setPost({
        ...post,
        spending: val,
        isValidSpending: true
      })
    }
  }
  const handleNote = (val) => {
    if(val.trim().length!=0){
      setPost({
        ...post,
        note: val,
        isValidNote: true
      })
    }else{
      setPost({
        ...post,
        note: '',
        isValidNote: false
      })
    }
  }

  return (
      <ScrollView>
    <View style={styles.container}>
      <Text style={styles.text}>Income : </Text>
      <View style={styles.bodyField}>
      <CurrencyInput
        style={styles.InputMoney}
        placeholder="nominal input"
        value={post.income}
        prefix="Rp "
        onChangeValue={(e) => handleIncome(e)}
        delimiter="."
        precision={0}
        keyboardType="numeric"
      />
      </View>
      <Text style={styles.text}>Spending : </Text>
      <View style={styles.bodyField}>
      <CurrencyInput
        style={styles.InputMoney}
        placeholder="nominal input"
        value={post.spending}
        prefix="Rp "
        onChangeValue={(e) => handleSpending(e)}
        delimiter="."
        precision={0}
        keyboardType="numeric"
      />
      </View>
      <Text style={styles.text}>Note : </Text>
      <View style={styles.bodyField}>
      <TextInput style={styles.note} placeholder="input note!!"
      multiline={true}
      numberOfLines={10}
      value={post.note}
      onChangeText={(e)=>{
        handleNote(e)
      }}
      />
      </View>
      <View style={styles.btn1}>
          <TouchableOpacity
            style={styles.btnCreate} onPress={()=>{updatePost(post.income,post.spending,post.note)}}   
            >
            <Text style={styles.textButton}>Simpan</Text>
          </TouchableOpacity>
        </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 5,
      marginTop: 10
    },
    bodyField: {
        alignItems: 'center'
    },
    InputMoney: {
      fontSize: 15,
      height: 40,
      width: "85%",
      borderBottomWidth: 1,
      marginBottom: 40,
    },
    note: {
      fontSize: 15,
      height: 130,
      width: "85%",
      backgroundColor: "#dedede",
      borderRadius: 5,
      textAlignVertical: 'top'
    },
    text: {
      fontSize: 20,
      paddingLeft: 25,
    },
    btn1: {
      marginTop: 5,
      marginBottom: 20,
      alignItems: 'center'
    },
    btnCreate: {
      backgroundColor: "#CC9902",
      borderRadius: 15,
      alignItems: "center",
      width: "85%",
      marginTop: 40,
      padding: 8,
    },
    textButton: {
      fontWeight: "500",
      fontSize: 20,
    },
  });

export default UpdateScreen