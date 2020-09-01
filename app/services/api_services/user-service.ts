import * as Types from "../api/api.types"
import { getGeneralApiProblem } from "../api/api-problem"
import { Api } from "../api"
import { ApiResponse } from "apisauce"
import {
  UserModel,
  CreateUserModel,
  ChangeLanguageModel,
  ChangePasswordModel,
  ResetPasswordModel,
  AllUsersModel,
  AllUserRolesModel,
  PlayerSetupModel,
  PlayerStatusModel,
  AddPlayerModel,
  UpdatePasswordModel,
  PlayerTeamsModel,
  AddPlayerToTeamDto,
} from "../../models/data/user-model"

export default class UserApiService {
  apiClient: Api
  constructor() {
    this.apiClient = new Api()
    this.apiClient.setup()
  }

  createUser = async (userObj: CreateUserModel): Promise<Types.CreateUserResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.post(
        `/services/app/User/Create`,
        userObj,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", userResponse: null, failureResponse: problem }
      }
      let resultUser = response.data.result as UserModel
      return { kind: "ok", userResponse: resultUser, failureResponse: null }
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  updateUser = async (userObj: UserModel): Promise<Types.UpdateUserResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.put(
        `/services/app/User/Update`,
        userObj,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", userResponse: null, failureResponse: problem }
      }
      let resultUser = response.data.result as UserModel
      return { kind: "ok", userResponse: resultUser, failureResponse: null }
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  deleteUser = async (userId: number): Promise<Types.DeleteUserResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.delete(
        `/services/app/User/Delete?Id=${userId}`,
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

  getPlayersByCoachId = async (coachId: number): Promise<Types.GetPlayersByCoachIdResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.get(
        `/services/app/User/GetPlayersByCoachId?coachId=${coachId}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", userResponse: null, failureResponse: problem }
      }
      let resultUser = response.data.result as UserModel[]
      return { kind: "ok", userResponse: resultUser, failureResponse: null }
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  getPlayerById = async (playerId: number): Promise<Types.GetPlayer> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.get(
        `/services/app/User/GetPlayer?playerId=${playerId}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", userResponse: null, failureResponse: problem }
      }
      let resultUser = response.data.result as UserModel
      return { kind: "ok", userResponse: resultUser, failureResponse: null }
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  getUserRoles = async (): Promise<Types.RolesResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.get(
        `/services/app/User/GetRoles`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", rolesResponse: null, failureResponse: problem }
      }
      let roles = response.data.result as AllUserRolesModel
      return { kind: "ok", rolesResponse: roles, failureResponse: null }
    } catch {
      return { kind: "bad-data", rolesResponse: null, failureResponse: null }
    }
  }

  changeLanguage = async (
    languageObj: ChangeLanguageModel,
  ): Promise<Types.ChangeLanguageResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.post(
        `/services/app/User/ChangeLanguage`,
        languageObj,
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

  getUser = async (userId: number): Promise<Types.GetUserResponse> => {
    let user: UserModel
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.get(
        `/services/app/User/Get?Id=${userId}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", userResponse: null, failureResponse: problem }
      }
      user = response.data.result as UserModel
      return { kind: "ok", userResponse: user, failureResponse: null }
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  getAllUsers = async (
    keyword: string,
    isActive: boolean,
    skipCount: number,
    maxResultCount: number,
  ): Promise<Types.GetAllUsersResponse> => {
    let users: AllUsersModel
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.get(
        `/services/app/User/GetAll?Keyword=${keyword}&IsActive=${isActive}&SkipCount=${skipCount}&MaxResultCount=${maxResultCount}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", userResponse: null, failureResponse: problem }
      }
      users = response.data.result as AllUsersModel
      return { kind: "ok", userResponse: users, failureResponse: null }
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  changePassword = async (
    passwordObj: ChangePasswordModel,
  ): Promise<Types.ChangePasswordResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.post(
        `/services/app/User/ChangePassword`,
        passwordObj,
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

  resetPassword = async (passwordObj: ResetPasswordModel): Promise<Types.ResetPasswordResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.post(
        `/services/app/User/ResetPassword`,
        passwordObj,
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

  addPlayer = async (playerObj: AddPlayerModel[]): Promise<Types.AddPlayerResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.post(
        `/services/app/User/AddPlayer`,
        playerObj,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", userResponse: null, failureResponse: problem }
      }
      let resultUser = response.data.result as UserModel
      return { kind: "ok", userResponse: resultUser, failureResponse: null }
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  joinTeam = async (emailAddress: string): Promise<Types.JoinTeamResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.post(
        `/services/app/User/JoinTeam?emailAddress=${emailAddress}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", userResponse: null, failureResponse: problem }
      }
      let resultUser = response.data.result as boolean
      return { kind: "ok", userResponse: resultUser, failureResponse: null }
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  getPlayerStatus = async (emailAddress: string): Promise<Types.GetPlayerStatusResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.post(
        `/services/app/User/GetPlayerStatus?emailAddress=${emailAddress}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", userResponse: null, failureResponse: problem }
      }
      let resultUser = response.data.result as PlayerStatusModel
      return { kind: "ok", userResponse: resultUser, failureResponse: null }
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  getUsersByTenantId = async (tenantId: number): Promise<Types.GetAllUsersResponse> => {
    let users: AllUsersModel
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.get(
        `/services/app/User/GetUsersByTenantId?tenantId=${tenantId}`,
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", userResponse: null, failureResponse: problem }
      }
      users = response.data.result as AllUsersModel
      return { kind: "ok", userResponse: users, failureResponse: null }
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  updatePassword = async (
    passwordObj: UpdatePasswordModel,
  ): Promise<Types.UpdatePasswordModelResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.put(
        `/services/app/User/UpdatePassword`,
        passwordObj,
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

  

  addPlayerToTeam = async (playerObj: AddPlayerToTeamDto): Promise<Types.AddPlayerResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.post(
        `/services/app/User/AddPlayerToTeam`,
        playerObj,
      )
      console.log(JSON.stringify(response));
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return { kind: "failure", userResponse: null, failureResponse: problem }
      }
      let resultUser = response.data.result as UserModel
      return { kind: "ok", userResponse: resultUser, failureResponse: null }
    } catch {
      console.log("Catch");
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  unLinkPlayerFromTeam = async (teamId: number, playerId: number): Promise<Types.DeleteUserResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.post(
        `/services/app/User/unLinkPlayerFromTeam?teamId=${teamId}&playerId=${playerId}`,
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

  cancelRequestToJoinTeam = async (teamId: number, playerId: number): Promise<Types.DeleteUserResponse> => {
    try {
      const response: ApiResponse<any> = await this.apiClient.apisauce.post(
        `/services/app/User/cancelRequestToJoinTeam?teamId=${teamId}&playerId=${playerId}`,
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
