import * as Types from "../api/api.types";
import { getGeneralApiProblem } from '../api/api-problem';
import { Api } from '../api';
import { ApiResponse } from 'apisauce';
import { TenantAvailableModel, TenantAvailableResponseModel, RegisterRequestModel, RegisterResponseModel } from "../../models/data/account-model";

export default class RegisterApiService {
    apiClient: Api;
    constructor() {
        this.apiClient = new Api();
        this.apiClient.setupWithoutAuthorization();
    }

    validateCode = async (code: string): Promise<Types.ValidateCodeResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/services/app/Account/ValidateCode?code=${code}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", accountResponse: null, failureResponse: problem }
            }
            let isValid = response.data.result as string;
            console.log(response)
            return { kind: "ok", accountResponse: isValid, failureResponse: null }
        } catch {
            return { kind: "bad-data", accountResponse: null, failureResponse: null }
        }
    };

    isTenantAvailable = async (tenantObj: TenantAvailableModel): Promise<Types.IsTenantAvailableResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/services/app/Account/IsTenantAvailable`, tenantObj);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", accountResponse: null, failureResponse: problem }
            }
            let tenant = response.data.result as TenantAvailableResponseModel;
            return { kind: "ok", accountResponse: tenant, failureResponse: null }
        } catch {
            return { kind: "bad-data", accountResponse: null, failureResponse: null }
        }
    };

    register = async (registerObj: RegisterRequestModel): Promise<Types.RegisterResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/services/app/Account/Register`, registerObj);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", accountResponse: null, failureResponse: problem }
            }
            let tenant = response.data.result as RegisterResponseModel;
            return { kind: "ok", accountResponse: tenant, failureResponse: null }
        } catch {
            return { kind: "bad-data", accountResponse: null, failureResponse: null }
        }
    };

    forgotPassword = async (email: string): Promise<any> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/services/app/Account/forgotPassword?email=${email}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", accountResponse: null, failureResponse: problem }
            }
            return { kind: "ok", accountResponse: true, failureResponse: null }
        } catch {
            return { kind: "bad-data", accountResponse: null, failureResponse: null }
        }
    };

    confirmEmailAddress = async (email: string, name: string, userid: number): Promise<any> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/services/app/Account/confirmEmailAddress?email=${email}&name=${name}&userid=${userid}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", accountResponse: null, failureResponse: problem }
            }
            return { kind: "ok", accountResponse: true, failureResponse: null }
        } catch {
            return { kind: "bad-data", accountResponse: null, failureResponse: null }
        }
    };
}