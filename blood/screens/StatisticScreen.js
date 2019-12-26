import React ,{ PureComponent } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, WebView, Dimensions, Alert, TouchableOpacity } from 'react-native';
import TabBarIcon from '../components/TabBarIcon';
import GlobalConfig from '../constants/GlobalConfig';

class StatisticScreen extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  async componentDidMount() {
    try {
      this.setState({
        loading: false,
      });
    } catch(err) {
      console.log("Error fetching", err);
    }
  }

  render() {
    const { loading } = this.state;
    const screenHeight = Math.round(Dimensions.get('window').height) + 300;
    
    if(!loading) {
    return <ScrollView style={styles.container}>
      <WebView style={{flex: 1}}
        source={{uri: `${GlobalConfig.urlApi}/all_report_admin/${GlobalConfig.authToken}`}}
        ref={(webView) => this.webView = webView}
        style={styles.container,{marginTop: 20, height: screenHeight, width: '100%'}}
      />
      </ScrollView>
    } else {
      return <ActivityIndicator animating={true} size="large" color="#0000ff" />
    }
    
  }
}

/** Dynamic cofig heder title */
StatisticScreen.navigationOptions = ({ navigation }) => ({
  title: 'Report / รายงาน',
  headerStyle: { backgroundColor: '#ffcc80' },
  headerTintColor: '#444',
  headerTitleStyle: { fontWeight: 'bold' }
});

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 15, backgroundColor: '#fff', marginTop: 15},
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center'},
  fixToTextBtn:{ flexDirection: 'column', marginTop: 20, marginBottom: 40, paddingLeft: 20, paddingRight: 20},
});

export default StatisticScreen;
