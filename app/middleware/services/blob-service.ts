import { Component } from "react";
import * as Types from "../../services/api/api.types";
import NetworkValidator from "../network-validator";
import * as AsyncStorage from '../../utils/storage/storage'
import BlobApiService from "../../services/api_services/blob-service";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { CurrentLoginInfoModel } from "../../models/data/session-model";
import UserDBService from "../database_services/user-db-service";
import TenantDBService from "../database_services/tenant-db-service";
import PitchDBService from "../database_services/pitch-db-services";
import * as FileSystem from 'expo-file-system';
import AssetUtils from 'expo-asset-utils';

interface DownloadState {
    downloadProgress: number
}

export default class BlobService extends Component {
    blobApiService: BlobApiService;
    userDBService: UserDBService;
    tenantDBService: TenantDBService;
    pitchDBService: PitchDBService;
    downloadState: DownloadState;

    constructor(props?) {
        super(props);
        this.blobApiService = new BlobApiService();
        this.userDBService = new UserDBService();
        this.tenantDBService = new TenantDBService();
        this.pitchDBService = new PitchDBService();
    }

    uploadUserProfileImage = async (fileResult: ImageInfo): Promise<Types.UploadFileResponse> => {
        let response: Types.UploadFileResponse;
        try {
            if (await this.checkNetworkStatus()) {
                let res = await this.blobApiService.uploadProfileImage(fileResult);
                if (res.failureResponse != null) {
                    response = res;
                } else {
                    response = res;
                    let userSessionDetails = await AsyncStorage.loadString("UserDetails");
                    let userSessionObj = JSON.parse(userSessionDetails) as CurrentLoginInfoModel;
                    let userDetails = await this.userDBService.getUserById(userSessionObj.user.id);
                    userDetails.userPhotoUrl = response.blobResponse.fileUri;
                    userDetails.userPhotoLocal = fileResult.uri;
                    await this.userDBService.checkIfUserExistsThenAddOrUpdate(userSessionObj.user.id, userDetails, true);
                }
            } else {
                return { kind: "NETWORK_ISSUE", blobResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", blobResponse: null, failureResponse: null }
        }
    }

    uploadTeamLogo = async (fileResult: ImageInfo): Promise<Types.UploadFileResponse> => {
        let response: Types.UploadFileResponse;
        try {
            if (await this.checkNetworkStatus()) {
                let res = await this.blobApiService.uploadTeamLogo(fileResult);
                if (res.failureResponse != null) {
                    response = res;
                } else {
                    response = res
                    let userSessionDetails = await AsyncStorage.loadString("UserDetails");
                    let userSessionObj = JSON.parse(userSessionDetails) as CurrentLoginInfoModel;
                    let tenantDetails = await this.tenantDBService.getTenantById(userSessionObj.tenant.id);
                    tenantDetails.teamLogoUrl = response.blobResponse.fileUri;
                    tenantDetails.teamLogoLocal = fileResult.uri;
                    await this.tenantDBService.checkIfTenantExistsThenAddOrUpdate(tenantDetails.id, tenantDetails, true);
                }
            } else {
                return { kind: "NETWORK_ISSUE", blobResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", blobResponse: null, failureResponse: null }
        }
    }

    uploadVideo = async (fileResult: ImageInfo, pitchID: number): Promise<Types.UploadFileResponse> => {
        let response: Types.UploadFileResponse;
        try {
            if (await this.checkNetworkStatus()) {
                let res = await this.blobApiService.uploadPitchVideo(fileResult);
                if (res.failureResponse != null) {
                    response = res;
                } else {
                    response = res
                    let pitchDetails = await this.pitchDBService.getPitchById(pitchID);
                    pitchDetails.videoUrl = response.blobResponse.fileUri;
                    pitchDetails.videoUrlLocal = fileResult.uri;
                    await this.pitchDBService.checkIfPitchExistsThenAddOrUpdate(pitchID, pitchDetails, true);
                }
            } else {
                return { kind: "NETWORK_ISSUE", blobResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", blobResponse: null, failureResponse: null }
        }
    }

    getFileUrlWithToken = async (fileUrl: string): Promise<Types.GetFileUrlWithTokenResponse> => {
        let response: Types.GetFileUrlWithTokenResponse;
        try {
            if (await this.checkNetworkStatus()) {
                await this.blobApiService.getFileUrlWithToken(fileUrl).then(res => {
                    if (res.failureResponse != null) {
                        response = res;
                    } else {
                        if (res.blobResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", blobResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", blobResponse: null, failureResponse: null }
        }
    }

    download = async (fileUrlWithToken: string): Promise<Types.DownloadFileResponse> => {
        try {
            if (await this.checkNetworkStatus()) {
                await AssetUtils.fromUriAsync(fileUrlWithToken).then(asset => {
                    const downloadResumable = FileSystem.createDownloadResumable(fileUrlWithToken, FileSystem.documentDirectory + asset.name, {}, this.callback);
                    downloadResumable.downloadAsync().then(uri => { console.log('Finished downloading to ', uri); });
                });
            } else {
                return { kind: "NETWORK_ISSUE", blobResponse: null, failureResponse: null }
            }
            return { kind: "ok", blobResponse: null, failureResponse: null };
        } catch {
            return { kind: "bad-data", blobResponse: null, failureResponse: null }
        }
    }

    callback = downloadProgress => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        this.downloadState = { downloadProgress: progress };
    };

    checkNetworkStatus = async (): Promise<boolean> => {
        let isNetworkConnected: boolean;
        const networkValidator = new NetworkValidator();
        isNetworkConnected = await networkValidator.CheckConnectivity();
        return isNetworkConnected;
    }
}