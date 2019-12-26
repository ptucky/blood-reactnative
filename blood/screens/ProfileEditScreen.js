import * as WebBrowser from 'expo-web-browser';
import React ,{ PureComponent } from 'react';
import { View, Platform, ScrollView, StyleSheet, 
  Text, ActivityIndicator, TextInput, 
  Picker, AsyncStorage, TouchableOpacity, 
  KeyboardAvoidingView } from 'react-native';
import { Card } from 'react-native-elements';
import TabBarIcon from '../components/TabBarIcon';

import GlobalConfig from '../constants/GlobalConfig';
import { POSITION } from '../data/position-data';
import { ORGANIZE } from '../data/organize-data';

class ProfileEditScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        userId: null,
        profileList: [],
        loading: true,
        age: null,
        work: null,
        experience_year: null,
        code: null,
        phone: null,
        isEditable: true,
        buttonLabel: 'บันทึก',
        buttonLabelCancle: 'ยกเลิก',
        pickerValGender: '',
        pickerValOrganize: '',
        pickerValOrganizeText: '',
        pickerValPosition: '',
        pickerValPositionText: '',
    }
  }

  async componentDidMount() {
    try {
        const user_id = await AsyncStorage.getItem('isLoggedIn');
        await fetch(`${GlobalConfig.urlApi}/api/user/${user_id}`, {
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
              userId: user_id,
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
    const workOrganize = ORGANIZE;
    const workPosition = POSITION;
    const { 
      profileList, 
      loading, 
      isEditable, 
      buttonLabel, 
      buttonLabelCancle
    } = this.state;


    if(!loading) {
      return <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled keyboardVerticalOffset={120}> 
        <ScrollView contentContainerStyle={styles.contentContainer}> 
          <Card title="ข้อมูลส่วนตัว">
            <View style={styles.fixToText}>
              <View style={[{width:"40%"}]}>
                <Text style={styles.txtProfile}>เพศ</Text>
              </View>
              <View style={[{width:"40%"}]}>
                <Text style={styles.txtProfile, {textAlign: 'center', fontSize: 16}}>อายุ</Text>
              </View>
            </View>

            <View style={styles.fixToText}>
              <View style={[{width:"40%"}]}>
                <Picker
                  style={{ backgroundColor: "#fafafa", marginBottom: 15, borderWidth: 0, width: '100%', color: '#fabb5c' }}
                  itemStyle={{height: 60, color: '#fabb5c', width: '100%', fontSize: 18 }}
                  selectedValue={this.state.pickerValGender}
                  onValueChange={(genderValue) => {
                    this.setState({pickerValGender: genderValue});
                  }}
                >
                  <Picker.Item key='0' label='-เลือก-' value='' />
                  <Picker.Item key='1' label='ชาย' value='M' />
                  <Picker.Item key='2' label='หญิง' value='W' />
                </Picker>
              </View>
              <View style={[{width:"40%"}]}>
              <TextInput 
                keyboardType={'numeric'}
                maxLength={2}
                style={[styles.textInput, { borderColor: isEditable ? 'grey' : 'red' }]} 
                editable={isEditable}
                value={this.state.age}
                onChangeText={(age) => this.setState({age})}
                //placeholder={profileList.age.toString()}
              />
              </View>
            </View>

            <View style={styles.fixToText}>
              <View style={[{width:"45%"}]}>
                <Text style={styles.txtProfile}>ประสบการณ์ทำงาน</Text>
                <TextInput 
                  keyboardType={'numeric'}
                  maxLength={2}
                  style={[styles.textInput, { borderColor: isEditable ? 'grey' : 'blue' }]} 
                  editable={isEditable} 
                  onChangeText={(experience_year) => this.setState({experience_year})} 
                  value={this.state.experience_year}
                />
              </View>
              <View style={[{width:"40%"}]}>
              <Text style={styles.txtProfile}>รหัสพนักงาน</Text>
                <TextInput 
                  maxLength={10}
                  style={[styles.textInput, { borderColor: isEditable ? 'grey' : 'blue' }]} 
                  editable={isEditable} 
                  onChangeText={(code) => this.setState({code})} 
                  value={this.state.code}
                />
              </View>
            </View>
            
            <Text style={styles.txtProfile}>สถานที่ทำงาน:</Text>
            <TextInput
              style={[styles.textInput, { borderColor: isEditable ? 'grey' : 'blue' }]}
              editable={isEditable} 
              onChangeText={(work) => this.setState({work})}
              value={this.state.work}
            />

              <Text style={styles.txtProfile}>หน่วยงาน</Text>
              <Picker
                style={{ backgroundColor: "#fafafa", marginBottom: 15, borderWidth: 0, width: '100%', color: '#fabb5c' }}
                itemStyle={{height: 80, color: '#fabb5c', width: '100%', fontSize: 18 }}
                selectedValue={this.state.pickerValOrganize}
                onValueChange={(value) => {
                  this.setState({pickerValOrganize: value});
                }}
              >
              <Picker.Item key='0' label='-เลือก-' value='' />
              {
                workOrganize.map(item => (
                  <Picker.Item key={item.id} label={item.name} value={item.id} />
                ))
              }
            </Picker>
            { (this.state.pickerValOrganize == 17)? <TextInput style={[styles.textInput, { borderColor: isEditable ? 'grey' : '#fabb5c' }]}  editable={isEditable} value={this.state.pickerValOrganizeText} onChangeText={(text) => this.setState({ pickerValOrganizeText : text})}></TextInput> : this.setState({ pickerValOrganizeText : ''}) }

            <Text style={styles.txtProfile}>ตำแหน่ง</Text>
            <Picker
              style={{ backgroundColor: "#fafafa", marginBottom: 15, borderWidth: 0, width: '100%', color: '#fabb5c' }}
              itemStyle={{height: 80, color: '#fabb5c', width: '100%', fontSize: 18 }}
              selectedValue={this.state.pickerValPosition}
              onValueChange={(value) => {
                this.setState({pickerValPosition: value});
              }} 
            >
              <Picker.Item key='0' label='-เลือก-' value='' />
              {
                workPosition.map(item => (
                  <Picker.Item key={item.id} label={item.name} value={item.id} />
                ))
              }
            </Picker>
            { (this.state.pickerValPosition == 8)? <TextInput maxLength={70} style={[styles.textInput, { borderColor: isEditable ? 'grey' : '#fabb5c' }]} editable={isEditable} value={this.state.pickerValPositionText} onChangeText={(text) => this.setState({ pickerValPositionText : text})}></TextInput> : this.setState({ pickerValPositionText : ''}) }

            <Text style={styles.txtProfile}>เบอร์โทร</Text>
            <TextInput 
              keyboardType={'numeric'}
              maxLength={10}
              style={[styles.textInput, { borderColor: isEditable ? 'grey' : 'blue' }]} 
              editable={isEditable} 
              onChangeText={(phone) => this.setState({phone})} 
              value={this.state.phone}
            />

            <View style={styles.fixToTextBtn}>
              <TouchableOpacity 
              style ={{
                  width:"45%",
                  padding: 15,
                  margin: 15,
                  marginLeft: 3,
                  marginBottom: 15,
                  borderRadius: 8,
                  backgroundColor : "#666",
              }}>
              <Text 
                  style={{ fontSize: 16, color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}
                  onPress={() => {
                    this.props.navigation.navigate({
                      routeName: 'Home',
                    });
                  }}
              >{buttonLabelCancle}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style ={{
                width:"45%",
                padding: 15,
                margin: 15,
                marginBottom: 15,
                borderRadius: 8,
                backgroundColor : "#ea6045",
            }}>
            <Text 
                style={{ fontSize: 16, color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}
                onPress={this._handleSubmit.bind(this)}
            >{buttonLabel}</Text>
          </TouchableOpacity>

            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    } else {
      return <ActivityIndicator animating={true} size="large" color="#0000ff" />
    }

  }

  _handleSubmit = async() => { 
      try {
        await fetch(`${GlobalConfig.urlApi}/api/update_user`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth_token: `${GlobalConfig.authToken}`,
            user_id: this.state.userId,
            gender: this.state.pickerValGender,
            age: this.state.age,
            work: this.state.work,
            experience_year: this.state.experience_year,
            code: this.state.code,
            phone: this.state.phone,
            user_organize_id: this.state.pickerValOrganize,
            user_organize_text: this.state.pickerValOrganizeText,
            user_position_id: this.state.pickerValPosition,
            user_position_text: this.state.pickerValPositionText
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            if(responseJson['code'] == 200){
              this.setState({
                loading: true
              });
              this._redirect();
            } else {
              alert('ไม่มี Account นี้ในระบบ!');
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } catch(err) {
        console.log("Error fetching", err);
      }
  }

  _redirect() {
    this.props.navigation.navigate('Home', 
    { 
      gender: this.state.pickerValGender,
      age: this.state.age,
      work: this.state.work,
      experience_year: this.state.experience_year,
      code: this.state.code,
      phone: this.state.phone,
      user_organize_id: this.state.pickerValOrganize,
      user_organize_text: this.state.pickerValOrganizeText,
      user_position_id: this.state.pickerValPosition,
      user_position_text: this.state.pickerValPositionText
    });

    /*
    // Back
    const { navigation } = this.props;
    navigation.goBack();
    */

    /*
    // Redirect + back
    this.props.navigation.navigate({
      routeName: 'Home'
    });
    */
  }

}

ProfileEditScreen.navigationOptions = ({ navigation }) => ({
  title: 'Profile | ข้อมูลส่วนตัว',
  headerStyle: { backgroundColor: '#ffcc80' },
  headerTintColor: '#444',
  headerTitleStyle: { fontWeight: 'bold' },
  headerRight: (
    <TouchableOpacity onPress={() => navigation.navigate('LinkDetail')} style={{ paddingRight: 10, marginRight: 10 }}> 
      <TabBarIcon name='navicon' />
    </TouchableOpacity>
  )
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  ProfileScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  profileNameText: {
    fontSize: 26,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  txtProfile: {
    fontSize: 16,
  },
  editProfileBtn: {
    fontSize: 20,
  },
  textInput: {
    textAlign: 'center',
    height: 40,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fixToTextBtn:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  }
});

export default ProfileEditScreen;