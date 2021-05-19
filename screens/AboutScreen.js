import React from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
const AboutScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Image source={require("../assets/gambar/bukukas-logo.png")} style={{width:140, height: 140, borderRadius: 100, marginTop:-78}}>
                        </Image>
                        <View style={{marginTop: 20,flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name="copyright" color='black' size={15} />
                        <Text style={{textAlign: 'center'}}>2021 Berkah Startup Development</Text>
                        </View>
                        <Text style={{fontSize: 12}}>Bukukas v1.0</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default AboutScreen
