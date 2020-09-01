import { Component } from "react";
import * as Types from "../../services/api/api.types";
import NetworkValidator from "../network-validator";
import SessionApiService from "../../services/api_services/session-service";
import * as AsyncStorage from '../../utils/storage/storage'

export default class SessionService extends Component {
    sessionApiService: SessionApiService;
    constructor(props?) {
        super(props);
        this.sessionApiService = new SessionApiService();
    }

    getCurrentLoginInformation = async (): Promise<Types.CurrentLoginInfoResponse> => {
        let response: Types.CurrentLoginInfoResponse;
        try {
            if (await this.checkNetworkStatus()) {
                await this.sessionApiService.getCurrentLoginInformation().then(res => {
                    if (res.failureResponse != null) {
                        response = res;
                    } else {
                        response = res
                        AsyncStorage.saveString('UserDetails', JSON.stringify(res.sessionResponse));
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", sessionResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", sessionResponse: null, failureResponse: null }
        }
    }

    checkNetworkStatus = async (): Promise<boolean> => {
        let isNetworkConnected: boolean;
        const networkValidator = new NetworkValidator();
        isNetworkConnected = await networkValidator.CheckConnectivity();
        return isNetworkConnected;
    }
}