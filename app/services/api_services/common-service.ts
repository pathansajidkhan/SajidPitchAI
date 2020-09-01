import * as Types from "../api/api.types";
import { getGeneralApiProblem } from '../api/api-problem';
import { Api } from '../api';
import { ApiResponse } from 'apisauce';
import { CommonValueModel, CommonValueByTypeCodeModel } from "../../models/data/common-model";

export default class CommonApiService {
    apiClient: Api;
    constructor() {
        this.apiClient = new Api();
        this.apiClient.setup();
    }

    

    getCommonValueByTypeCode = async (CommonObj: string): Promise<Types.GetCommonValueByTypeCodeResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/CommonValue/GetCommonValuesByTypeCode?code=${CommonObj}`, CommonObj);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", CommonValueByTypeCodeResponse: null, failureResponse: problem }
            }
            console.log(response)
            let resultCommon = response.data.result as CommonValueModel[];
            return { kind: "ok", CommonValueByTypeCodeResponse: resultCommon, failureResponse: null }
        } catch {
            return { kind: "bad-data", CommonValueByTypeCodeResponse: null, failureResponse: null }
        }
    };

    deleteCommon = async (CommonId: number): Promise<Types.DeleteUserResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.delete(`/services/app/Common/Delete?Id=${CommonId}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", failureResponse: problem }
            }
            return { kind: "ok", failureResponse: null }
        } catch {
            return { kind: "bad-data", failureResponse: null }
        }
    };

    getCommonsByPermission = async (permission: string): Promise<Types.GetCommonByPermissionResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/Common/GetCommons?Permission=${permission}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", CommonResponse: null, failureResponse: problem }
            }
            let Commons = response.data.result as GetAllCommonsModel;
            return { kind: "ok", CommonResponse: Commons, failureResponse: null }
        } catch {
            return { kind: "bad-data", CommonResponse: null, failureResponse: null }
        }
    };

    getAllPermissions = async (): Promise<Types.CommonPermissionsResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/Common/GetAllPermissions`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", CommonResponse: null, failureResponse: problem }
            }
            let Commons = response.data.result as AllPermissionsModel;
            return { kind: "ok", CommonResponse: Commons, failureResponse: null };
        } catch {
            return { kind: "bad-data", CommonResponse: null, failureResponse: null };
        }
    }

    getCommonForEdit = async (CommonId: number): Promise<Types.EditCommonResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/Common/GetCommonForEdit?Id=${CommonId}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", CommonResponse: null, failureResponse: problem }
            }
            let Common = response.data.result as EditCommonModel;
            return { kind: "ok", CommonResponse: Common, failureResponse: null };
        } catch {
            return { kind: "bad-data", CommonResponse: null, failureResponse: null }
        }
    }

    getCommon = async (CommonId: number): Promise<Types.GetCommonResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/Common/Get?Id=${CommonId}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", CommonResponse: null, failureResponse: problem }
            }
            let Common = response.data.result as CommonModel;
            return { kind: "ok", CommonResponse: Common, failureResponse: null }
        } catch {
            return { kind: "bad-data", CommonResponse: null, failureResponse: null }
        }
    }

    getAllCommons = async (keyword: string, skipCount: number, maxResultCount: number): Promise<Types.GetAllCommonsResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/Common/GetAll?Keyword=${keyword}&SkipCount=${skipCount}&MaxResultCount=${maxResultCount}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", CommonResponse: null, failureResponse: problem }
            }
            let Commons = response.data.result as AllCommonsModel;
            return { kind: "ok", CommonResponse: Commons, failureResponse: null }
        } catch {
            return { kind: "bad-data", CommonResponse: null, failureResponse: null }
        }
    };
}