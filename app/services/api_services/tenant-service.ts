import * as Types from "../api/api.types";
import { getGeneralApiProblem } from '../api/api-problem';
import { Api } from '../api';
import { ApiResponse } from 'apisauce';
import { CreateTenantModel, TenantModel, AllTenantsModel, MainTenantModel } from "../../models/data/tenant-model";
import { PlayerTeamsModel } from "../../models/data/user-model";

export default class TenantApiService {
    apiClient: Api;
    constructor() {
        this.apiClient = new Api();
        this.apiClient.setup();
    }
    
    createTenant = async (tenantObj: CreateTenantModel): Promise<Types.CreateTenantResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/services/app/Tenant/Create`, tenantObj);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", tenantResponse: null, failureResponse: problem }
            }
            let resultTenant = response.data.result as MainTenantModel;
            return { kind: "ok", tenantResponse: resultTenant, failureResponse: null }
        } catch {
            return { kind: "bad-data", tenantResponse: null, failureResponse: null }
        }
    };

    updateTenant = async (tenantObj: TenantModel): Promise<Types.UpdateTenantResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.put(`/services/app/Tenant/Update`, tenantObj);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", tenantResponse: null, failureResponse: problem }
            }
            let resultTenant = response.data.result as MainTenantModel;
            return { kind: "ok", tenantResponse: resultTenant, failureResponse: null }
        } catch {
            return { kind: "bad-data", tenantResponse: null, failureResponse: null }
        }
    };

    deleteTenant = async (tenantId: number): Promise<Types.DeleteUserResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.delete(`/services/app/Tenant/Delete?Id=${tenantId}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", failureResponse: problem }
            }
            return { kind: "ok", failureResponse: null }
        } catch {
            return { kind: "bad-data", failureResponse: null }
        }
    };

    getTenant = async (tenantId: number): Promise<Types.GetTenantResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/Tenant/Get?Id=${tenantId}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", tenantResponse: null, failureResponse: problem }
            }
            let tenant = response.data.result as MainTenantModel;
            return { kind: "ok", tenantResponse: tenant, failureResponse: null }
        } catch {
            return { kind: "bad-data", tenantResponse: null, failureResponse: null }
        }
    }

    getAllTenants = async (keyword: string, isActive: boolean, skipCount: number, maxResultCount: number): Promise<Types.GetAllTenantsResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/Tenant/GetAll?Keyword=${keyword}&IsActive=${isActive}&SkipCount=${skipCount}&MaxResultCount=${maxResultCount}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", tenantResponse: null, failureResponse: problem }
            }
            let tenants = response.data.result as AllTenantsModel;
            return { kind: "ok", tenantResponse: tenants, failureResponse: null }
        } catch {
            return { kind: "bad-data", tenantResponse: null, failureResponse: null }
        }
    };

    getTeamsByPlayerId = async (userId: number): Promise<Types.GetTeamsByPlayerIdResponse> => {
        let user: PlayerTeamsModel[]
        try {
          const response: ApiResponse<any> = await this.apiClient.apisauce.get(
            `/services/app/User/getTeamsByPlayerId?playerId=${userId}`,
          )
          if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return { kind: "failure", userResponse: null, failureResponse: problem }
          }
          user = response.data.result as PlayerTeamsModel[]
          return { kind: "ok", userResponse: user, failureResponse: null }
        } catch {
          return { kind: "bad-data", userResponse: null, failureResponse: null }
        }
      }
}