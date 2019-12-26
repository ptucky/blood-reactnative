import React ,{ PureComponent } from 'react';
import { ScrollView, StyleSheet, View, 
  Picker, ActivityIndicator, Text, TextInput, 
  AsyncStorage, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import TabBarIcon from '../components/TabBarIcon';
import GlobalConfig from '../constants/GlobalConfig';

import { ACCIDENTPLACE } from '../data/accident-place-data';
import { ACCIDENTTYPE } from '../data/accident-type-data';
import { ACCIDENTBODY } from '../data/accident-body-data';

class ReportScreen extends PureComponent {
  
  constructor(props) {
    super(props);
    let today = new Date();
    let dateNow = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let timeNow = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    this.state = {
      loading: true,
      isEditable: true,
      pickerValPlace: '',
      pickerValPlaceText: '',
      pickerValType: '',
      pickerValTypeText: '',
      pickerValBody: '',
      pickerValBodyText: '',
      checkbox1: false,
      checkbox2: false,
      checkbox3: false,
      chosenDate: dateNow,
      chosenTime: timeNow,
      work_shift: null,
    }
  }

  onFocusFunction = async () => {
    this.setState({
      loading: false
    });
  }

  componentWillUnmount () {
    this.focusListener.remove()
  }
  
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })  
  }

  render() {
    const accidentPlace = ACCIDENTPLACE;
    const accidentType = ACCIDENTTYPE; 
    const accidentBody = ACCIDENTBODY;
    const { loading, isEditable, pickerValPlace, pickerValType, pickerValBody } = this.state;
    
    if(!loading) {
      return <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled keyboardVerticalOffset={120}>
        <ScrollView style={styles.container}>
          <View style={{paddingLeft: 20, paddingRight: 20}}> 
            <Text style={{ paddingBottom: 10, fontSize: 16 }}>วัน เดือน ปี เกิดอุบัติเหตุ</Text>
              <DatePicker
              style={{width: '98%', paddingTop:10, paddingBottom: 20}}
              date={this.state.chosenDate}
              mode="date"
              placeholder="วันที่"
              format="YYYY-MM-DD"
              minDate="2019-01-01"
              maxDate="2030-12-31"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
              }}
              onDateChange={(date) => {this.setState({chosenDate: date})}}
            />
          </View>
          <View style={{paddingLeft: 20, paddingRight: 20}}>
            <Text style={{ paddingBottom: 10, fontSize: 16 }}>เวลาเกิดอุบัติเหตุ</Text>
            <DatePicker
              style={{width: '99%', paddingTop:10, paddingBottom: 10}}
              date={this.state.chosenTime}
              mode="time"
              placeholder="เวลา"
              format={'HH:mm'}
              minDate="00:00"
              maxDate="24:00"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
              }}
              onDateChange={(time) => {this.setState({chosenTime: time})}}
            />
          </View>

          <View style={styles.contentView}>   
            <View style={{width: '99%'}}>   
              <CheckBox
                title='เวรเช้า'
                value={this.state.checkbox1}
                checked={this.state.checkbox1}
                onPress={() => this.setState({ 
                  checkbox1: !this.state.checkbox1,  
                  checkbox2: false,
                  checkbox3: false,
                })}
              />
            </View>  
            <View style={{width: '99%'}}>  
              <CheckBox
                title='เวรบ่าย'
                value={this.state.checkbox2}
                checked={this.state.checkbox2}
                onPress={() => this.setState({ 
                  checkbox1: false,
                  checkbox2: !this.state.checkbox2,
                  checkbox3: false, 
                })}
              />
            </View> 
            <View style={{width: '99%'}}>
              <CheckBox
                title='เวรดึก'
                value={this.state.checkbox3}
                checked={this.state.checkbox3}
                onPress={() => this.setState({ 
                  checkbox1: false,
                  checkbox2: false,
                  checkbox3: !this.state.checkbox3
                })}
              />
            </View> 
          </View>

          <View style={styles.contentView, {paddingLeft: 25, paddingRight: 25}}>
            <Text style={{ fontSize: 16 }}>สถานที่เกิดอุบัติเหตุ</Text>
            <View style={[{width:"100%"}]}>
              <Picker
                style={{ backgroundColor: "#fafafa", marginBottom: 15, borderWidth: 0, width: '100%', color: '#fabb5c' }}
                itemStyle={{ height: 80, color: '#fabb5c', width: '100%', fontSize: 18 }}
                selectedValue={pickerValPlace || 1}
                onValueChange={(value) => {
                  this.setState({pickerValPlace: value});
                }} 
              >
                <Picker.Item key='0' label='-เลือก-' value='' />
                {
                  accidentPlace.map(item => (
                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                  ))
                }
              </Picker>
              { (pickerValPlace == accidentPlace[accidentPlace.length - 1].id) ? <TextInput style={[styles.textInput, { borderColor: isEditable ? 'grey' : '#fabb5c' }]} placeholder="" editable={isEditable} onChangeText={(text) => this.setState({ pickerValPlaceText:text})}></TextInput> : null }
              { /* <Text>{ JSON.stringify(accidentPlace[accidentPlace.length - 1].id) }</Text> */}
            </View>

            <Text style={{ fontSize: 16 }}>ลักษณะการเกิดอุบัติเหตุ</Text>
            <View style={[{width:"100%"}]}>
              <Picker
                style={{ backgroundColor: "#fafafa", marginBottom: 15, borderWidth: 0, width: '100%', color: '#fabb5c' }}
                itemStyle={{height: 80, color: '#fabb5c', width: '100%', fontSize: 18 }}
                selectedValue={pickerValType || 1}
                onValueChange={(value) => {
                  this.setState({pickerValType: value});
                }} 
              >
                <Picker.Item key='0' label='-เลือก-' value='' />
                {
                  accidentType.map(item => (
                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                  ))
                }
              </Picker>
              { (pickerValType == accidentType[accidentType.length - 1].id) ? <TextInput style={[styles.textInput, { borderColor: isEditable ? 'grey' : '#fabb5c' }]} placeholder="" editable={isEditable} onChangeText={(text) => this.setState({ pickerValTypeText:text})}></TextInput> : null }
            </View>

            <Text style={{ fontSize: 16 }}>ส่วนของร่างกายที่ได้รับอุบัติเหตุหรือบาดเจ็บ</Text>
            <View style={[{width:"100%"}]}>
              <Picker
                style={{ backgroundColor: "#fafafa", marginBottom: 15, borderWidth: 0, width: '100%', color: '#fabb5c' }}
                itemStyle={{height: 80, color: '#fabb5c', width: '100%', fontSize: 18 }}
                selectedValue={pickerValBody || 1}
                onValueChange={(value) => {
                  this.setState({pickerValBody: value});
                }}
              >
                <Picker.Item key='0' label='-เลือก-' value='' />
                {
                  accidentBody.map(item => (
                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                  ))
                }
              </Picker>
              { (pickerValBody == accidentBody[accidentBody.length - 1].id) ? <TextInput style={[styles.textInput, { borderColor: isEditable ? 'grey' : '#fabb5c' }]} placeholder="" editable={isEditable} onChangeText={(text) => this.setState({pickerValBodyText:text})}></TextInput> : null }
            </View>

          </View>
          
          <TouchableOpacity style={styles.button}>
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
    let workShip = '0';
    if(this.state.checkbox1){ 
      workShip = '1';
    }else if(this.state.checkbox2){ 
      workShip = '2';
    }else if(this.state.checkbox3){
      workShip = '3';
    }

    if(this.state.chosenDate && this.state.chosenTime && workShip > 0 && this.state.pickerValPlace && this.state.pickerValType && this.state.pickerValBody)
    {
      const user_id = await AsyncStorage.getItem('isLoggedIn');
      try {
        await fetch(`${GlobalConfig.urlApi}/api/add_accident_report`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth_token: `${GlobalConfig.authToken}`,
            user_id: `${user_id}`,
            date: this.state.chosenDate,
            time: this.state.chosenTime,
            work_shift: workShip,
            accident_place_id: this.state.pickerValPlace, 
            accident_place_text: this.state.pickerValPlaceText,
            accident_type_id: this.state.pickerValType,
            accident_type_text: this.state.pickerValTypeText,
            accident_body_id: this.state.pickerValBody,
            accident_body_text: this.state.pickerValBodyText
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            if(responseJson['code'] == 200){
              this.setState({
                loading: true
              });
              this.props.navigation.navigate('ReportMain', 
              { 
                reportKeyId: responseJson['report_id'],
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

ReportScreen.navigationOptions = ({ navigation }) => ({
  title: 'Report | รายงานอุบัติเหตุ',
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
  container: { flex: 1, paddingTop: 15, backgroundColor: '#fff', marginTop: 15 },
  screen: { flex: 1, justifyContent: 'center', padding: 15, },
  titleHeading: { flex: 1, justifyContent: 'center', paddingLeft: 15, },
  contentView: { padding: 15, justifyContent: 'flex-end', flex: 1, },
  fixToText: { flexDirection: 'row', justifyContent: 'space-between', },
  fixToTextBtn:{ flexDirection: 'column', marginTop: 30, marginBottom: 40, paddingLeft: 20, paddingRight: 20 },
  textInput: { textAlign: 'center', width: '98%', height: 40, borderWidth: 1, marginBottom: 20, },
  button: { padding: 15, margin: 15, marginBottom: 45, borderRadius: 8, backgroundColor : "#ea6045" }
});

export default ReportScreen;
