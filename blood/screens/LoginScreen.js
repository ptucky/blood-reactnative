import React ,{ PureComponent } from 'react';
import { StyleSheet, View, Text, TextInput, Image, 
  TouchableOpacity, ActivityIndicator, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import GlobalConfig from '../constants/GlobalConfig';
//const userInfo = { usernam: 'admin', password: 'start*123'}

class LoginScreen extends PureComponent {

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

    if(!loading) {
      return <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled keyboardVerticalOffset={0}>
        <View style={styles.container}>
          <Image source={ require('../assets/images/icon.png') } style={styles.imageStyle}/>
          <Text style={styles.welcome}>BBF Exposure Report</Text>
          <TextInput style={styles.input} 
            placeholder="เบอร์โทรศัพท์" 
            maxLength={10}
            onChangeText={(phoneTyping) => this.setState({phone: phoneTyping})}
            keyboardType={'numeric'}
          />
          <TextInput style={styles.input} 
            placeholder="รหัสผ่าน" 
            secureTextEntry={true} 
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            autoCapitalize="none"
            />
          
          <View style={styles.btnContainer}>
            <TouchableOpacity 
              style={styles.userBtn} 
              onPress={this._login}
            >
              <Text style={styles.btnTxt}>Login</Text> 
            </TouchableOpacity>
          </View>
          <View style={styles.fixToTextBtn}>
            <TouchableOpacity 
              style={styles.userBtnRegister}
              onPress={() => {
                this.props.navigation.navigate({
                  routeName: 'ForgotPassword',
                });
              }}
            >
              <Text style={styles.btnTxtRegister}>[ลืมรหัสผ่าน]</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.userBtnRegister}
              onPress={() => {
                this.props.navigation.navigate({
                  routeName: 'Register',
                });
              }}
            >
              <Text style={styles.btnTxtRegister}>[ลงทะเบียน]</Text>
            </TouchableOpacity> 
          </View>
        </View>
      </KeyboardAvoidingView>
    } else {
      return <ActivityIndicator animating={true} size="large" color="#0000ff" />
    }
  }

  _login = async() => {
    if(this.state.phone != "" && this.state.password != ""){
      try {
        await fetch(`${GlobalConfig.urlApi}/api/check_login`, {
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
            if(responseJson['user_id'] && responseJson['user_id'] > 0){
              this.setState({
                loading: false
              });  
              AsyncStorage.setItem('isLoggedIn',JSON.stringify(responseJson['user_id']));
              AsyncStorage.setItem('typeLoggedIn',JSON.stringify(responseJson['type']));
              this.props.navigation.navigate({
                routeName: 'Home',
              });
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
    } else {
      alert('เบอร์โทรศัพท์/พาสเวิร์ด ไม่ถูกต้อง!');
    }
  }

}

LoginScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
container: {flex: 1,justifyContent: 'center',alignItems: 'center', backgroundColor: '#FFF'},
welcome: {fontSize: 28,justifyContent: 'center',alignItems: 'center',color: '#fabb5c',marginBottom: 10},
input: {fontSize: 16, width: '90%',color: '#333',backgroundColor: '#FFF',borderColor: '#fabb5c', textAlign: 'center', borderWidth: 1, padding:12, marginBottom: 10},
btnContainer: {flexDirection: 'row',justifyContent: 'space-between',width: '90%',alignItems: 'center'},
userBtn: {backgroundColor: '#FFD700',padding: 15,width: '100%'},
btnTxt: {fontSize: 18,textAlign: 'center'},
userBtnRegister: {padding: 15, width:"45%"},
btnTxtRegister: {fontSize: 14, color: '#666',textAlign: 'center',justifyContent: 'center',alignItems: 'center'},
imageStyle: {width: 150,height: 150},
fixToTextBtn:{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }
});

export default LoginScreen;
