import { Component } from "react";
import * as Types from "../../services/api/api.types";
import NetworkValidator from "../network-validator";
import { AuthenticateRequestModel, ExternalAuthenticateRequestModel } from "../../models/data/token-auth-model";
import TokenAuthApiService from "../../services/api_services/tokenauth-service";
import * as AsyncStorage from '../../utils/storage/storage';

export default class TokenAuthService extends Component {
    tenantAPIService: TokenAuthApiService
    constructor(props?) {
        super(props);
        this.tenantAPIService = new TokenAuthApiService();
    }

    authenticate = async (authObj: AuthenticateRequestModel): Promise<Types.AuthenticateResponse> => {
        let response: Types.AuthenticateResponse;
        try {
            if (await this.checkNetworkStatus()) {
                await this.tenantAPIService.authenticate(authObj).then(async res => {
                    if (res.failureResponse != null) {
                        response = res;
                    } else {
                        if (res.tokenAuthResponse != null) {
                            response = res;
                            let expiryTime = new Date();
                            expiryTime.setSeconds(expiryTime.getSeconds() + (response.tokenAuthResponse.expireInSeconds - 900));
                            await AsyncStorage.saveString("token", response.tokenAuthResponse.accessToken).then(() => { });
                            await AsyncStorage.saveString("encryptedToken", response.tokenAuthResponse.encryptedAccessToken).then(() => { });
                            await AsyncStorage.saveString("expireInSeconds", response.tokenAuthResponse.expireInSeconds.toString()).then(() => { });
                            await AsyncStorage.saveString("expiryTimeStamp", expiryTime.getTime().toString()).then(() => { });
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", tokenAuthResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", tokenAuthResponse: null, failureResponse: null }
        }
    };

    getExternalAuthenticationProviders = async (): Promise<Types.ExternalAuthenticationProvidersResponse> => {
        let response: Types.ExternalAuthenticationProvidersResponse;
        try {
            if (await this.checkNetworkStatus()) {
                await this.tenantAPIService.getExternalAuthenticationProviders().then(res => {
                    if (res.failureResponse != null) {
                        response = res;
                    } else {
                        if (res.tokenAuthResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", tokenAuthResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", tokenAuthResponse: null, failureResponse: null }
        }
    };

    externalAuthenticate = async (authObj: ExternalAuthenticateRequestModel): Promise<Types.ExternalAuthenticateResponse> => {
        let response: Types.ExternalAuthenticateResponse;
        try {
            if (await this.checkNetworkStatus()) {
                await this.tenantAPIService.externalAuthenticate(authObj).then(res => {
                    if (res.failureResponse != null) {
                        response = res;
                    } else {
                        if (res.tokenAuthResponse != null) {
                            response = res;
                            let expiryTime = new Date();
                            expiryTime.setSeconds(expiryTime.getSeconds() + (response.tokenAuthResponse.expireInSeconds - 900));
                            AsyncStorage.saveString("token", response.tokenAuthResponse.accessToken);
                            AsyncStorage.saveString("encryptedToken", response.tokenAuthResponse.encryptedAccessToken);
                            AsyncStorage.saveString("expireInSeconds", response.tokenAuthResponse.expireInSeconds.toString());
                            AsyncStorage.saveString("expiryTimeStamp", expiryTime.getTime().toString());
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", tokenAuthResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", tokenAuthResponse: null, failureResponse: null }
        }
    }

    checkNetworkStatus = async (): Promise<boolean> => {
        let isNetworkConnected: boolean;
        const networkValidator = new NetworkValidator();
        isNetworkConnected = await networkValidator.CheckConnectivity();
        return isNetworkConnected;
    }
}