import React , { Component } from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { ActivityIndicator, StatusBar, StyleSheet, AsyncStorage, View } from 'react-native';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen.js';
import RegisterScreen from '../screens/RegisterScreen.js';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen.js';

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this._loadData();
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  _loadData = async () => {
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    this.props.navigation.navigate(isLoggedIn <= 0 ? 'Auth' : 'App');
  }
}

const AuthStack = createStackNavigator({ Login: LoginScreen, Register: RegisterScreen, ForgotPassword: ForgotPasswordScreen });
const AppStack = createStackNavigator({ Main: MainTabNavigator });

AuthLoadingScreen.navigationOptions = { header: null };
AuthStack.navigationOptions = { header: null };
MainTabNavigator.navigationOptions = { header: null };

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: 'AuthLoading',
    },
  )
);


/** Old with out check Auth */
/*
export default createAppContainer(
  createSwitchNavigator({
    Login: LoginScreen,
    Main: MainTabNavigator,
  })
);
*/

/** AuthLoadingScreen Style */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});
