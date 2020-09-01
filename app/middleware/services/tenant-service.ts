import { Component } from "react"
import * as Types from "../../services/api/api.types"
import NetworkValidator from "../network-validator"
import { CreateTenantModel, TenantModel, MainTenantModel } from "../../models/data/tenant-model"
import TenantApiService from "../../services/api_services/tenant-service"
import TenantDBService from "../database_services/tenant-db-service"
import BlobService from "./blob-service"
import * as FileSystem from "expo-file-system"
import AssetUtils from "expo-asset-utils"
import { PlayerTeamsModel } from "../../models/data/user-model"
import { Alert } from "react-native"

export default class TenantService extends Component {
    tenantApiService: TenantApiService
    tenantDBService: TenantDBService
    constructor(props?) {
        super(props)
        this.tenantApiService = new TenantApiService()
        this.tenantDBService = new TenantDBService()
    }

    createTenant = async (tenantObj: CreateTenantModel): Promise<Types.CreateTenantResponse> => {
        let response: Types.CreateTenantResponse
        try {
            if (await this.checkNetworkStatus()) {
                await this.tenantApiService.createTenant(tenantObj).then(res => {
                    if (res.failureResponse != null) {
                        response = res
                    } else {
                        if (res.tenantResponse != null) {
                            response = res
                        } else {
                            response = res
                        }
                    }
                })
            } else {
                return { kind: "NETWORK_ISSUE", tenantResponse: null, failureResponse: null }
            }
            return response
        } catch {
            return { kind: "bad-data", tenantResponse: null, failureResponse: null }
        }
    }

    updateTenant = async (tenantObj: TenantModel): Promise<Types.UpdateTenantResponse> => {
        let response: Types.UpdateTenantResponse
        try {
            if (await this.checkNetworkStatus()) {
                await this.tenantApiService.updateTenant(tenantObj).then(async res => {
                    if (res.failureResponse != null) {
                        response = res
                    } else {
                        if (res.tenantResponse != null) {
                            response = res
                            await this.tenantDBService.checkIfTenantExistsThenAddOrUpdate(res.tenantResponse.id, res.tenantResponse, true).then(() => { console.log("Team Added/Updated"); });
                            response = await this.validateAndDownload(tenantObj.id, res.tenantResponse).then(tenantDetailResponse => { console.log("Team Logo Validated/Downloaded"); return tenantDetailResponse; });
                        } else {
                            response = res
                        }
                    }
                })
            } else {
                return { kind: "NETWORK_ISSUE", tenantResponse: null, failureResponse: null }
            }
            return response
        } catch {
            return { kind: "bad-data", tenantResponse: null, failureResponse: null }
        }
    }

    deleteTenant = async (tenantId: number): Promise<Types.DeleteUserResponse> => {
        let response: Types.DeleteUserResponse
        try {
            if (await this.checkNetworkStatus()) {
                await this.tenantApiService.deleteTenant(tenantId).then(res => {
                    if (res.failureResponse != null) {
                        response = res
                    } else {
                        response = res
                    }
                })
            } else {
                return { kind: "NETWORK_ISSUE", failureResponse: null }
            }
            return response
        } catch {
            return { kind: "bad-data", failureResponse: null }
        }
    }

