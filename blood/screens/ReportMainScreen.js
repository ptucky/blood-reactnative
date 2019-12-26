import React, { PureComponent } from 'react';
import { ScrollView, StyleSheet, Text, 
  ActivityIndicator, TouchableOpacity, 
  } from 'react-native';
import TabBarIcon from '../components/TabBarIcon';
import MyWebView from 'react-native-webview-autoheight';

class ReportMainScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    }
  }

  async componentDidMount() {
    this.setState({
      loading: false
    });
  }

  render() {
    const { loading } = this.state;
    const reportKeyId = this.props.navigation.getParam('reportKeyId', '0')
    // accident_report_id
    
    if(!loading) {
      return <ScrollView style={styles.container}>
          <TouchableOpacity 
            style ={{
                padding: 15,
                margin: 15,
                borderRadius: 8,
                backgroundColor : "#fbc02d",
            }}>
            <Text
                style={{ fontSize: 16, color: '#263238', textAlign: 'center', fontWeight: 'bold' }}
                onPress={() => {
                  this.props.navigation.navigate({
                    routeName: 'ReportOne',
                    params: { 
                      headerTitle: 'การได้รับบาดเจ็บจากเข็มทิ่มตำ/ของมีคมบาด',
                      reportKeyId: reportKeyId
                    }
                  });
                }} 
            >การได้รับบาดเจ็บจากเข็มทิ่มตำ/ของมีคมบาด</Text>
          </TouchableOpacity> 
          <TouchableOpacity 
            style ={{
                padding: 15,
                margin: 15,
                borderRadius: 8,
                backgroundColor : "#fbc02d",
            }}>
            <Text 
                style={{ fontSize: 16, color: '#263238', textAlign: 'center', fontWeight: 'bold' }}
                onPress={() => {
                  this.props.navigation.navigate({
                      routeName: 'ReportTwo',
                      params: { 
                        headerTitle: 'การสัมผัสเลือดหรือสารคัดหลั่ง',
                        reportKeyId: reportKeyId
                      }
                  });
                }}
            >การสัมผัสเลือดหรือสารคัดหลั่ง</Text>
          </TouchableOpacity> 
          <TouchableOpacity 
            style ={{
                padding: 15,
                margin: 15,
                borderRadius: 8,
                backgroundColor : "#fbc02d",
            }}>
            <Text 
                style={{ fontSize: 16, color: '#263238', textAlign: 'center', fontWeight: 'bold' }}
                onPress={() => {
                  this.props.navigation.navigate({
                    routeName: 'ReportThree',
                    params: { 
                      headerTitle: 'การถูกผู้ป่วยกัด',
                      reportKeyId: reportKeyId
                    }
                  });
                }}
            >การถูกผู้ป่วยกัด</Text>
          </TouchableOpacity>  
        </ScrollView>
    } else {
      return <ActivityIndicator animating={true} size="large" color="#0000ff" />
    }
  }

};

ReportMainScreen.navigationOptions = ({ navigation }) => ({
  title: 'Report | ลักษณะการเกิดอุบัติเหตุ',
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
  container: { flex: 1, paddingTop: 15, backgroundColor: '#fff', marginTop: '40%' },
  screen: { flex: 1, justifyContent: 'center', padding: 15 },
  titleHeading: { flex: 1, justifyContent: 'center', paddingLeft: 15 }
});

export default ReportMainScreen;