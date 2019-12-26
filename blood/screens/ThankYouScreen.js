import React ,{ PureComponent } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

class LinkDetailScreen extends PureComponent { 
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      message: 'เก็บข้อมูล เรียบร้อย'
    }
  }

  async componentDidMount() {
    try {
      this.setState({
        loading: false,
        message: this.props.navigation.getParam('message',this.state.message),
      });
    } catch(err) {
      console.log("Error fetching", err);
    }
  }

  render() {
    const { loading, message } = this.state;  

    if(!loading) {
      return <View style={styles.container}>
          <Text style={styles.welcome}>{message}</Text>
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
            >กลับหน้าหลัก</Text>
          </TouchableOpacity>
        </View> 
    } else {
      return <ActivityIndicator animating={true} size="large" color="#0000ff" />
    }
  }
  
  _handleSubmit = async() => {
    this.props.navigation.navigate({
      routeName: 'Report',
    });
  }
  
}


LinkDetailScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('headerTitle'),
  headerStyle: { backgroundColor: '#ffcc80'},
  headerTintColor: '#444',
  headerTitleStyle: { fontWeight: 'bold' },
  headerLeft: null
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center'},
  welcome: {fontSize: 20, marginTop: '-15%', color: '#fabb5c', textAlign: 'center'},
});

export default LinkDetailScreen;