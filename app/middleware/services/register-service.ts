import { Component } from "react";
import * as Types from "../../services/api/api.types";
import NetworkValidator from "../network-validator";
import { TenantAvailableModel, RegisterRequestModel } from "../../models/data/account-model";
import RegisterApiService from "../../services/api_services/register-service";

export default class RegisterService extends Component {
    registerApiService: RegisterApiService;
    constructor(props) {
        super(props);
        this.registerApiService = new RegisterApiService();
    }

    validateCode = async (code: string): Promise<Types.ValidateCodeResponse> => {
        let response: Types.ValidateCodeResponse;
        try {
            if(await this.checkNetworkStatus()){
                await this.registerApiService.validateCode(code).then(res => {
                    if(res.failureResponse != null){
                        console.log(res.failureResponse);
                        response = res;
                    } else {
                        if(res.accountResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "Network not available.", accountResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", accountResponse: null, failureResponse: null }
        }
    };

    isTenantAvailable = async (tenantObj: TenantAvailableModel): Promise<Types.IsTenantAvailableResponse> => {
        let response: Types.IsTenantAvailableResponse;
        try {
            if(await this.checkNetworkStatus()){
                await this.registerApiService.isTenantAvailable(tenantObj).then(res => {
                    if(res.failureResponse != null){
                        console.log(res.failureResponse);
                        response = res;
                    } else {
                        if(res.accountResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", accountResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", accountResponse: null, failureResponse: null }
        }
    };

    register = async (registerObj: RegisterRequestModel): Promise<Types.RegisterResponse> => {
        let response: Types.RegisterResponse;
        try {
            if(await this.checkNetworkStatus()){
                await this.registerApiService.register(registerObj).then(res => {
                    if(res.failureResponse != null){
                        console.log(res.failureResponse);
                        response = res;
                    } else {
                        if(res.accountResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", accountResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", accountResponse: null, failureResponse: null }
        }
    };

    forgotPassword = async (email: string): Promise<any> => {
        let response: any;
        try {
            if(await this.checkNetworkStatus()){
                await this.registerApiService.forgotPassword(email).then(res => {
                    if(res.failureResponse != null){
                        console.log(res.failureResponse);
                        response = res;
                    } else {
                        if(res.accountResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "Network not available.", accountResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", accountResponse: null, failureResponse: null }
        }
    };

    checkNetworkStatus = async (): Promise<boolean> => {
        let isNetworkConnected: boolean;
        const networkValidator = new NetworkValidator();
        isNetworkConnected = await networkValidator.CheckConnectivity();
        return isNetworkConnected;
    }

    confirmEmailAddress = async (email: string, name: string, userid: number): Promise<any> => {
        let response: any;
        try {
            if(await this.checkNetworkStatus()){
                await this.registerApiService.confirmEmailAddress(email, name, userid).then(res => {
                    if(res.failureResponse != null){
                        console.log(res.failureResponse);
                        response = res;
                    } else {
                        if(res.accountResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "Network not available.", accountResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", accountResponse: null, failureResponse: null }
        }
    };
}