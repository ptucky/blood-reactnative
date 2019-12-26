import React ,{ PureComponent } from 'react';
import { 
  ScrollView, AsyncStorage, View, StyleSheet, 
  Button, Picker, Text, TextInput, ActivityIndicator, 
  RefreshControl, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import TabBarIcon from '../components/TabBarIcon';
import { CheckBox } from 'react-native-elements';
import GlobalConfig from '../constants/GlobalConfig';

const education = [
  {id: 'B', name: 'ปริญญาตรี หรือ เทียบเท่า'},
  {id: 'M', name: 'ปริญญาโท'},
  {id: 'D', name: 'ปริญญาเอก'},
  {id: 'O', name: 'อื่นๆ โปรดระบุ'},
];

const checkYesNo = [
  {id: 'N', name: 'ไม่ได้รับ'},
  {id: 'Y', name: 'ได้รับ'},
];

class QuestionaireScreen extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loading: true,
      isEditable: true,
      check_exist: false,
      pickerValGender: '',
      age: '',
      pickerValEducate: '',
      pickerValEducateText: '',
      work_experience: '',
      pickerValKnowledgeText: '',
      accidentCheckMain: '',
      accident_number: '',
      knowledgeCheckMain: '',
      knowledgeCheckbox1: false,
      knowledgeCheckbox2: false,
      knowledgeCheckbox3: false,
      knowledgeCheckbox4: false,
      knowledgeCheckbox5: false,
      knowledgeCheckbox6: false,
      knowledgeCheckbox7: false,
    }
  }
  
  onFocusFunction = async () => {
    try {
      const userId = await AsyncStorage.getItem('isLoggedIn');
      await fetch(`${GlobalConfig.urlApi}/api/check_questionaire_info`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: `${GlobalConfig.authToken}`,
          user_id: `${userId}`
        }),
      }).then((response) => response.json())
      .then((responseJson) => {
        
        this.setState({refreshing: false});
        this.setState({
          loading: false,
          check_exist: responseJson['check_exist']
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
    const { loading, isEditable, check_exist } = this.state;

    if(!loading) {
      if(!check_exist) {
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
              <View style={styles.fixToText}>
                <View style={[{width:"55%"}]}>
                  <Text style={styles.txtProfile, { textAlign: 'center', paddingBottom: 10, fontSize: 16 }}>ระยะเวลาทำงาน/ปี</Text>
                </View>
                <View style={[{width:"40%"}]}>
                  <Text style={styles.txtProfile, { textAlign: 'center', paddingBottom: 10, fontSize: 16 }}>อายุ/ปี</Text>
                </View>
              </View>

              <View style={styles.fixToText}>
                <View style={[{width:"55%"}]}>
                  <TextInput 
                    keyboardType={'numeric'}
                    maxLength={2}
                    style={[styles.textInput, { borderColor: isEditable ? 'grey' : 'blue' }]} 
                    editable={isEditable} 
                    onChangeText={(work_experience) => this.setState({work_experience})} 
                    value={this.state.work_experience}
                  />
                </View>
                <View style={[{width:"40%"}]}>
                  <TextInput 
                    keyboardType={'numeric'}
                    maxLength={2}
                    style={styles.textInput} 
                    value={this.state.age}
                    onChangeText={(age) => this.setState({age})}
                  />
                </View>
              </View> 
          
              <Text style={{ fontSize: 16 }}>เพศ</Text>
              <Picker
                style={{ backgroundColor: "#fafafa", marginBottom: 15, borderWidth: 0, width: '100%', color: '#fabb5c' }}
                itemStyle={{height: 80, color: '#fabb5c', width: '100%', fontSize: 18 }}
                selectedValue={this.state.pickerValGender}
                onValueChange={(genderValue) => {
                  this.setState({pickerValGender: genderValue});
                }}
              >
                <Picker.Item key='0' label='-เลือก-' value='' />
                <Picker.Item key='1' label='ชาย' value='M' />
                <Picker.Item key='2' label='หญิง' value='W' />
              </Picker>

              <Text style={styles.txtProfile}>ระดับการศึกษา</Text>
              <View style={[{width:"100%"}]}>
                <Picker
                  style={{ backgroundColor: "#fafafa", marginBottom: 15, borderWidth: 0, width: '100%', color: '#fabb5c' }}
                  itemStyle={{height: 80, color: '#fabb5c', width: '100%', fontSize: 18 }}
                  selectedValue={this.state.pickerValEducate}
                  onValueChange={(value) => {
                    this.setState({pickerValEducate: value});
                  }}
                >
                  <Picker.Item key='0' label='-เลือก-' value='' />
                  {
                    education.map(item => (
                      <Picker.Item key={item.id} label={item.name} value={item.id} />
                    ))
                  }
                </Picker>
                { 
                  (this.state.pickerValEducate == 'O')? 
                    <TextInput
                      maxLength={150}
                      placeholder="ระดับการศึกษา"
                      style={[styles.textInput, { borderColor: isEditable ? 'grey' : '#fabb5c' }]} 
                      editable={isEditable} value={this.state.pickerValEducateText} 
                      onChangeText={(text) => this.setState({ pickerValEducateText : text})} />
                  : 
                  this.setState({ pickerValEducateText : ''}) 
                }
              </View>

              <Text style={styles.txtProfile, { height: 75, marginTop: 10, fontSize: 16 } }>การได้รับความรู้เกี่ยวกับการป้องกันการสัมผัสเลือดหรือสารคัดหลั่ง/อุบัติเหตุเข็มทิ่มตำหรือของมีคมบาดในช่วง 1 ปีที่ผ่านมา</Text>
              <View style={[{width:"100%"}]}>
                <Picker
                  style={{ backgroundColor: "#fafafa", marginBottom: 15, borderWidth: 0, width: '100%', color: '#fabb5c' }}
                  itemStyle={{height: 80, color: '#fabb5c', width: '100%', fontSize: 18 }}
                  selectedValue={this.state.knowledgeCheckMain}
                  onValueChange={(value) => {
                    this.setState({knowledgeCheckMain: value});
                  }}
                >
                  <Picker.Item key='0' label='-เลือก-' value='' />
                  {
                    checkYesNo.map(item => (
                      <Picker.Item key={item.id} label={item.name} value={item.id} />
                    ))
                  }
                </Picker>
                { 
                  (this.state.knowledgeCheckMain == 'Y')?  
                    <View style={{width: '99%'}}>   
                      <CheckBox
                        title='อ่านจากตำราหรือวารสาร'
                        value={this.state.knowledgeCheckbox1}
                        checked={this.state.knowledgeCheckbox1}
                        onPress={() => this.setState({ 
                          knowledgeCheckbox1: !this.state.knowledgeCheckbox1,  
                        })}
                      />
                      <CheckBox
                        title='อ่านจากคู่มือของกระทรวงสาธารณสุข'
                        value={this.state.knowledgeCheckbox2}
                        checked={this.state.knowledgeCheckbox2}
                        onPress={() => this.setState({ 
                          knowledgeCheckbox2: !this.state.knowledgeCheckbox2,  
                        })}
                      />
                      <CheckBox
                        title='การอบรม/ประชุมวิชาการภายในโรงพยาบาล'
                        value={this.state.knowledgeCheckbox3}
                        checked={this.state.knowledgeCheckbox3}
                        onPress={() => this.setState({ 
                          knowledgeCheckbox3: !this.state.knowledgeCheckbox3,  
                        })}
                      />
                      <CheckBox
                        title='การอบรม/ประชุมวิชาการของหน่วยงานอื่น'
                        value={this.state.knowledgeCheckbox4}
                        checked={this.state.knowledgeCheckbox4}
                        onPress={() => this.setState({ 
                          knowledgeCheckbox4: !this.state.knowledgeCheckbox4,  
                        })}
                      />
                      <CheckBox
                        title='การนิเทศขณะปฏิบัติงานจากหัวหน้าเวร หรือหัวหน้าหอผู้ป่วย'
                        value={this.state.knowledgeCheckbox5}
                        checked={this.state.knowledgeCheckbox5}
                        onPress={() => this.setState({ 
                          knowledgeCheckbox5: !this.state.knowledgeCheckbox5,  
                        })}
                      />
                      <CheckBox
                        title='ค้นคว้าข้อมูลจากอินเตอร์เนต'
                        value={this.state.knowledgeCheckbox6}
                        checked={this.state.knowledgeCheckbox6}
                        onPress={() => this.setState({ 
                          knowledgeCheckbox6: !this.state.knowledgeCheckbox6,  
                        })}
                      />
                      <CheckBox
                        title='อื่นๆ โปรดระบุ'
                        value={this.state.knowledgeCheckbox7}
                        checked={this.state.knowledgeCheckbox7}
                        onPress={() => this.setState({ knowledgeCheckbox7: !this.state.knowledgeCheckbox7 })}
                      />
                    </View> 
                  : 
                    this.setState({ 
                      knowledgeCheckbox1: false, 
                      knowledgeCheckbox2: false, 
                      knowledgeCheckbox3: false, 
                      knowledgeCheckbox4: false, 
                      knowledgeCheckbox5: false, 
                      knowledgeCheckbox6: false, 
                      knowledgeCheckbox7: false, 
                      pickerValKnowledgeText: '' 
                    })
                }
                {
                  (this.state.knowledgeCheckbox7)? 
                    <TextInput
                      placeholder="ความรู้อื่นๆ"
                      maxLength={150}
                      style={[styles.textInput, { borderColor: isEditable ? 'grey' : '#fabb5c' }]} 
                      editable={isEditable} value={this.state.pickerValKnowledgeText} 
                      onChangeText={(text) => this.setState({ pickerValKnowledgeText : text})} />
                  : 
                    this.setState({ pickerValKnowledgeText : ''}) 
                }
              </View>

              <Text style={styles.txtProfile, { marginTop: 10, fontSize: 16 } }>การได้รับอุบัติเหตุจากการสัมผัสเลือดหรือสารคัดหลั่ง/เข็มทิ่มตำหรือของมีคมบาดในช่วง 1 ปีที่ผ่านมา</Text>
              <View style={[{width:"100%", paddingBottom: 30}]}>
                <Picker
                  style={{ backgroundColor: "#fafafa", marginBottom: 15, borderWidth: 0, width: '100%', color: '#fabb5c' }}
                  itemStyle={{height: 80, color: '#fabb5c', width: '100%', fontSize: 18 }}
                  selectedValue={this.state.accidentCheckMain}
                  onValueChange={(value) => {
                    this.setState({accidentCheckMain: value});
                  }}
                >
                  <Picker.Item key='0' label='-เลือก-' value='' />
                  {
                    checkYesNo.map(item => (
                      <Picker.Item key={item.id} label={item.name} value={item.id} />
                    ))
                  }
                </Picker>
                {
                  (this.state.accidentCheckMain == 'Y')? 
                    <TextInput
                      placeholder="เข็มทิ่มตำ/ของมีคมบาด จำนวนครั้ง" 
                      style={[styles.textInput, { borderColor: isEditable ? 'grey' : '#fabb5c' }]} 
                      maxLength={2}
                      keyboardType={'numeric'}
                      editable={isEditable} value={this.state.accident_number} 
                      onChangeText={(text) => this.setState({ accident_number : text})} />
                  :
                    this.setState({ accident_number : ''}) 
                }
              </View>
            </View>
            <TouchableOpacity 
              style ={{
                  padding: 15,
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 0,
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
        return <View style={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          >
          <Text style={styles.welcome}>คุณได้ทำแบบสอบถามแล้ว!</Text>
          <Text style={styles.welcome}>ขอบคุณค่ะ</Text>
        </View>
      }
    } else {
      return <ActivityIndicator animating={true} size="large" color="#0000ff" />
    }

  }

  _handleSubmit = async() => {
    
    if(this.state.work_experience > 0 
      && this.state.age > 0 
      && this.state.pickerValGender != "" 
      && this.state.pickerValEducate != "" 
      && this.state.knowledgeCheckMain != "" 
      && this.state.accidentCheckMain != "")
    {
      const user_id = await AsyncStorage.getItem('isLoggedIn');
      try {
        await fetch(`${GlobalConfig.urlApi}/api/add_questionaire`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth_token: `${GlobalConfig.authToken}`,
            user_id: `${user_id}`,
            gender: this.state.pickerValGender,
            age: this.state.age,
            educate: this.state.pickerValEducate,
            educate_other_text: this.state.pickerValEducateText,
            work_experience: this.state.work_experience,
            accident_in_year: (this.state.accidentCheckMain)? 'Y' : 'N',
            accident_number: this.state.accident_number,
            knowledge: this.state.knowledgeCheckMain,
            knowledge_other_text: this.state.pickerValKnowledgeText,
            knowledge_one: (this.state.knowledgeCheckbox1)? 'Y' : 'N',
            knowledge_two: (this.state.knowledgeCheckbox2)? 'Y' : 'N',
            knowledge_three: (this.state.knowledgeCheckbox3)? 'Y' : 'N',
            knowledge_four: (this.state.knowledgeCheckbox4)? 'Y' : 'N',
            knowledge_five: (this.state.knowledgeCheckbox5)? 'Y' : 'N',
            knowledge_six: (this.state.knowledgeCheckbox6)? 'Y' : 'N',       
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            if(responseJson['code'] == 200)
            {
              this.setState({
                loading: true
              });
              this.props.navigation.navigate('QuestionaireAns', 
              { 
                questionaire_info_id: responseJson['questionaire_info_id'],
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

QuestionaireScreen.navigationOptions = ({ navigation }) => ({
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
container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
contentContainer: { paddingTop: 30 },
welcome: {fontSize: 22, justifyContent: 'center', alignItems: 'center', color: '#fabb5c', marginBottom: 10},
screen: { flex: 1, justifyContent: 'center', padding: 15, },
titleHeading: { flex: 1, justifyContent: 'center', paddingLeft: 15, },
contentView: { padding: 15, justifyContent: 'flex-end', flex: 1, },
fixToText: { flexDirection: 'row', justifyContent: 'space-between', },
fixToTextBtn:{ flexDirection: 'column', marginTop: 0, marginBottom: 40, },
textInput: { textAlign: 'center', width: '99%', height: 40, borderWidth: 1, marginBottom: 20, },
txtProfile: { fontSize: 16 },
});

export default QuestionaireScreen;