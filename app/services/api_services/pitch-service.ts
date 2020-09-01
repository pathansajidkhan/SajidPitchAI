import * as Types from "../api/api.types"
import { getGeneralApiProblem } from "../api/api-problem"
import { Api } from "../api"
import { ApiResponse } from "apisauce"
import {
  CreatePitchModel,
  GetPitchesModel,
  UpdatePitchModel,
  GetPitchDetailModel,
  GetPitchesSummaryModel,
} from "../../models/data/pitch-model"
import { Platform } from "react-native"
import moment from "moment"

export default class PitchApiService {
  apiClient: Api
  constructor() {
    this.apiClient = new Api()
    this.apiClient.setupForBlob()
  }

  createPitch = async (pitchObj: CreatePitchModel): Promise<Types.CreatePitchResponse> => {
    try {
      var name = pitchObj.uploadFile.uri.split("/").pop()
      let formData = new FormData()
      pitchObj.uploadFile = {
        uri:
          Platform.OS === "android"
            ? pitchObj.uploadFile.uri
            : pitchObj.uploadFile.uri.replace("file://", ""),
        name: name,
        type: "video/mp4",
      }
      pitchObj.pitchDate = moment().format("YYYY-MM-DD HH:mm:ss")
      pitchObj.filmSource = "Mobile"

      if (pitchObj.playerUserId && pitchObj.playerUserId !== null)
        formData.append("PlayerUserId", pitchObj.playerUserId)
      if (pitchObj.playerUser && pitchObj.playerUser.id && pitchObj.playerUser.id !== null)
        formData.append("PlayerUser.Id", pitchObj.playerUser.id)
      formData.append("PlayerUser.IsRightHanded", pitchObj.playerUser.isRightHanded)
      formData.append("PitchDate", pitchObj.pitchDate)
      formData.append("FilmSource", pitchObj.filmSource)
      formData.append("UploadFile", pitchObj.uploadFile)
      const response: ApiResponse<any> = await this.apiClient.apisauce.post(
        `/services/app/Pitch/CreatePitch`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      )

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", id: 0, failureResponse: problem }
      }
      return { kind: "ok", id: response.data.result as number, failureResponse: null }
    } catch {
      return { kind: "bad-data", id: 0, failureResponse: null }
    }
  }

  updatePitch = async (pitchObj: UpdatePitchModel): Promise<Types.UpdatePitchResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.put(
        `/services/app/Pitch/UpdatePitch`,
        pitchObj,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", failureResponse: problem }
      }
      return { kind: "ok", failureResponse: null }
    } catch {
      return { kind: "bad-data", failureResponse: null }
    }
  }

  deletePitch = async (pitchId: number): Promise<Types.DeletePitchResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.delete(
        `/services/app/Pitch/DeletePitchById?pitchId=${pitchId}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", failureResponse: problem }
      }
      return { kind: "ok", failureResponse: null }
    } catch {
      return { kind: "bad-data", failureResponse: null }
    }
  }

  getPitchById = async (pitchId: number): Promise<Types.GetPitchByIdResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.get(
        `/services/app/Pitch/GetPitchById?pitchId=${pitchId}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", pitchResponse: null, failureResponse: problem }
      }
      let pitch = response.data.result as GetPitchesModel
      return { kind: "ok", pitchResponse: pitch, failureResponse: null }
    } catch {
      return { kind: "bad-data", pitchResponse: null, failureResponse: null }
    }
  }

  getPitchListByPlayerId = async (
    playerUserId: number,
    pageNumber: number,
    pageSize: number,
  ): Promise<Types.GetRecentPitchesResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.get(
        `/services/app/Pitch/GetPitchListByPlayerId?playerId=${playerUserId}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", pitchResponse: null, failureResponse: problem }
      }
      let pitch = response.data.result as GetPitchesSummaryModel
      return { kind: "ok", pitchResponse: pitch, failureResponse: null }
    } catch {
      return { kind: "bad-data", pitchResponse: null, failureResponse: null }
    }
  }

  getRecentPitchesByPlayerId = async (
    playerUserId: number,
    pageSize: number,
  ): Promise<Types.GetRecentPitchesByPlayerIdResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.get(
        `/services/app/Pitch/GetRecentPitchesByPlayerId?playerId=${playerUserId}&pageSize=${pageSize}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", pitchResponse: null, failureResponse: problem }
      }
      let pitch = response.data.result as GetPitchesSummaryModel
      return { kind: "ok", pitchResponse: pitch, failureResponse: null }
    } catch {
      return { kind: "bad-data", pitchResponse: null, failureResponse: null }
    }
  }

  getPitchUrlDetailsById = async (
    pitchId: number,
  ): Promise<Types.GetPitchUrlDetailsByIdResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.get(
        `/services/app/Pitch/GetPitchUrlDetailsById?pitchId=${pitchId}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", pitchResponse: null, failureResponse: problem }
      }
      let pitch = response.data.result as GetPitchDetailModel
      return { kind: "ok", pitchResponse: pitch, failureResponse: null }
    } catch {
      return { kind: "bad-data", pitchResponse: null, failureResponse: null }
    }
  }

  getRecentPitchesByUserId = async (pageSize: number): Promise<Types.GetRecentPitchesResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.get(
        `/services/app/Pitch/getRecentPitchesByUserId?pageSize=${pageSize}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", pitchResponse: null, failureResponse: problem }
      }
      let pitch = response.data.result as GetPitchesSummaryModel
      return { kind: "ok", pitchResponse: pitch, failureResponse: null }
    } catch {
      return { kind: "bad-data", pitchResponse: null, failureResponse: null }
    }
  }

  getRecentPitches = async (pageSize: number): Promise<Types.GetRecentPitchesResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.get(
        `/services/app/Pitch/getRecentPitches?pageSize=${pageSize}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", pitchResponse: null, failureResponse: problem }
      }
      let pitch = response.data.result as GetPitchesSummaryModel
      return { kind: "ok", pitchResponse: pitch, failureResponse: null }
    } catch {
      return { kind: "bad-data", pitchResponse: null, failureResponse: null }
    }
  }

  addUntaggedPitchPlayer = async (
    playerId: number,
    pitchId: number,
  ): Promise<Types.DeleteUserResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.post(
        `/services/app/Pitch/addUntaggedPitchPlayer?playerId=${playerId}&pitchId=${pitchId}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", failureResponse: problem }
      }
      return { kind: "ok", failureResponse: null }
    } catch {
      return { kind: "bad-data", failureResponse: null }
    }
  }
}
