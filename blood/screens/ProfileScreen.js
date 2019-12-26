import * as WebBrowser from 'expo-web-browser';
import React ,{ PureComponent } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, AsyncStorage, Button, TouchableOpacity } from 'react-native';
import { Avatar, Card } from 'react-native-elements';
import TabBarIcon from '../components/TabBarIcon';

import GlobalConfig from '../constants/GlobalConfig';
import { POSITION } from '../data/position-data';
import { ORGANIZE } from '../data/organize-data';

class ProfileScreen extends PureComponent { 
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      profileList: [],
      pickerValGender: null,
      age: null,
      work: null,
      experience_year: null,
      code: null,
      phone: null,
      pickerValOrganize: null,
      pickerValOrganizeText: null,
      pickerValPosition: null,
      pickerValPositionText: null,
      isEditable: false,
      buttonLabel: 'แก้ไข'
    }
  }

  async componentDidMount() {
    try {
      const userId = await AsyncStorage.getItem('isLoggedIn');
      await fetch(`${GlobalConfig.urlApi}/api/user/${userId}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: `${GlobalConfig.authToken}`,
        }),
      }).then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            loading: false,
            profileList: responseJson[0],
            pickerValGender: (responseJson[0].gender != '')? responseJson[0].gender : '',
            age: (responseJson[0].age > 0)? JSON.stringify(responseJson[0].age) : '',
            work: responseJson[0].work,
            experience_year: (responseJson[0].experience_year > 0)? JSON.stringify(responseJson[0].experience_year) : '',
            code: responseJson[0].code,
            phone: responseJson[0].phone,
            pickerValOrganize: (responseJson[0].user_organize_id > 0)? ORGANIZE[responseJson[0].user_organize_id - 1].id : '0',
            pickerValOrganizeText: responseJson[0].user_organize_text,
            pickerValPosition: (responseJson[0].user_position_id > 0)? POSITION[responseJson[0].user_position_id - 1].id : '0',
            pickerValPositionText: responseJson[0].user_position_text
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } catch(err) {
      console.log("Error fetching", err);
    }

  }

  render() {
    const workPosition = POSITION;
    const workOrganize = ORGANIZE;
    const { profileList, loading, isEditable, buttonLabel, buttonLabelCancle } = this.state;

    //Get Prob from aother component and check if not use default value
    this.setState({
      pickerValGender: this.props.navigation.getParam('gender',this.state.pickerValGender),
      age: this.props.navigation.getParam('age', this.state.age),
      work: this.props.navigation.getParam('work', this.state.work),
      experience_year: this.props.navigation.getParam('experience_year', this.state.experience_year),
      code: this.props.navigation.getParam('code', this.state.code),
      phone: this.props.navigation.getParam('phone', this.state.phone),
      pickerValOrganize: this.props.navigation.getParam('user_organize_id', this.state.pickerValOrganize),
      pickerValOrganizeText: this.props.navigation.getParam('user_organize_text', this.state.pickerValOrganizeText),
      pickerValPosition: this.props.navigation.getParam('user_position_id', this.state.pickerValPosition),
      pickerValPositionText: this.props.navigation.getParam('user_position_text', this.state.pickerValPositionText),
    });

    if(!loading) {
      return <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <Avatar 
          size="large" 
          rounded 
          icon={{name: 'user', type: 'font-awesome'}} 
          overlayContainerStyle={{backgroundColor: '#CCC'}} 
          />
          <Text style={{ paddingTop: 10}} onPress={this._logOut}>[ออกจากระบบ]</Text>
        </View>

        <Card title="ข้อมูลส่วนตัว">
          <Text style={styles.txtProfile}>เพศ: {this.state.pickerValGender === 'M' ? 'ชาย' : 'หญิง' } / อายุ: {this.state.age} ปี</Text>
          <Text style={styles.txtProfile}>สถานที่ทำงาน: {this.state.work}</Text>
          {
            workOrganize.map((item, key) => {
              if(item.id == this.state.pickerValOrganize)
              {
                return (<Text style={styles.txtProfile} key={key}>หน่วยงาน: { item.name } { (this.state.pickerValOrganizeText !== "")? this.state.pickerValOrganizeText : '' }</Text>)
              }
            })
          }
          {
            workPosition.map((item, key) => {
              if(item.id == this.state.pickerValPosition){
                return (<Text style={styles.txtProfile} key={key}>ตำแหน่งงาน: { item.name } { (this.state.pickerValPositionText !== "")? this.state.pickerValPositionText : '' }</Text>)
              } 
            })
          }
          <Text style={styles.txtProfile}>ประสบการณ์ทำงาน: {this.state.experience_year} ปี</Text>
          <Text style={styles.txtProfile}>รหัสพนักงาน: {this.state.code}</Text>
          <Text style={styles.txtProfile}>เบอร์โทร: {this.state.phone}</Text>
        
          <TouchableOpacity 
            style ={{
                padding: 15,
                marginLeft: 5,
                marginRight: 5,
                marginTop: 15,
                marginBottom: 10,
                borderRadius: 8,
                backgroundColor : "#ea6045",
            }}>
            <Text 
                style={{ fontSize: 16, color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}
                onPress={() => {
                  this.props.navigation.navigate({
                    routeName: 'ProfileEdit',
                  });
                }} 
            >{buttonLabel}</Text>
          </TouchableOpacity>

        </Card>
        <View style={styles.container, { padding: 10 }}></View>

      </ScrollView>
    } else {
      return <ActivityIndicator animating={true} size="large" color="#0000ff" />
    }

  }

  handleSubmit = () => {  
    this.setState({ isEditable: !this.state.isEditable });
    this.setState({ 
      buttonLabel: this.state.isEditable ? 'แก้ไขข้อมูล':'อัพเดทข้อมูล' 
    });
  }

  _logOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Login',
      { phone: this.state.phone }
    );
  }
             
}

ProfileScreen.navigationOptions = ({ navigation }) => ({
  title: 'Profile | ข้อมูลส่วนตัว',
  headerStyle: { backgroundColor: '#ffcc80'},
  headerTintColor: '#444',
  headerTitleStyle: { fontWeight: 'bold' },
  headerRight: (
    <TouchableOpacity onPress={() => navigation.navigate('LinkDetail')} style={{ paddingRight: 10, marginRight: 10 }}> 
      <TabBarIcon name='navicon' />
    </TouchableOpacity>
  )
});

/* 
//  Normal mot pass any parameter
ProfileScreen.navigationOptions = { 
    title: 'Profile | ข้อมูลส่วนตัว',
    headerStyle: { backgroundColor: '#ffcc80'},
    headerTintColor: '#444',
    headerTitleStyle: { fontWeight: 'bold' }
}; 
*/

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff'},
  contentContainer: {  paddingTop: 10 },
  developmentModeText: { marginBottom: 20, color: 'rgba(0,0,0,0.4)', fontSize: 14, lineHeight: 19, textAlign: 'center',},
  profileContainer: { alignItems: 'center', marginTop: 10, marginBottom: 10},
  txtProfile: {fontSize: 16,paddingVertical: 15,borderBottomColor: '#EEE',borderBottomWidth: 2},
  editProfile: {paddingTop: 15, paddingBottom: 15,paddingVertical: 15, marginTop: 20},
  textVersion: { fontSize: 12, textAlign: 'center' }
});

export default ProfileScreen;