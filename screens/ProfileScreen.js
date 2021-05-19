import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
const ProfileScreen = () => {

    const [user,setUser] = useState([]);
    const url = 'https://tubes-pam-server.herokuapp.com/server.php?op=showdatauser&id='
    const getUser = async () => {
        const id_user = await AsyncStorage.getItem('id')
        await fetch(url+id_user).then((res)=>res.json()).then((json)=>{
            setUser(json.data.result)})
            .catch((err)=> console.log(err))
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{padding:10, width: '100%', backgroundColor: 'gold', height:150}}>
                    {/* <TouchableOpacity> */}
                        {/* <Image source={require('../assets/gambar/back.png')} style={{width:30, height: 30}}>
                        </Image> */}
                    {/* </TouchableOpacity> */}
                </View>
                <View style={{alignItems:'center'}}>
                        <Image source={require('../assets/gambar/blank-profile.png')} style={{width:140, height: 140, borderRadius: 100, marginTop:-78}}>
                        </Image>
                        {
                            user.map((val,index)=>(
                                <View style={{width: '90%',}} key={index}>
                                <Text style={{fontSize:25,textAlign: 'center' ,fontWeight: 'bold', paddingTop: 15, }}>{val.nama}</Text>
                                <View style={styles.box}>
                                        <Icon name='user-circle' color='grey' backgroundColor='white' size={35} />
                                        <Text style={{fontSize:20,fontWeight: 'bold', color: 'grey', width: '100%', marginLeft:5}}>{val.email}</Text>
                                </View>
                                <View style={styles.box}>
                                        <Ionicons name='create-outline' color='grey' backgroundColor='white' size={35} />
                                        <Text style={{fontSize:20,fontWeight: 'bold', color: 'grey', width: '100%', marginLeft:5, }}>{val.datetime}</Text>
                                </View>
                                </View>
                            ))
                        }
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    box: {
        padding:10,
        marginBottom:3,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        shadowColor: 'black',
        shadowOpacity: .2,
        shadowOffset: {
            height:1,
            width:-2
        },
        elevation:2,
        marginVertical: 30,
        alignItems: 'center'
    }
})

export default ProfileScreen