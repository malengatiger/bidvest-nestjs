/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { MyUtils } from './my-utils';
import { Constants } from './constants';

const mm = '🍑 🍑 🍑 FirebaseManager 🍑 ';
const firebaseConfig = {
  apiKey: "AIzaSyApMsjLVjhZlLK8DmhYNTvoJoyR8uYIWwE",
  authDomain: "bidvest-33-8eaf4.firebaseapp.com",
  projectId: "bidvest-33-8eaf4",
  storageBucket: "bidvest-33-8eaf4.appspot.com",
  messagingSenderId: "950142618932",
  appId: "1:950142618932:web:573b15e1dc6e9bb358e961",
  measurementId: "G-8S4BHY7K54"
};


@Injectable()
export class FirebaseManager {
  public async initializeFirebase(): Promise<void> {
    Logger.log(`${mm} ... Initializing Firebase ...`);
    const app1 = admin.initializeApp(firebaseConfig);
    Logger.log(`${mm} ... Firebase initialized: name: ${firebaseConfig.projectId}   ...`);
    return null;
  }
  async sendInitializationMessage() {

    const date = MyUtils.formatISOStringDate(new Date().toISOString(), 'en');
    const message: admin.messaging.Message = {
      topic: Constants.admin,
      data: {
        message:
          '🍑 🍑 Bidvest Backend App started OK! 🅿️ 🅿️ 🅿️',
        date: date,
      },
      notification: {
        title: 'Bidvest Backend',
        body: `Bidvest Backend App is running good, Boss! : ${date}
        )} 🅿️ 🅿️ 🅿️`,
      },
    };

    try {
      const response = await admin.messaging().send(message);
      Logger.debug(
        `${mm} 🅿️ 🅿️ 🅿️  Successfully sent FCM message: \n🚺 🚺 🚺 ${JSON.stringify(
          message,
        )} \n🚺 🚺 🚺 FCM response: ${response}`,
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
