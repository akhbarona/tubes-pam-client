import React, {useEffect, useState, memo } from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShowTableScreen from './ShowTableScreen'

const HomeScreen = ({navigation}) => {

    const [showTotal,setShowTotal] = useState([])
    const [showIncome,setShowIncome] = useState([])
    const [showSpending,setShowSpending] = useState([])

 const validationTotal = async () => {
        const isLogin = await AsyncStorage.getItem('id')
        await fetch('https://tubes-pam-server.herokuapp.com/server.php?op=showtotal&id_user='+isLogin)
        .then((res)=> res.json()).then((json)=>{
                if(json==="data tidak ada"){
                    setShowTotal([{total:0}])
                }else{
                    setShowTotal(json.data.result)
                }
        }).catch((err)=>{console.log(err)})
    }

   const validationIncome = async () => {
        const isLogin = await AsyncStorage.getItem('id')
        await fetch('https://tubes-pam-server.herokuapp.com/server.php?op=showincome&id_user='+isLogin)
        .then((res)=> res.json()).then((json)=>{
            if(json==="data tidak ada"){
                setShowIncome([{income:0}])
            }else{
                setShowIncome(json.data.result)
            }
        }).catch((err)=>{console.log(err)})
    }

  const validationSpending = async () => {
        const isLogin = await AsyncStorage.getItem('id')
        await fetch('https://tubes-pam-server.herokuapp.com/server.php?op=showspending&id_user='+isLogin)
        .then((res)=> res.json()).then((json)=>{
            if(json==="data tidak ada"){
                setShowSpending([{spending:0}])
            }else{
                setShowSpending(json.data.result)
            }
        }).catch((err)=>{console.log(err)})
    }
    useEffect(()=>{
        const unsubscribe = navigation.addListener('state', () => {
                validationTotal() 
                validationIncome() 
                validationSpending()
          });
          return unsubscribe
        }, []);

    return (
        <View style={styles.container}>
            <StatusBar animated={true} backgroundColor="black" />
            {
                showTotal.map((val,index)=>(
                <View style={styles.totalBox} key={index}>
                    <Text style={styles.textTotalBox}>TOTAL SALDO</Text>
                    <Text style={styles.textTotal}>{val.total}</Text>
                </View>
                ))
            }
            <View style={styles.incomespending}>
            {
                showIncome.map((val,index)=>(
                <View style={styles.incomebox} key={index}>
                    <Text style={styles.textincomespending}>Income</Text>
                    <Text style={styles.textBox}>{val.income}</Text>
                </View>
                ))
            }
            {
                showSpending.map((val,index)=>(
                <View style={styles.spendingbox} key={index}>
                    <Text style={styles.textincomespending}>Spending</Text>
                    <Text style={styles.textBox}>{val.spending}</Text>
                </View>
                ))
            }
            </View>
            <ShowTableScreen navigation={navigation} validationTotal={validationTotal} />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFF'
    },
    totalBox:{
        backgroundColor: '#ffa500',
        padding: 25,
        marginTop: 10,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    incomespending:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
        borderRadius: 30,
        marginTop: 10,
    },
    incomebox:{
        width: 170,
        backgroundColor: '#39FF14',
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius:30,
        borderBottomLeftRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    spendingbox:{
        width: 170,
        backgroundColor: '#DC143C',
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    textTotal: {
        color: 'white',
        fontSize: 20,
        top: 2,
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center'
    },
    textBox: {
        color: 'white',
        fontSize: 15,
        top: 2,
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center'
    },
    textincomespending:{
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        top: 5,
        fontSize: 15,
    },
    textTotalBox:{
        position: 'absolute',
        top: 5,
        fontSize: 15
    }
})

export default HomeScreen