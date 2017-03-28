'use strict';

import { AsyncStorage } from 'react-native';

export default new (class Storage {
  async isLoggedIn() {
   return await AsyncStorage.getItem('@Root:isLoggedIn') === 'true';
  }

  async logIn(course, pushNotificationsEnabled) {
    AsyncStorage.setItem('@Root:isLoggedIn', 'true');
    this.setCourse(course);
    this.setPlan(null);
    return true;
  }

  logOut() {
    AsyncStorage.setItem('@Root:isLoggedIn', 'false');
  }


  setPlan(data) {
    AsyncStorage.setItem('@Plan:data', JSON.stringify(data));
  }

  setCourse(course) {
    AsyncStorage.setItem('@Root:course', course);
  }

  async getCourse() {
    const course = await AsyncStorage.getItem('@Root:course');
    return course;
  }

  async getPlan() {
    const plan = await AsyncStorage.getItem('@Plan:data');
    return JSON.parse(plan);
  }
})();