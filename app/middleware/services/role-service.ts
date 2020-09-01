import { Component } from "react";
import * as Types from "../../services/api/api.types";
import NetworkValidator from "../network-validator";
import { CreateRoleModel, RoleModel } from "../../models/data/role-model";
import RoleApiService from "../../services/api_services/role-service";

export default class RoleService extends Component {
    roleApiService: RoleApiService;
    constructor(props) {
        super(props);
        this.roleApiService = new RoleApiService();
    }

    createRole = async (roleObj: CreateRoleModel): Promise<Types.CreateRoleResponse> => {
        let response: Types.CreateRoleResponse;
        try {
            if (await this.checkNetworkStatus()) {
                await this.roleApiService.createRole(roleObj).then(res => {
                    if (res.failureResponse != null) {
                        console.log(res.failureResponse);
                        response = res;
                    } else {
                        if (res.roleResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", roleResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", roleResponse: null, failureResponse: null }
        }
    };

    updateRole = async (roleObj: RoleModel): Promise<Types.UpdateRoleResponse> => {
        let response: Types.UpdateRoleResponse;
        try {
            if (await this.checkNetworkStatus()) {
                await this.roleApiService.updateRole(roleObj).then(res => {
                    if (res.failureResponse != null) {
                        console.log(res.failureResponse);
                        response = res;
                    } else {
                        if (res.roleResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", roleResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", roleResponse: null, failureResponse: null }
        }
    };

    deleteRole = async (roleId: number): Promise<Types.DeleteUserResponse> => {
        let response: Types.DeleteUserResponse;
        try {
            if (await this.checkNetworkStatus) {
                await this.roleApiService.deleteRole(roleId).then(res => {
                    if (res.failureResponse != null) {
                        console.log(res.failureResponse);
                        response = res;
                    } else {
                        response = res;
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", failureResponse: null }
        }
    };

    getRolesByPermission = async (permission: string): Promise<Types.GetRoleByPermissionResponse> => {
        let response: Types.GetRoleByPermissionResponse;
        try {
            if (await this.checkNetworkStatus()) {
                await this.roleApiService.getRolesByPermission(permission).then(res => {
                    if (res.failureResponse != null) {
                        console.log(res.failureResponse);
                        response = res;
                    } else {
                        if (res.roleResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", roleResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", roleResponse: null, failureResponse: null }
        }
    };

    getAllPermissions = async (): Promise<Types.RolePermissionsResponse> => {
        let response: Types.RolePermissionsResponse;
        try {
            if (await this.checkNetworkStatus()) {
                await this.roleApiService.getAllPermissions().then(res => {
                    if (res.failureResponse != null) {
                        console.log(res.failureResponse);
                        response = res;
                    } else {
                        if (res.roleResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", roleResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", roleResponse: null, failureResponse: null }
        }
    }

    getRoleForEdit = async (roleId: number): Promise<Types.EditRoleResponse> => {
        let response: Types.EditRoleResponse;
        try {
            if (await this.checkNetworkStatus()) {
                await this.roleApiService.getRoleForEdit(roleId).then(res => {
                    if (res.failureResponse != null) {
                        console.log(res.failureResponse);
                        response = res;
                    } else {
                        if (res.roleResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", roleResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", roleResponse: null, failureResponse: null }
        }
    }

    getRole = async (roleId: number): Promise<Types.GetRoleResponse> => {
        let response: Types.GetRoleResponse;
        try {
            if (await this.checkNetworkStatus()) {
                await this.roleApiService.getRole(roleId).then(res => {
                    if (res.failureResponse != null) {
                        console.log(res.failureResponse);
                        response = res;
                    } else {
                        if (res.roleResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", roleResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", roleResponse: null, failureResponse: null }
        }
    }

    getAllRoles = async (keyword: string, skipCount: number, maxResultCount: number): Promise<Types.GetAllRolesResponse> => {
        let response: Types.GetAllRolesResponse;
        try {
            if (await this.checkNetworkStatus()) {
                await this.roleApiService.getAllRoles(keyword, skipCount, maxResultCount).then(res => {
                    if (res.failureResponse != null) {
                        console.log(res.failureResponse);
                        response = res;
                    } else {
                        if (res.roleResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", roleResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", roleResponse: null, failureResponse: null }
        }
    }

    checkNetworkStatus = async (): Promise<boolean> => {
        let isNetworkConnected: boolean;
        const networkValidator = new NetworkValidator();
        isNetworkConnected = await networkValidator.CheckConnectivity();
        return isNetworkConnected;
    }
}