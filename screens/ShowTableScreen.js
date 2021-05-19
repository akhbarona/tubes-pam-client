import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import AsyncStorage from "@react-native-async-storage/async-storage";


const ShowTableScreen = ({navigation}) => {
  const [data,setData] = useState({
    tableHead: ['Tanggal', 'Income', 'Spending','Note', 'Aksi'],
    isLoding: true,
    widthArr: [100,100,100,100,150],
    tableData : []
  })
  const [id_user,setId] = useState()

  const getIdUser = async () => {
    const isLogin = await AsyncStorage.getItem('id')
    setId(isLogin)
  }

  const validationSession = async () => {
    const isLogin = await AsyncStorage.getItem('id')
    await fetch('https://tubes-pam-server.herokuapp.com/server.php?op=showdata&id_user='+isLogin,{
        method: 'GET',
    })
    .then((res)=> res.json()).then((json)=>{
        if(json=='belum ada data yang ditambahkan'){
            setData({...data, isLoding: false})
        }else{
            // console.log(JSON.stringify(json))
            setData({...data, tableData: json.data.result})
        }
    }).catch((err)=>{console.log(err)})
    }

        useEffect(()=>{
          const unsubscribe = navigation.addListener('focus', (e) => {
            validationSession()
            getIdUser()
          });
          return unsubscribe
          }, [navigation]);

  const klikEdit = (id) => {
    navigation.navigate('Update',{id_post:id, id_user: id_user,refresh : validationSession})
  }

  const klikDelete = async (id) => {
    await fetch('https://tubes-pam-server.herokuapp.com/server.php?op=delete&id='+id+'&id_user='+id_user).then((res)=>res.json()).then((json)=>{
      if(json.data.result=='Berhasil menghapus data'){
        Alert.alert("Success!", "Data berhasil dihapus.", [{ text: "Okay" }])
         validationSession()
         navigation.navigate('Home')
      }else{
          Alert.alert("failed!", "Gagal dihapus.", [{ text: "Okay" }])
      }
    }).catch((err)=>{
      console.log(err)
    })
  }

  const element = (data, index) => (
    <View style={styles.element}>
    <TouchableOpacity style={styles.button} onPress={() => klikEdit(data)}>
      <View style={styles.btnEdit}>
        <Text style={styles.btnText}>Edit</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => klikDelete(data)}>
      <View style={styles.btnDelete}>
        <Text style={styles.btnText}>Hapus</Text>
      </View>
    </TouchableOpacity>
    </View>
  );

  const resultData = data.tableData.map((record,index)=>([record.datetime, record.income, record.spending, record.note, element(record.id,index)]))
  return (
    <View style={styles.container}>
      { data.isLoding ?
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <Row data={data.tableHead} widthArr={data.widthArr} style={styles.header} textStyle={styles.text}/>
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                {
                  resultData.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={data.widthArr}
                      style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text}
                    />
                  ))
                }
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
        : null
}
      </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5, marginTop:10, backgroundColor: '#FFF' },
  header: { height: 50, backgroundColor: 'gold' },
  text: { textAlign: 'center', fontWeight: '100' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' },
  btnEdit: { width: 58, height: 30, backgroundColor: 'blue',  borderRadius: 2, justifyContent: 'center' },
  btnDelete: { width: 58, height: 30, backgroundColor: 'red',  borderRadius: 2, justifyContent: 'center' },
  btnText: { textAlign: 'center', color: '#fff' },
  element: {alignItems: 'center', flexDirection: 'row', justifyContent: 'center'},
  button: {marginHorizontal: 5}
});

export default ShowTableScreen
