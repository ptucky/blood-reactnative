import React ,{ PureComponent } from 'react';
import { StyleSheet, View, Image, TextInput, Text, TouchableOpacity, 
  ActivityIndicator, AsyncStorage, Alert, 
  KeyboardAvoidingView } from 'react-native';
import TabBarIcon from '../components/TabBarIcon';
import GlobalConfig from '../constants/GlobalConfig';

class RegisterScreen extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      phone: '',
      password: ''
    }
  }

  async componentDidMount() {
    try {
      this.setState({
        loading: false
      });
    } catch(err) {
      console.log("Error fetching", err);
    }
  }
 
  render() {
    const { loading } = this.state;

    if(!loading){
      return <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled keyboardVerticalOffset={10}> 
        <View style={styles.container}>
          <TextInput 
            style={styles.input} 
            maxLength={10}
            placeholder="เบอร์โทรศัพท์" 
            onChangeText={(phone) => this.setState({phone})}
            value={this.state.phone}
            keyboardType={'numeric'}
            />
          <View style={styles.btnContainer}>
            <TouchableOpacity 
              style={styles.userBtn} 
              onPress={this._register}
            >
              <Text style={styles.btnTxt}>ลงทะเบียน</Text> 
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>กรอกเบอรโทรศัพท์ เพื่อรับรหัสการใช้งาน</Text>
        </View>
      </KeyboardAvoidingView>
    } else {
      return <ActivityIndicator animating={true} size="large" color="#0000ff" />
    }

  }

  _register = async() => {
    if(this.state.phone != ""){ 
      try {
        await fetch(`${GlobalConfig.urlApi}/api/register_sms`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth_token: `${GlobalConfig.authToken}`,
            phone: this.state.phone,
            password: this.state.password,
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            
            if(responseJson['user_id'] && responseJson['user_id'] > 0)
            {
              this.setState({
                loading: false
              });  
              AsyncStorage.setItem('isLoggedIn',JSON.stringify(responseJson['user_id']));
              this.props.navigation.navigate('Login',
                { phone: this.state.phone }
              );
              Alert.alert('กรุณาตรวจสอบรหัสผ่านทาง sms');
            } else {
              
              if(responseJson['code'] == 302){
                alert('เบอรโทรศัพท์นี้ มีการลงทะเบียนไว้แล้ว');
              } else {
                alert('สร้าง Account ไม่สำเร็จ!');
              }

            }
            
          })
          .catch((error) => {
            console.error(error);
          });
      } catch(err) {
        console.log("Error fetching", err);
      }
    } else {
      alert('สร้าง Account ไม่สำเร็จ!');
    }
  }

}

RegisterScreen.navigationOptions = ({ navigation }) => ({
  title: 'Register | ลงทะเบียนใช้งาน',
  headerStyle: { backgroundColor: '#ffcc80' },
  headerTintColor: '#444',
  headerTitleStyle: { fontWeight: 'bold' }
});

const styles = StyleSheet.create({
  container: {flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: '#FFF'},
  input: { fontSize: 16, width: '90%',color: '#333',backgroundColor: '#FFF',borderColor: '#fabb5c', textAlign: 'center', borderWidth: 1,padding:12,marginBottom: 10, },
  btnContainer: {flexDirection: 'row',justifyContent: 'space-between',width: '90%',alignItems: 'center'},
  userBtn: {backgroundColor: '#FFD700',padding: 15,width: '100%'},
  btnTxt: {fontSize: 18,textAlign: 'center'},
  userBtnRegister: {padding: 15,width: '100%'},
  btnTxtRegister: {fontSize: 14,marginTop: 30,color: '#666',textAlign: 'center',justifyContent: 'center',alignItems: 'center'},
  headerText: { fontSize: 16,justifyContent: 'center',alignItems: 'center',color: '#666',marginTop: 20} 
});

export default RegisterScreen;
