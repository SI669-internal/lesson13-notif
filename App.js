import React from 'react';
import {StyleSheet, View, Text, Keyboard} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {Notifications} from 'expo';
import * as Permissions from 'expo-permissions';

export default class NotifApp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      inputText: '',
      statusText: 'Nothing yet'
    }
  }

  componentDidMount() {
    // We need to ask for Notification permissions for ios devices
    Permissions.askAsync(Permissions.NOTIFICATIONS).then(result => {
      if (result.status === 'granted') {
        console.log('Notification permissions granted.');

        // If we want to do something with the notification when the app
        // is active, we need to listen to notification events and 
        // handle them in a callback
        Notifications.addListener(this.handleNotification);
      } else {
        this.setState({statusText: 'Notification permissions not granted. Not gonna work!'})
      }
    });
  }

  handleNotification = () => {
    this.setState({statusText: 'Notification was handled'});
  }

  onScheduleIt = () => {

    Keyboard.dismiss();

    const localNotification = {
      title: 'done',
      body: 'done!'
    };

    const schedulingOptions = {
      time: (new Date()).getTime() + Number(this.state.inputText)
    }

    // Notifications show only when app is not active.
    // (ie. another app being used or device's screen is locked)
    Notifications.scheduleLocalNotificationAsync(
      localNotification, schedulingOptions
    );

    this.setState({
      inputText: '',
      statusText: 'Notification has been scheduled'
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <Input
          containerStyle={{width: '50%'}}
          value={this.state.inputText}
          onChangeText={text=>{this.setState({inputText: text})}}
          placeholder={'time in ms'}
        />
        <Button
          style={{margin: 30}}
          title='Schedule It!'
          onPress={this.onScheduleIt}
        />
        <Text>
          {this.state.statusText}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
