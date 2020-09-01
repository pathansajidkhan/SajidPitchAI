import * as Types from "../api/api.types";
import { getGeneralApiProblem } from '../api/api-problem';
import { Api } from '../api';
import { ApiResponse } from 'apisauce';
import { ChangeUiThemeModel } from "../../models/data/configuration-model";

export default class ConfigurationApiService {
    apiClient: Api;
    constructor() {
        this.apiClient = new Api();
        this.apiClient.setup();
    }

    changeUITheme = async (themeObj: ChangeUiThemeModel): Promise<Types.ChangeUIThemeResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/services/app/Configuration/ChangeUiTheme`, themeObj);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", failureResponse: problem }
            }
            return { kind: "ok", failureResponse: null }
        } catch {
            return { kind: "bad-data", failureResponse: null }
        }
    };
}