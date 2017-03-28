import React, { Component } from 'react';
import { Colors } from '../../Constants';
import { 
  StyleSheet, 
  View,
  TextInput, 
  TouchableOpacity, 
  Text, 
  KeyboardAvoidingView, 
  StatusBar,
  ActivityIndicator,
  Alert,
  Picker,
  Image
} from 'react-native';

import Storage from '../../lib/Storage';

import { Grades } from '../../Constants';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingLoginRequest: false,
      grade: '5A',
    }
  }

  async componentWillMount() {
    const grade = await Storage.getCourse() || '5A';

    this.setState({grade})
  }

  toggleLogin() {
    this.setState(state => {
      state.pendingLoginRequest = !state.pendingLoginRequest;
      return state;
    });
  }

  redirect(routeName) {
    this.props.navigator.replace({
      name: routeName,
    });
  }

  onPressLoginButton() {
    if (!this.state.pendingLoginRequest) {
      this.toggleLogin();

      const grade = this.state.grade === 'Alle' ? '' : this.state.grade;
      Storage.logIn(grade, this.state.pushNotifications)
      .then(() => this.redirect('Home'));
    }
  }

  render() {
    return (
      <KeyboardAvoidingView 
        behavior="padding" 
        style={styles.container}
      >
        <ActivityIndicator 
          animating={this.state.pendingLoginRequest}
          size='large'
          style={styles.activity}
        />
        <StatusBar
          barStyle="light-content"
          animated
          backgroundColor={Colors.Blue}
        />
        <Picker
          selectedValue={this.state.grade}
          onValueChange={grade => this.setState({ grade })}
          style={[styles.input, {color: 'white'}]}
        >
          {Grades.map(grade => 
            <Picker.Item label={grade} value={grade} key={grade}/>
          )}
        </Picker>
        <TouchableOpacity 
          style={styles.buttonContainer} 
          onPress={this.onPressLoginButton.bind(this)}
          activeOpacity={!this.state.pendingLoginRequest ? 0.2 : 1}
        >
          <Text style={styles.buttonText}>Fortfahren</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 5,
  },
  pushView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  push: {
    flex: 1,
  },
  pushImage: {
    tintColor: 'white',
  },
  pushText: {
    color: 'white',
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 15,
    paddingHorizontal: 10,
    color: 'white',
  },
  buttonContainer: {
    backgroundColor: Colors.Red,
    paddingVertical: 10
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  activity: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
});
