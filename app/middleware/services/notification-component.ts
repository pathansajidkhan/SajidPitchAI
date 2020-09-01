import { Component } from 'react';
import { Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import NotificationService from '../../services/api_services/notification_services/notification-service';
import NotificationRegistrationService from '../../services/api_services/notification_services/notification-registration-service';

declare const global: { HermesInternal: null | {} };

interface IState {
    status: string,
    registeredOS: string,
    registeredToken: string,
    isRegistered: boolean,
    isBusy: boolean,
}

class NotificationComponent extends Component<IState>{
    state: IState;
    notificationService: NotificationService;
    notificationRegistrationService: NotificationRegistrationService;
    deviceId: string;

    constructor(props: any) {
        super(props);
        this.deviceId = DeviceInfo.getUniqueId();
        this.state = {
            status: "Push notifications registration status is unknown",
            registeredOS: "",
            registeredToken: "",
            isRegistered: false,
            isBusy: false,
        };

        this.notificationService = new NotificationService(
            this.onTokenReceived.bind(this),
            this.onNotificationReceived.bind(this),
        );
        this.notificationRegistrationService = new NotificationRegistrationService();
        this.registerDevice.bind(this);
    }

    async registerDevice() {
        if (!this.state.registeredToken || !this.state.registeredOS) {
            console.log("No notifications received.");
            return;
        }

        let status: string = "Registering...";
        let isRegistered = this.state.isRegistered;
        try {
            this.setState({ isBusy: true, status });
            const pnPlatform = this.state.registeredOS == "ios" ? "apns" : "fcm";
            const pnToken = this.state.registeredToken;
            const request = {
                installationId: this.deviceId,
                platform: pnPlatform,
                pushChannel: pnToken,
                tags: ["username: cbauer@dstrat.com"]
            };
            const response = await this.notificationRegistrationService.registerDevice(request);
            status = `Registered for ${this.state.registeredOS} push notifications`;
            isRegistered = true;
        } catch (e) {
            status = `Registration failed: ${e}`;
        }
        finally {
            this.setState({ isBusy: false, status, isRegistered });
        }
    }

    onTokenReceived(token: any) {
        console.log(`Received a notification token on ${token.os}`);
        this.setState({ registeredToken: token.token, registeredOS: token.os, status: `The push notifications token has been received.` });

        if (this.state.isRegistered && this.state.registeredToken && this.state.registeredOS) {
            this.registerDevice();
        }
    }

    onNotificationReceived(notification: any) {
        console.log(`Received a push notification on ${this.state.registeredOS}`);
        this.setState({ status: `Received a push notification...` });

        if (notification.data.message) {
            Alert.alert("AwesomeProject", `${notification.data.action} action received`);
        }
    }
}

export default NotificationComponent;