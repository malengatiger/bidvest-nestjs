/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { MyUtils } from './my-utils';
import { Constants } from './constants';
const mm = '🍑 🍑 🍑 FirebaseManager 🍑 ';


@Injectable()
export class FirebaseManager {
  // 
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
