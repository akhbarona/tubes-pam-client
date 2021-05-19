import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'

import Icon from 'react-native-vector-icons/FontAwesome'
import IconPlus from 'react-native-vector-icons/SimpleLineIcons'
import IconBack from 'react-native-vector-icons/Ionicons'

import HomeScreen from './HomeScreen'
import AboutScreen from './AboutScreen'
import CreateScreen from './CreateScreen'
import UpdateScreen from './UpdateScreen';
import ShowTableScreen from './ShowTableScreen';

const HomeStack = createStackNavigator()
const CreateStack = createStackNavigator()
const AboutStack = createStackNavigator()

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
  
    <Tab.Navigator
    initialRouteName="HomeScreen"
    activeColor="white"
    barStyle={{ backgroundColor: 'gold',  borderTopLeftRadius: 15,
    borderTopRightRadius: 15, elevation: 0 , overflow: 'hidden', }}
  >
    <Tab.Screen
      name="HomeScreen"
      component={HomeStackScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => (
          <Icon name="home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Create"
      component={CreateStackScreen}
      options={{
        showLabel: false,
        tabBarIcon: ({ color }) => (
          <IconPlus name="plus" color={color} size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="About"
      component={AboutStackScreen}
      options={{
        tabBarLabel: 'About',
        tabBarIcon: ({ color }) => (
          <Icon name="info-circle" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);


export default MainTabScreen

const HomeStackScreen = ({navigation}) =>(
    <HomeStack.Navigator screenOptions={{
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold'
      },
      headerStyle:{
        backgroundColor: 'gold',
      }
    }}
    >
      <HomeStack.Screen name='Home' component={HomeScreen} options={{
        headerLeft: () => (
          <Icon.Button name='bars' color='black' backgroundColor='gold' size={30} onPress={()=>navigation.openDrawer()}></Icon.Button>
        )
      }} />
      <HomeStack.Screen name='Update' component={UpdateScreen} options={{
        headerLeft: () => (
          <IconBack.Button name='md-arrow-back-sharp' color='black' backgroundColor='gold' size={30} onPress={()=>navigation.navigate('Home')}></IconBack.Button>
        )
      }} /> 
    </HomeStack.Navigator>
  )
const CreateStackScreen = ({navigation}) =>(
    <CreateStack.Navigator screenOptions={{
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold'
      },
      headerStyle:{
        backgroundColor: 'gold',
      }
    }}>
      <CreateStack.Screen name='Create' component={CreateScreen} options={{
        headerLeft: () => (
          <IconBack.Button name='md-arrow-back-sharp' color='black' backgroundColor='gold' size={30} onPress={()=>navigation.navigate('Home')}></IconBack.Button>
        )
      }} />
      <CreateStack.Screen name='ShowTable' component={ShowTableScreen}/>
    </CreateStack.Navigator>
  )

const AboutStackScreen = ({navigation}) =>(
    <AboutStack.Navigator screenOptions={{
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold'
      },
      headerStyle:{
        backgroundColor: 'gold',
      }
    }}>
      <AboutStack.Screen name='About' component={AboutScreen} options={{
        headerLeft: () => (
          <IconBack.Button name='md-arrow-back-sharp' color='black' backgroundColor='gold' size={30} onPress={()=>navigation.navigate('HomeScreen')}></IconBack.Button>
        )
      }} />
    </AboutStack.Navigator>
  )