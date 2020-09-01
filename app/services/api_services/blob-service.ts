import { Api } from '../api';
import * as Types from "../api/api.types";
import { getGeneralApiProblem } from '../api/api-problem';
import { UploadFileResponseModel, DownloadFileResponseModel } from '../../models/data/blob-model';
import { ApiResponse } from 'apisauce';
import { Platform } from 'react-native';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';

export default class BlobApiService {
    apiClient: Api;
    constructor() {
        this.apiClient = new Api();
        this.apiClient.setupForBlob();
    }

    uploadFile = async (fileResult: ImageInfo): Promise<Types.UploadFileResponse> => {
        try {
            var name = fileResult.uri.split('/').pop();
            let formData = new FormData();
            formData.append('file', {
                uri: Platform.OS === "android" ? fileResult.uri : fileResult.uri.replace("file://", ""),
                fileName: name,
                type: 'image/jpg', 
            });
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/services/app/Blob/UploadFile`, formData,{headers:{"Content-Type": "multipart/form-data"}});
            let blobResult = response.data.result as UploadFileResponseModel
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", blobResponse:null, failureResponse: problem }
            }
            return { kind: "ok", blobResponse: blobResult,failureResponse:null }
        } catch {
            return { kind: "bad-data",blobResponse: null,failureResponse:null  }
        }
    }

    downloadFile = async (fileName: string): Promise<Types.DownloadFileResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/services/app/Blob/DownloadFile?fileUrl=${fileName}`);
            let blobResult = response.data.result as DownloadFileResponseModel
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", blobResponse:null, failureResponse: problem }
            }
            return { kind: "ok", blobResponse: blobResult,failureResponse:null }
        } catch {
            return { kind: "bad-data",blobResponse: null,failureResponse:null  }
        }
    }

    getFileUrlWithToken = async (fileUrl: string): Promise<Types.GetFileUrlWithTokenResponse> => {
        try {
            const response: ApiResponse<any> = await this.apiClient.apisauce.get(`/services/app/Blob/GetFileUrlWithToken?fileUrl=${fileUrl}`);
            let blobResult = response.data.result as DownloadFileResponseModel
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", blobResponse:null, failureResponse: problem }
            }
            return { kind: "ok", blobResponse: blobResult,failureResponse:null }
        } catch {
            return { kind: "bad-data",blobResponse: null,failureResponse:null  }
        }
    }

    uploadProfileImage = async (fileResult: ImageInfo): Promise<Types.UploadProfileImageResponse> => {
        try {
            var name = fileResult.uri.split('/').pop();
            
            let formData = new FormData();
            formData.append('file', {
                uri: Platform.OS === "android" ? fileResult.uri : fileResult.uri.replace("file://", ""),
                name: name,
                type: 'image/jpg', 
            });
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/services/app/Blob//UploadProfileImage`, formData,{headers:{"Content-Type": "multipart/form-data"}});
            let blobResult = response.data.result as UploadFileResponseModel
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", blobResponse:null, failureResponse: problem }
            }
            return { kind: "ok", blobResponse: blobResult,failureResponse:null }
        } catch {
            return { kind: "bad-data",blobResponse: null,failureResponse:null  }
        }
    }

    uploadTeamLogo = async (fileResult: ImageInfo): Promise<Types.UploadTeamLogoResponse> => {
        try {
            var name = fileResult.uri.split('/').pop();
            
            let formData = new FormData();
            formData.append('file', {
                uri: Platform.OS === "android" ? fileResult.uri : fileResult.uri.replace("file://", ""),
                name: name,
                type: 'image/jpg', 
            });
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/services/app/Blob/UploadTeamLogo`, formData,{headers:{"Content-Type": "multipart/form-data"}});
            let blobResult = response.data.result as UploadFileResponseModel
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", blobResponse:null, failureResponse: problem }
            }
            return { kind: "ok", blobResponse: blobResult,failureResponse:null }
        } catch {
            return { kind: "bad-data",blobResponse: null,failureResponse:null  }
        }
    }

    uploadPitchVideo = async (fileResult: ImageInfo): Promise<Types.UploadPitchVideoResponse> => {
        try {
            var name = fileResult.uri.split('/').pop();
            
            let formData = new FormData();
            formData.append('file', {
                uri: Platform.OS === "android" ? fileResult.uri : fileResult.uri.replace("file://", ""),
                name: name,
                type: 'image/jpg', 
            });
            const response: ApiResponse<any> = await this.apiClient.apisauce.post(`/services/app/Blob/UploadPitchVideo`, formData,{headers:{"Content-Type": "multipart/form-data"}});
            let blobResult = response.data.result as UploadFileResponseModel
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return { kind: "failure", blobResponse:null, failureResponse: problem }
            }
            return { kind: "ok", blobResponse: blobResult,failureResponse:null }
        } catch {
            return { kind: "bad-data",blobResponse: null,failureResponse:null  }
        }
    }
}