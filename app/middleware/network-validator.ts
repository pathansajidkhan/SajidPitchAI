import { Component } from "react";
import NetInfo, { NetInfoStateType } from "@react-native-community/netinfo";

export default class NetworkValidator extends Component {
    isNetworkConnected: boolean;
    isNetworkOnWifi: boolean;
    constructor(props?) {
        super(props);
        this.CheckConnectivity().then(res => { this.isNetworkConnected = res });
    }

    CheckConnectivity = async (): Promise<boolean> => {
        return await NetInfo.fetch().then(netInfoDetails => {
            if (netInfoDetails.isConnected) {
                this.isNetworkConnected = true;
            } else {
                this.isNetworkConnected = false;
            }
            return this.isNetworkConnected;
        });
    };

    CheckIfNetworkIsOnWiFi = async (): Promise<boolean> => {
        return await NetInfo.fetch().then(netInfoDetails => {
            if (netInfoDetails.type == NetInfoStateType.wifi) {
                this.isNetworkOnWifi = true;
            } else {
                this.isNetworkOnWifi = false;
            }
            return this.isNetworkOnWifi;
        });
    }
}