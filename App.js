import React, { useEffect, useMemo, useReducer } from "react";
import { View, ActivityIndicator } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainTabScreen from "./screens/MainTabScreen";

import { DrawerContent } from "./screens/DrawerContent";

import RootStackScreen from "./screens/RootStackScreen";

import { AuthContext } from "./components/context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileScreen from "./screens/ProfileScreen";

console.reportErrorsAsExceptions = false; 

const Drawer = createDrawerNavigator();

const App = () => {
  const initialLoginState = {
    isLoading: true,
    id: null,
    email: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          id: action.id,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          email: action.email,
          id: action.id,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          email: null,
          id: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = useMemo(
    () => ({
      signIn: async (foundUser) => {
        const email = foundUser.data.result[0].email;
        const id = String(foundUser.data.result[0].id);
        try {
          await AsyncStorage.setItem("id", id);
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGIN", email: email, id: id });
      },
      signInGoogle: async (foundUser) => {
        const email = foundUser.user.email;
        await fetch('http://192.168.1.2/server/server.php?op=showusergoogle&email='+email)
        .then((res)=> res.json()).then((json)=>{
          const id = String(json.data.result[0].id);
          try {
            AsyncStorage.setItem("id", id);
          } catch (e) {
            console.log(e);
          }
          dispatch({ type: "LOGIN", email: email, id: id });
        }).catch((err)=>{console.log(err)})
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("id");
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGOUT" });
      },
    }),
    []
  );

  useEffect(() => {
    let isUmount = false
    setTimeout(async () => {
      let id;
      id = null;
      if(!isUmount){
        try {
          id = await AsyncStorage.getItem("id");
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "RETRIEVE_TOKEN", id: id });
      }
    }, 2000);

    return () => { isUmount= true}
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.id != null ? (
          <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
          >
            <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
            {/* not part of tab screen */}
            <Drawer.Screen name="Profile" component={ProfileScreen} />
          </Drawer.Navigator>
        ) : (
          <RootStackScreen />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
