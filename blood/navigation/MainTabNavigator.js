import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import ReportScreen from '../screens/ReportScreen';
import ReportMainScreen from '../screens/ReportMainScreen';
import ReportMainOneScreen from '../screens/ReportMainOneScreen';
import ReportMainTwoScreen from '../screens/ReportMainTwoScreen';
import ReportMainThreeScreen from '../screens/ReportMainThreeScreen';
import Questionaire from '../screens/QuestionaireScreen';
import QuestionaireAns from '../screens/QuestionaireAnsScreen';
import LinkDetailScreen from '../screens/LinkDetailScreen';
import StatisticScreen from '../screens/StatisticScreen';
import ReporterScreen from '../screens/ReporterScreen';
import ThankYouScreen from '../screens/ThankYouScreen';

const config = Platform.select({
  //web: { headerMode: 'screen' },
  //default: { headerMode: 'float' },  //IOS
  //default: { headerMode: 'screen' }, //Android
  //default: {  headerMode: 'none' }, 
});

/** Tab1 */
const ProfileStack = createStackNavigator(
  {
    Home: ProfileScreen,
    Profile: ProfileScreen,
    ProfileEdit: ProfileEditScreen,
    LinkDetail: LinkDetailScreen,
    Questionaire: { screen: Questionaire },
    QuestionaireAns: { screen: QuestionaireAns },
    Statistic: { screen: StatisticScreen },
    Reporter: { screen: ReporterScreen },
    ThankYou: { screen: ThankYouScreen }
  },
  config
);

ProfileStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
      return {
      tabBarVisible: false
    };
  }
  return {
    tabBarVisible,
    tabBarLabel: 'ข้อมูลส่วนตัว',
    tabBarOptions: {
      activeTintColor: '#fabb5c',
    },
    tabBarIcon: ({ focused }) => (
      <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'user-circle' : 'user-circle'} />
    ),
  };
};

ProfileStack.path = '';


/** Tab2 */
const ReportStack = createStackNavigator(
  {
    Report: ReportScreen,
    ReportMain: { screen: ReportMainScreen }, 
    ReportOne: { screen: ReportMainOneScreen }, 
    ReportTwo: { screen: ReportMainTwoScreen }, 
    ReportThree: { screen: ReportMainThreeScreen },
    LinkDetail: { screen: LinkDetailScreen },
    Questionaire: { screen: Questionaire },
    QuestionaireAns: { screen: QuestionaireAns },
    Statistic: { screen: StatisticScreen },
    Reporter: { screen: ReporterScreen },
    ThankYou: { screen: ThankYouScreen }
  },
  config
);

ReportStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
      return {
      tabBarVisible: false
    };
  }
  return {
    tabBarVisible,
    tabBarLabel: 'รายงานอุบัติเหตุ',
    tabBarOptions: {
      activeTintColor: '#fabb5c',
    },
    tabBarIcon: ({ focused }) => (
      <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'file-text-o' : 'file-text-o'} />
    ),
  };
};

ReportStack.path = '';


/** Tab3 */
const ReportCurrentStack = createStackNavigator(
  {
    Questionaire: Questionaire,
    LinkDetail: { screen: LinkDetailScreen },
    QuestionaireAns: { screen: QuestionaireAns },
    Statistic: { screen: StatisticScreen },
    Reporter: { screen: ReporterScreen },
    ThankYou: { screen: ThankYouScreen }
  },
  config
);

ReportCurrentStack.navigationOptions = {
  tabBarLabel: 'แบบสอบถาม',
  tabBarOptions: {
    activeTintColor: '#fabb5c',
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'file-o' : 'file-o'} />
  ),
};

ReportCurrentStack.path = '';

const tabNavigator = createBottomTabNavigator({
  ReportStack,
  ProfileStack,
  //ReportCurrentStack,
});

tabNavigator.path = '';

export default tabNavigator;
