import React ,{ PureComponent } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator,
   View, Alert, TouchableOpacity, AsyncStorage,Dimensions, KeyboardAvoidingView } from 'react-native';
import TabBarIcon from '../components/TabBarIcon';
import GlobalConfig from '../constants/GlobalConfig';
import MyWebView from 'react-native-webview-autoheight';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ReportMainTwoScreen extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userUrl: null,
    }
  }

  async componentDidMount() {
    try {
        const user_id = await AsyncStorage.getItem('isLoggedIn');
        const reportKeyId = this.props.navigation.getParam('reportKeyId', '0');

        this.setState({
          loading: false,
          userUrl: `${GlobalConfig.urlApi}/report_question/2/${reportKeyId}/${user_id}/${GlobalConfig.authToken}`,
        });
    } catch(err) {
      console.log("Error fetching", err);
    }
  }

  render() {
    const { loading, userUrl } = this.state;
    //const screenHeight = Math.round(Dimensions.get('window').height) + 200;

    if(!loading) {
      return <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled keyboardVerticalOffset={110}>
        <MyWebView
          source={{uri: userUrl}}
          useWebKit={true} 
          startInLoadingState={true}
          javaScriptEnabled={true}
          autoHeight={true}
          defaultHeight={500}
          style={{ marginTop: 25 }}
          onNavigationStateChange={(e) => {
            if(e.url != userUrl){
              Alert.alert('บันทึกสำเร็จ')
   
              this.props.navigation.navigate({
                routeName: 'ThankYou',
                params: { 
                  headerTitle: 'เก็บข้อมูลเสร็จสมบูรณ์',
                  message: 'ระบบจัดเก็บข้อมูล \nเสร็จสมบูรณ์ ขอบคุณค่ะ'
                }
              });
            }
          }}
        />
      </KeyboardAvoidingView>
    } else {
      return <ActivityIndicator animating={true} size="large" color="#0000ff" />
    }
  }
}

/** Dynamic cofig heder title */
ReportMainTwoScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('headerTitle'),
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
  webview: { flex: 1, backgroundColor: 'yellow',  width: deviceWidth, height: deviceHeight },
  container: { flex: 1, paddingTop: 15, backgroundColor: '#fff', marginTop: 15},
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center'},
  fixToTextBtn:{ flexDirection: 'column', marginTop: 20, marginBottom: 40, paddingLeft: 20, paddingRight: 20},
});

export default ReportMainTwoScreen;