    getTenant = async (tenantId: number): Promise<Types.GetTenantResponse> => {
        let response: Types.GetTenantResponse;
        try {
            if (await this.checkNetworkStatus()) {
                await this.tenantApiService.getTenant(tenantId).then(async result => {
                    if (result.failureResponse != null) {
                        response = result;
                    } else {
                        if (result.tenantResponse != null) {
                            response = result;
                            await this.tenantDBService.checkIfTenantExistsThenAddOrUpdate(tenantId, result.tenantResponse, true).then(() => { console.log("Tenant Added/Updated"); });
                            response = await this.validateAndDownload(tenantId, result.tenantResponse).then(tenantDetailResponse => { console.log("Team Logo Validated/Downloaded"); return tenantDetailResponse; });
                        } else {
                            response = result;
                        }
                    }
                });
            } else {
                return { kind: "Ok", tenantResponse: await this.tenantDBService.getTenantById(tenantId), failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", tenantResponse: null, failureResponse: null }
        }
    }

    getAllTenants = async (keyword: string, isActive: boolean, skipCount: number, maxResultCount: number): Promise<Types.GetAllTenantsResponse> => {
        let response: Types.GetAllTenantsResponse
        try {
            if (await this.checkNetworkStatus()) {
                await this.tenantApiService
                    .getAllTenants(keyword, isActive, skipCount, maxResultCount)
                    .then(res => {
                        if (res.failureResponse != null) {
                            response = res
                        } else {
                            if (res.tenantResponse != null) {
                                response = res
                            } else {
                                response = res
                            }
                        }
                    })
            } else {
                return { kind: "NETWORK_ISSUE", tenantResponse: null, failureResponse: null }
            }
            return response
        } catch {
            return { kind: "bad-data", tenantResponse: null, failureResponse: null }
        }
    }

    checkNetworkStatus = async (): Promise<boolean> => {
        let isNetworkConnected: boolean
        const networkValidator = new NetworkValidator()
        isNetworkConnected = await networkValidator.CheckConnectivity()
        return isNetworkConnected
    }

    validateAndDownload = async (tenantId: number, tenantResponse: MainTenantModel): Promise<Types.GetTenantResponse> => {
        let response: Types.GetTenantResponse;
        response = await this.tenantDBService.getTenantById(tenantId).then(async tenantDetail => {
            if (!!tenantResponse.teamLogoUrl && tenantResponse.teamLogoUrl != tenantDetail.teamLogoUrl) {
                response = await this.downloadBlobFileImage(tenantDetail).then(tenantResp => { return { kind: "ok", tenantResponse: tenantResp, failureResponse: null }; });
            } else if (!!tenantDetail.teamLogoLocal) {
                response = await FileSystem.getInfoAsync(tenantDetail.teamLogoLocal).then(async localImage => {
                    if (!localImage.exists) {
                        response = await this.downloadBlobFileImage(tenantDetail).then(tenantResp => { return { kind: "ok", tenantResponse: tenantResp, failureResponse: null }; });
                    } else {
                        response = { kind: "ok", tenantResponse: tenantDetail, failureResponse: null };
                    }
                    return response;
                });
            } else {
                response = await this.downloadBlobFileImage(tenantDetail).then(tenantResp => { return { kind: "ok", tenantResponse: tenantResp, failureResponse: null }; });
            }
            return response;
        });
        return response;
    }

    downloadBlobFileImage = async (tenantDetail: MainTenantModel): Promise<MainTenantModel> => {
        const blobService = new BlobService();
        let tenantResponse = new MainTenantModel();
        if (!!tenantDetail.teamLogoUrl) {
            tenantResponse = await blobService.getFileUrlWithToken(tenantDetail.teamLogoUrl).then(async tenantPhotoUrlWithToken => {
                if (!!tenantPhotoUrlWithToken.blobResponse && !!tenantPhotoUrlWithToken.blobResponse.fileUri) {
                    await blobService.download(tenantPhotoUrlWithToken.blobResponse.fileUri).then(() => { console.log("Team Logo Downloaded") });
                    tenantDetail = await AssetUtils.fromUriAsync(tenantPhotoUrlWithToken.blobResponse.fileUri).then(async asset => {
                        tenantDetail.teamLogoLocal = FileSystem.documentDirectory + asset.name;
                        await this.tenantDBService.checkIfTenantExistsThenAddOrUpdate(tenantDetail.id, tenantDetail, true).then(() => { console.log("Team Logo Url Updated"); });
                        return tenantDetail;
                    });
                }
                return tenantDetail;
            });
        } else {
            tenantResponse = tenantDetail;
        }
        return tenantResponse;
    }

    getTeamsByPlayerId = async (userId: number): Promise<Types.GetTeamsByPlayerIdResponse> => {
        let response: Types.GetTeamsByPlayerIdResponse
        try {
            if (await this.checkNetworkStatus()) {
                await this.tenantApiService.getTeamsByPlayerId(userId).then(async result => {
                    if (result.failureResponse != null) {
                        response = result
                    } else {
                        if (result.userResponse != null) {
                            response = result;
                            //foreach of response add/update tenants
                            await response.userResponse.forEach(async element => {
                                await this.tenantDBService.checkIfTenantExistsThenAddOrUpdate(element.team.id, element.team, true).then(() => { console.log("Team Added/Updated"); });
                                await this.tenantDBService.checkIfPlayerTeamsExistsThenAddOrUpdate(userId, element, true).then(() => { console.log("Player teams Added/Updated"); });
                                await this.validateAndDownload(element.team.id, element.team).then(() => { console.log("Player teams Logo Validated/Downloaded");  });
                            });
                        } else {
                            response = result;
                        }
                    }
                });
            } else {
                return { kind: "Ok", userResponse: await this.tenantDBService.getTeamsByPlayerId(userId), failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", userResponse: null, failureResponse: null }
        }
    }
}
