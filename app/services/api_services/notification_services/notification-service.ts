import PushNotification from 'react-native-push-notification';
import { handler } from './notification-handler';

export default class NotificationService {
  constructor(onTokenReceived: any, onNotificationReceived: any) {
    handler.attachTokenReceived(onTokenReceived);
    handler.attachNotificationReceived(onNotificationReceived);
    PushNotification.getApplicationIconBadgeNumber(function (number: number) {
      if (number > 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });
  }

  checkPermissions(cbk: any) {
    return PushNotification.checkPermissions(cbk);
  }

  requestPermissions() {
    return PushNotification.requestPermissions();
  }

  cancelNotifications() {
    PushNotification.cancelLocalNotifications();
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }

  abandonPermissions() {
    PushNotification.abandonPermissions();
  }
}
