import * as Types from "../api/api.types";
import { getGeneralApiProblem } from '../api/api-problem';
import { Api } from '../api';
import { ApiResponse } from 'apisauce';
import { CurrentLoginInfoModel } from "../../models/data/session-model";

export default class SessionApiService {
    apiClient: Api;
    constructor() {
        this.apiClient = new Api();
        this.apiClient.setup();
    }

    getCurrentLoginInformation = async (): Promise<Types.CurrentLoginInfoResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/Session/GetCurrentLoginInformations`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "ok", sessionResponse: null, failureResponse: problem }
            }
            let currentLoginInfo = response.data.result as CurrentLoginInfoModel;
            return { kind: "ok", sessionResponse: currentLoginInfo, failureResponse: null }
        } catch {
            return { kind: "bad-data", sessionResponse: null, failureResponse: null }
        }
    };
}