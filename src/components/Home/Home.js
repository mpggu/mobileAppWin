import React, { Component } from 'react';
import { StyleSheet, View, Text, NetInfo, NativeModules } from 'react-native';

import PlanFetcher from '../../lib/PlanFetcher';
import Storage from '../../lib/Storage';

import Header from './Header';
import LoadingScreen from '../LoadingScreen';
import PullToRefresh from './PullToRefresh';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      plan: {
        today: null,
        tomorrow: null,
      },
    };
  }

  async componentWillMount() {
    await PlanFetcher.updateCourse();
    this.updateView();
  }

  async updateView() {
    const data = await PlanFetcher.getPlan();

    if (!data) {
      return setTimeout(this.updateView.bind(this), 5000);
    }

    Storage.setPlan(data);
    this.setState(data);
  }

  render() {
    if (this.state.plan.today || this.state.plan.tomorrow) {
      return (
        <View style={styles.container}>
          <Header
            updateView={this.updateView.bind(this)} 
            plan={this.state.plan}
            navigator={this.props.navigator}
          />

          <PullToRefresh />
        </View>
      );
    }

    return <LoadingScreen />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

