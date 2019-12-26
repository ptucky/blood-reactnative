import React ,{ PureComponent } from 'react';
import { ScrollView, View, StyleSheet, AsyncStorage, Picker, Text, 
  TextInput, ActivityIndicator, RefreshControl,
  TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import TabBarIcon from '../components/TabBarIcon';
import GlobalConfig from '../constants/GlobalConfig';

const scoreNumber = [
  {id: '5', name: 'พึงพอใจมากที่สุด = 5'},
  {id: '4', name: 'พึงพอใจมาก = 4'},
  {id: '3', name: 'พึงพอใจปานกลาง = 3'},
  {id: '2', name: 'พึงพอใจน้อย = 2'},
  {id: '1', name: 'พึงพอใจน้อยที่สุด = 1'},
];

class QuestionaireAnsScreen extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isEditable: true,
      questionaireInfoId: null,
      questionaires: null,
      recommended: '',
      recommended_id: '15'
    }
  }
  
  onFocusFunction = async () => {
    // do some stuff on every screen focus
    try {
      const questionaire_info_id = this.props.navigation.getParam('questionaire_info_id',this.state.questionaireInfoId)
      await fetch(`${GlobalConfig.urlApi}/api/get_choice_questionaire`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: `${GlobalConfig.authToken}`,
          questionaire_info_id: `${questionaire_info_id}`
        }),
      }).then((response) => response.json())
      .then((responseJson) => {
  
        this.setState({refreshing: false});
        this.setState({
          loading: false,
          questionaire_info_id: `${questionaire_info_id}`,
          questionaires: responseJson['questionaire']
        });

      })
      .catch((error) => {
        console.error(error);
      });
    } catch(err) {
      console.log("Error fetching", err);
    } 

  }

  componentWillUnmount () {
    this.focusListener.remove()
  }
  
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }
  
  _onRefresh() {
    this.setState({refreshing: true});
    this.onFocusFunction()
  }

  render() {
    const { loading, isEditable, questionaires } = this.state;
     
    if(!loading) {
      return <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled keyboardVerticalOffset={120}>
        <ScrollView contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        > 
        <View style={{paddingLeft: 20, paddingRight: 20}}>
          {
            questionaires.map(item => (
              <View key={item.id} style={[{width:"100%"}]}>
                <Text>
                {
                  (item.queston_main || item.queston_main != null)?
                    <Text key={'header_' + item.id} style={styles.sectionHeader}>
                      { (item.id > 1)? '\n' : '' }
                      { item.group_type + '.' + item.queston_main + '\n' }  
                    </Text>
                  : ''
                }
                </Text>
                {     
                  <View style={styles.contentView, {paddingLeft: 16, paddingRight: 16}}>
                    <Text key={ 'sub_' + item.id} style={styles.item}>
                      { (item.type == "C")? item.group_type + '.' + item.order + '.' + item.queston_sub : ''}
                    </Text>
                    { 
                      (item.type == "C")?
                        <Picker
                          style={{ backgroundColor: "#fafafa", marginBottom: 15, borderWidth: 0, width: '100%', color: '#fabb5c' }}
                          itemStyle={{height: 80, color: '#fabb5c', width: '100%', fontSize: 16 }}
                          selectedValue={this.state['q_' + `${item.group_type}` + '_' + `${item.order}`]}
                          onValueChange={(value) => { 
                            this.setState({
                              ['q_' + `${item.group_type}` + '_' + `${item.order}`] : value, 
                              ['q_' + `${item.group_type}` + '_' + `${item.order}` + '_qid'] : item.id
                            }) 
                          }}
                        >
                          <Picker.Item label='-- ระดับคะแนนความพึงพอใจ --' value='' />
                          {
                            scoreNumber.map(item => (
                              <Picker.Item key={ 'score_' + item.id} label={item.name} value={item.id} />
                            ))
                          }
                        </Picker>
                      :
                        <TextInput 
                          maxLength={200}
                          style={[styles.textInput, { borderColor: isEditable ? 'grey' : '#fabb5c' }]} 
                          editable={isEditable}
                          value={this.state.recommended}
                          onChangeText={(recomm) => this.setState({recommended: recomm , recommended_id: item.id })}
                          placeholder='คำแนะนำติชม'
                        />
                    }
                  </View>
                }
              </View>
            ))
          }
        </View>
        <TouchableOpacity 
            style ={{
                padding: 15,
                marginLeft: 20,
                marginRight: 20,
                marginTop: 20,
                marginBottom: 40,
                borderRadius: 8,
                backgroundColor : "#ea6045",
            }}>
            <Text 
                style={{ fontSize: 16, color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}
                onPress={this._handleSubmit.bind(this)}
            >บันทึก</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    } else {
      return <ActivityIndicator animating={true} size="large" color="#0000ff" />
    }

  }

  _handleSubmit = async() => {

    if(this.state){  
      const user_id = await AsyncStorage.getItem('isLoggedIn');

      try {
        await fetch(`${GlobalConfig.urlApi}/api/add_questionaire_ans`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth_token: `${GlobalConfig.authToken}`,
            user_id: `${user_id}`,
            questionaire_info_id: this.state.questionaire_info_id,
            datas: [
              { questionaire_info_id: this.state.questionaire_info_id, questionaire_id: this.state.q_1_1_qid, score: this.state.q_1_1, recommend_text: '' },
              { questionaire_info_id: this.state.questionaire_info_id, questionaire_id: this.state.q_1_2_qid, score: this.state.q_1_2, recommend_text: '' },
              { questionaire_info_id: this.state.questionaire_info_id, questionaire_id: this.state.q_1_3_qid, score: this.state.q_1_3, recommend_text: '' },
              { questionaire_info_id: this.state.questionaire_info_id, questionaire_id: this.state.q_2_1_qid, score: this.state.q_2_1, recommend_text: '' },
              { questionaire_info_id: this.state.questionaire_info_id, questionaire_id: this.state.q_2_2_qid, score: this.state.q_2_2, recommend_text: '' },
              { questionaire_info_id: this.state.questionaire_info_id, questionaire_id: this.state.q_2_3_qid, score: this.state.q_2_3, recommend_text: '' },
              { questionaire_info_id: this.state.questionaire_info_id, questionaire_id: this.state.q_2_4_qid, score: this.state.q_2_4, recommend_text: '' },
              { questionaire_info_id: this.state.questionaire_info_id, questionaire_id: this.state.q_2_5_qid, score: this.state.q_2_5, recommend_text: '' },
              { questionaire_info_id: this.state.questionaire_info_id, questionaire_id: this.state.q_3_1_qid, score: this.state.q_3_1, recommend_text: '' },
              { questionaire_info_id: this.state.questionaire_info_id, questionaire_id: this.state.q_3_2_qid, score: this.state.q_3_2, recommend_text: '' },
              { questionaire_info_id: this.state.questionaire_info_id, questionaire_id: this.state.q_4_1_qid, score: this.state.q_4_1, recommend_text: '' },
              { questionaire_info_id: this.state.questionaire_info_id, questionaire_id: this.state.q_4_2_qid, score: this.state.q_4_2, recommend_text: '' },
              { questionaire_info_id: this.state.questionaire_info_id, questionaire_id: this.state.q_4_3_qid, score: this.state.q_4_3, recommend_text: '' },
              { questionaire_info_id: this.state.questionaire_info_id, questionaire_id: this.state.recommended_id, score: '', recommend_text: this.state.recommended }
            ]
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            if(responseJson['code'] == 200)
            {
              this.setState({
                loading: true
              });
              
              this.props.navigation.navigate({
                routeName: 'ThankYou',
                params: { 
                  headerTitle: 'เก็บข้อมูลเสร็จสมบูรณ์',
                  message: 'ระบบจัดเก็บข้อมูลการตอบแบบสอบถาม \nเสร็จสมบูรณ์ ขอบคุณค่ะ'
                }
              });

            } else {
              alert('ไม่สามารถจัดเก็บช้อมูลนี้ในระบบ!');
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } catch(err) {
        console.log("Error fetching", err);
      }

    } else {
      alert('กรุณากรอกข้อมูลให้ครบทุกข้อ');
    }
    
  }
  
}

QuestionaireAnsScreen.navigationOptions = ({ navigation }) => ({
  title: 'Questionaire | แบบสอบถาม',
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
container: { flex: 1, paddingTop: 15, backgroundColor: '#fff', marginTop: 1 },
contentContainer: { paddingTop: 30 },
screen: { flex: 1, justifyContent: 'center', padding: 15 },
titleHeading: { flex: 1, justifyContent: 'center', paddingLeft: 15 },
contentView: { flex: 1 },
fixToText: { flexDirection: 'row', justifyContent: 'space-between' },
fixToTextBtn:{ flexDirection: 'column', marginTop: 30, marginBottom: 40, paddingLeft: 20, paddingRight: 20 },
textInput: { textAlign: 'center', width: '99%', height: 40, borderWidth: 1, marginBottom: 20 },
txtProfile: { fontSize: 16 },
sectionHeader: { paddingLeft: 10, paddingRight: 10, fontSize: 16, fontWeight: 'bold' },
item: { fontSize: 16 }
});

export default QuestionaireAnsScreen;
