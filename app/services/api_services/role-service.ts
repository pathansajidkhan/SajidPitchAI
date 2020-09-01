import * as Types from "../api/api.types";
import { getGeneralApiProblem } from '../api/api-problem';
import { Api } from '../api';
import { ApiResponse } from 'apisauce';
import { CreateRoleModel, RoleModel, GetAllRolesModel, AllPermissionsModel, EditRoleModel, AllRolesModel } from "../../models/data/role-model";

export default class RoleApiService {
    apiClient: Api;
    constructor() {
        this.apiClient = new Api();
        this.apiClient.setup();
    }

    createRole = async (roleObj: CreateRoleModel): Promise<Types.CreateRoleResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/services/app/Role/Create`, roleObj);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", roleResponse: null, failureResponse: problem }
            }
            let resultRole = response.data.result as RoleModel;
            return { kind: "ok", roleResponse: resultRole, failureResponse: null }
        } catch {
            return { kind: "bad-data", roleResponse: null, failureResponse: null }
        }
    };

    updateRole = async (roleObj: RoleModel): Promise<Types.UpdateRoleResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.put(`/services/app/Role/Update`, roleObj);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", roleResponse: null, failureResponse: problem }
            }
            let resultRole = response.data.result as RoleModel;
            return { kind: "ok", roleResponse: resultRole, failureResponse: null }
        } catch {
            return { kind: "bad-data", roleResponse: null, failureResponse: null }
        }
    };

    deleteRole = async (roleId: number): Promise<Types.DeleteUserResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.delete(`/services/app/Role/Delete?Id=${roleId}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", failureResponse: problem }
            }
            return { kind: "ok", failureResponse: null }
        } catch {
            return { kind: "bad-data", failureResponse: null }
        }
    };

    getRolesByPermission = async (permission: string): Promise<Types.GetRoleByPermissionResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/Role/GetRoles?Permission=${permission}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", roleResponse: null, failureResponse: problem }
            }
            let roles = response.data.result as GetAllRolesModel;
            return { kind: "ok", roleResponse: roles, failureResponse: null }
        } catch {
            return { kind: "bad-data", roleResponse: null, failureResponse: null }
        }
    };

    getAllPermissions = async (): Promise<Types.RolePermissionsResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/Role/GetAllPermissions`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", roleResponse: null, failureResponse: problem }
            }
            let roles = response.data.result as AllPermissionsModel;
            return { kind: "ok", roleResponse: roles, failureResponse: null };
        } catch {
            return { kind: "bad-data", roleResponse: null, failureResponse: null };
        }
    }

    getRoleForEdit = async (roleId: number): Promise<Types.EditRoleResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/Role/GetRoleForEdit?Id=${roleId}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", roleResponse: null, failureResponse: problem }
            }
            let role = response.data.result as EditRoleModel;
            return { kind: "ok", roleResponse: role, failureResponse: null };
        } catch {
            return { kind: "bad-data", roleResponse: null, failureResponse: null }
        }
    }

    getRole = async (roleId: number): Promise<Types.GetRoleResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/Role/Get?Id=${roleId}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", roleResponse: null, failureResponse: problem }
            }
            let role = response.data.result as RoleModel;
            return { kind: "ok", roleResponse: role, failureResponse: null }
        } catch {
            return { kind: "bad-data", roleResponse: null, failureResponse: null }
        }
    }

    getAllRoles = async (keyword: string, skipCount: number, maxResultCount: number): Promise<Types.GetAllRolesResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/Role/GetAll?Keyword=${keyword}&SkipCount=${skipCount}&MaxResultCount=${maxResultCount}`);
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", roleResponse: null, failureResponse: problem }
            }
            let roles = response.data.result as AllRolesModel;
            return { kind: "ok", roleResponse: roles, failureResponse: null }
        } catch {
            return { kind: "bad-data", roleResponse: null, failureResponse: null }
        }
    };
}