import React ,{ PureComponent } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, AsyncStorage } from 'react-native';
import { ListItem } from 'react-native-elements'
import Constants from 'expo-constants';

const { manifest = {} } = Constants;
const list = [
  {
    title: 'เกี่ยวกับผู้จัดทำ',
    subtitle: 'นางสาว สุชารัตน์ เจริญ นักศึกษาปริญญาโท \nสาขาการพยาบาลผู้ป่วยโรคติดเชื้อและการควบคุมการติดเชื้อ คณะพยาบาลศาตร์ มหาวิทยาลัยเชียงใหม่ \n\nผู้ร่วมจัดทำ \nศาตราจารย์ ดร.อะเคื้อ อุณหเลขถะ \nรองศาตราจารย์ ดร.พิมพาภรณ์ กลั่นกลิ่น \nนายประวีร์ เวียงอินทร์ \nโรงพยาบาลบํารุงราษฎร์ อินเตอร์เนชั่นแนล \n',
    icon: 'info',
    route: '#'
  },
  {
    title: 'ติดต่อ / ช่วยเหลือ',
    subtitle: 'อีเมล์: noon.sutharat1403@gmail.com \nมือถือ: 094-6417319',
    icon: 'help-outline',
    route: '#'
  },
  {
    title: 'เวอร์ชั่น',
    subtitle: 'sdk: ' + manifest.sdkVersion + ' / v.' + manifest.version,
    icon: 'developer-mode',
    route: '#'
  },
  {
    title: 'แบบสอบถาม',
    subtitle: null,
    icon: 'font-download',
    route: 'Questionaire'
  },
];

class LinkDetailScreen extends PureComponent { 
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      type_logged_in: null
    }
  }

  async componentDidMount() {
    try {
      const typeLoggedIn = await AsyncStorage.getItem('typeLoggedIn');
      this.setState({
        loading: false,
        type_logged_in: typeLoggedIn
      });
    } catch(err) {
      console.log("Error fetching", err);
    }
  }

  render() {
    const { loading, type_logged_in } = this.state;  

    if(!loading) {
      return <ScrollView contentContainerStyle={styles.contentContainer}>
        <View>
        {
          list.map((item, i) => (
            (item.subtitle != null)?
            <ListItem
              key={i}
              title={item.title}
              subtitle={item.subtitle}
              leftIcon={{ name: item.icon }}
              bottomDivider
              onPress={() => this.props.navigation.navigate({ routeName: item.route }) }
            />
            :
            <ListItem
              key={i}
              title={item.title}
              leftIcon={{ name: item.icon }}
              bottomDivider
              onPress={() => this.props.navigation.navigate({ routeName: item.route }) }
              />
          ))
        }
        {
          (type_logged_in === '"ADMIN"')?
            <ListItem
            key={4}
            title="Report / รายงาน"
            leftIcon={{ name: 'https' }}
            bottomDivider
            onPress={ this._statistic }
            />
          :
            <ListItem
            key={4}
            title=""
            leftIcon=""
            />
        }

        {
          (type_logged_in === '"ADMIN"')?
            <ListItem
              key={5}
              title="Reporter / ข้อมูลผู้รายงาน"
              leftIcon={{ name: 'https' }}
              bottomDivider
              onPress={ this._reporter }
              />
          :
            <ListItem
            key={5}
            title=""
            leftIcon=""
            />
        }
        </View> 
      </ScrollView>
    } else {
      return <ActivityIndicator animating={true} size="large" color="#0000ff" />
    }

  }

  _statistic = async () => {
    this.props.navigation.navigate('Statistic');
  }

  _reporter = async () => {
    this.props.navigation.navigate('Reporter');
  }


  _logOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Login',
      { phone: null }
    );
  }
             
}

LinkDetailScreen.navigationOptions = ({ navigation }) => ({
  title: 'Menu | เมนู',
  headerStyle: { backgroundColor: '#ffcc80'},
  headerTintColor: '#444',
  headerTitleStyle: { fontWeight: 'bold' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff'},
  contentContainer: {  paddingTop: 10 },
  developmentModeText: { marginBottom: 20, color: 'rgba(0,0,0,0.4)', fontSize: 14, lineHeight: 19, textAlign: 'center',},
  profileContainer: { alignItems: 'center', marginTop: 10, marginBottom: 10},
  txtProfile: {fontSize: 16,paddingVertical: 15,borderBottomColor: '#EEE',borderBottomWidth: 2},
  editProfile: {paddingTop: 15, paddingBottom: 15,paddingVertical: 15, marginTop: 20},
  textVersion: { fontSize: 12, textAlign: 'center' }
});

export default LinkDetailScreen;