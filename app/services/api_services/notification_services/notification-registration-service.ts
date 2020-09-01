import * as Types from "../../api/api.types";
import { getGeneralApiProblem } from '../../api/api-problem';
import { Api } from '../../api';
import { ApiResponse } from 'apisauce';

export default class NotificationService {
    apiClient: Api;
    constructor() {
        this.apiClient = new Api();
        this.apiClient.setup();
    }

    registerDevice = async (request: any): Promise<Types.RegisterNewDeviceResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.put(`/services/app/RegisterDevice/RegisterNewDevice`, request);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "ok", failureResponse: problem }
            }
            return { kind: "ok", failureResponse: null }
        } catch {
            return { kind: "bad-data", failureResponse: null }
        }
    };
}