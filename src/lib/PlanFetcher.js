'use strict';

import { NetInfo, NativeModules } from 'react-native';
import { EventEmitter } from 'events';
import Storage from './Storage';

import { API_URL, Teachers } from '../Constants';

class PlanFetcher extends EventEmitter {
  constructor() {
    super();
    this.updateCourse();
  }

  async updateCourse() {
    const course = await Storage.getCourse();
    this.course = course;
    return course;
  }

  isSamePlanArray(a, b) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      const props = Object.getOwnPropertyNames(a[i]);
      for (let j = 0; j < props.length; j++) {
        if (a[i][props[j]] !== b[i][props[j]]) {
          return false;
        }
      }
    }
    return true;
  }

  async fetchPlan(when) {
    const course = this.course || this.updateCourse();
    let URL = `${API_URL}vplan/${when}/`;
    URL += course && course !== 'Alle' ? course.substring(0, 2) : '';

    console.log(URL);

    try {
      const response = await fetch(URL);
      const responseJson = await response.json();
      return responseJson;
    } catch(error) {
      return error;
    }
  }

  async getPlan() {
    const isConnected = await NetInfo.isConnected.fetch();

    if (!isConnected) {
      return null;
    }
    
    try {
      let today = await this.fetchPlan('today');
      let tomorrow = await this.fetchPlan('tomorrow');

      if (today) {
        today.data = today.data
          .map(p => {
            p.lehrer = Teachers[p.lehrer] || p.lehrer;
            p.vertreter = Teachers[p.vertreter] || p.vertreter;
            return p;
          });
        today.available = true;
      } else {
        today = {
          data: [],
          available: false,
        };
      }

      if (tomorrow) {
        tomorrow.data = tomorrow.data
          .map(p => {
            p.lehrer = Teachers[p.lehrer] || p.lehrer;
            p.vertreter = Teachers[p.vertreter] || p.vertreter;
            return p;
          });
        tomorrow.available = true;
      } else {
        tomorrow = {
          data: [],
          available: false,
        };
      }
      return { plan: {today, tomorrow} };
    } catch (err) {
      return null;
    }
  }
}

const planFetcher = new PlanFetcher();

export default planFetcher;