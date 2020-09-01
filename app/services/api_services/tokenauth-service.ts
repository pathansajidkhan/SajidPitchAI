import * as Types from "../api/api.types";
import { getGeneralApiProblem } from '../api/api-problem';
import { Api } from '../api';
import { ApiResponse } from 'apisauce';
import { AuthenticateRequestModel, AuthenticateResponseModel, ExternalAuthenticationProvidersResponseModel, ExternalAuthenticateRequestModel, ExternalAuthenticateResponseModel } from "../../models/data/token-auth-model";

export default class TokenAuthApiService {
    apiClient: Api;
    constructor() {
        this.apiClient = new Api();
        this.apiClient.setupWithoutAuthorization();
    }

    authenticate = async (authObj: AuthenticateRequestModel): Promise<Types.AuthenticateResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/TokenAuth/Authenticate`, authObj);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", tokenAuthResponse: null, failureResponse: problem }
            }
            let result = response.data.result as AuthenticateResponseModel;
            console.log(result.accessToken);
            return { kind: "ok", tokenAuthResponse: result, failureResponse: null }
        } catch {
            return { kind: "bad-data", tokenAuthResponse: null, failureResponse: null }
        }
    };

    getExternalAuthenticationProviders = async (): Promise<Types.ExternalAuthenticationProvidersResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/TokenAuth/GetExternalAuthenticationProviders`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "bad-data", tokenAuthResponse: null, failureResponse: problem }
            }
            let result = response.data.result as ExternalAuthenticationProvidersResponseModel;
            return { kind: "ok", tokenAuthResponse: result, failureResponse: null }
        } catch {
            return { kind: "bad-data", tokenAuthResponse: null, failureResponse: null }
        }
    };

    externalAuthenticate = async (authObj: ExternalAuthenticateRequestModel): Promise<Types.ExternalAuthenticateResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/TokenAuth/ExternalAuthenticate`, authObj);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "bad-data", tokenAuthResponse: null, failureResponse: problem }
            }
            let result = response.data.result as ExternalAuthenticateResponseModel;
            return { kind: "ok", tokenAuthResponse: result, failureResponse: null }
        } catch {
            return { kind: "bad-data", tokenAuthResponse: null, failureResponse: null }
        }
    };
}