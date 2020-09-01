import { GeneralApiProblem } from "./api-problem"
import { UserModel, AllUsersModel, AllUserRolesModel, PlayerStatusModel, PlayerTeamsModel } from "../../models/data/user-model"
import { RoleModel, AllPermissionsModel, EditRoleModel, AllRolesModel, GetAllRolesModel } from "../../models/data/role-model"
import { AllTenantsModel, MainTenantModel } from "../../models/data/tenant-model"
import { GetPitchesModel, GetPitchDetailModel, GetPitchesSummaryModel } from "../../models/data/pitch-model"
import { TenantAvailableResponseModel, RegisterResponseModel } from "../../models/data/account-model"
import { CurrentLoginInfoModel } from "../../models/data/session-model"
import { AuthenticateResponseModel, ExternalAuthenticationProvidersResponseModel, ExternalAuthenticateResponseModel } from "../../models/data/token-auth-model"
import { UploadFileResponseModel, DownloadFileResponseModel } from "../../models/data/blob-model"
import { CommonValueModel } from "../../models/data/common-model"

export interface User {
  id: number
  name: string
}

// User API Response Types
export type CreateUserResponse = { kind: string, userResponse: UserModel, failureResponse: GeneralApiProblem }
export type UpdateUserResponse = { kind: string, userResponse: UserModel, failureResponse: GeneralApiProblem }
export type DeleteUserResponse = { kind: string, failureResponse: GeneralApiProblem }
export type GetPlayersByCoachIdResponse = { kind: string, userResponse: UserModel[], failureResponse: GeneralApiProblem }
export type GetPlayer = { kind: string, userResponse: UserModel, failureResponse: GeneralApiProblem }
export type RolesResponse = { kind: string, rolesResponse: AllUserRolesModel, failureResponse: GeneralApiProblem }
export type ChangeLanguageResponse = { kind: string, failureResponse: GeneralApiProblem }
export type GetUserResponse = { kind: string, userResponse: UserModel, failureResponse: GeneralApiProblem }
export type GetAllUsersResponse = { kind: string, userResponse: AllUsersModel, failureResponse: GeneralApiProblem }
export type ChangePasswordResponse = { kind: string, failureResponse: GeneralApiProblem }
export type ResetPasswordResponse = { kind: string, failureResponse: GeneralApiProblem }
export type GetUsersByTenantIdResponse = { kind: string, userResponse: AllUsersModel, failureResponse: GeneralApiProblem }
export type AddPlayerResponse = { kind: string, userResponse: UserModel, failureResponse: GeneralApiProblem}
export type JoinTeamResponse = { kind: string, userResponse: boolean, failureResponse: GeneralApiProblem}
export type GetPlayerStatusResponse  = { kind: string, userResponse: PlayerStatusModel, failureResponse: GeneralApiProblem}
export type AddPlayersResponse = { kind: string, userResponse: UserModel[], failureResponse: GeneralApiProblem }
export type UpdatePasswordModelResponse = { kind: string, failureResponse: GeneralApiProblem }
export type GetTeamsByPlayerIdResponse = { kind: string, userResponse: PlayerTeamsModel[], failureResponse: GeneralApiProblem }

// Tenant API Response Types
export type CreateTenantResponse = { kind: string, tenantResponse: MainTenantModel, failureResponse: GeneralApiProblem }
export type UpdateTenantResponse = { kind: string, tenantResponse: MainTenantModel, failureResponse: GeneralApiProblem }
export type DeleteTenantResponse = { kind: string, failureResponse: GeneralApiProblem }
export type GetTenantResponse = { kind: string, tenantResponse: MainTenantModel, failureResponse: GeneralApiProblem }
export type GetAllTenantsResponse = { kind: string, tenantResponse: AllTenantsModel, failureResponse: GeneralApiProblem }

// Role API Response Types
export type CreateRoleResponse = { kind: string, roleResponse: RoleModel, failureResponse: GeneralApiProblem }
export type UpdateRoleResponse = { kind: string, roleResponse: RoleModel, failureResponse: GeneralApiProblem }
export type DeleteRoleResponse = { kind: string } | GeneralApiProblem
export type RolePermissionsResponse = { kind: string, roleResponse: AllPermissionsModel, failureResponse: GeneralApiProblem }
export type EditRoleResponse = { kind: string, roleResponse: EditRoleModel, failureResponse: GeneralApiProblem }
export type GetRoleByPermissionResponse = { kind: string, roleResponse: GetAllRolesModel, failureResponse: GeneralApiProblem }
export type GetRoleResponse = { kind: string, roleResponse: RoleModel, failureResponse: GeneralApiProblem }
export type GetAllRolesResponse = { kind: string, roleResponse: AllRolesModel, failureResponse: GeneralApiProblem }

// Pitch API Response Types
export type CreatePitchResponse = { kind: string, id: number, failureResponse: GeneralApiProblem }
export type UpdatePitchResponse = { kind: string, failureResponse: GeneralApiProblem }
export type DeletePitchResponse = { kind: string, failureResponse: GeneralApiProblem }
export type GetPitchByIdResponse = { kind: string, pitchResponse: GetPitchesModel, failureResponse: GeneralApiProblem }
export type GetPitchListByPlayerIdResponse = { kind: string, pitchResponse: GetPitchesSummaryModel, failureResponse: GeneralApiProblem }
export type GetRecentPitchesByPlayerIdResponse = { kind: string, pitchResponse: GetPitchesSummaryModel, failureResponse: GeneralApiProblem }
export type GetPitchUrlDetailsByIdResponse = { kind: string, pitchResponse: GetPitchDetailModel, failureResponse: GeneralApiProblem }
export type GetRecentPitchesResponse = { kind: string, pitchResponse: GetPitchesSummaryModel, failureResponse: GeneralApiProblem }

// Account API Response Types
export type IsTenantAvailableResponse = { kind: string, accountResponse: TenantAvailableResponseModel, failureResponse: GeneralApiProblem }
export type RegisterResponse = { kind: string, accountResponse: RegisterResponseModel, failureResponse: GeneralApiProblem }
export type ValidateCodeResponse = { kind: string, accountResponse: string, failureResponse: GeneralApiProblem }

// Configuration API Response Types
export type ChangeUIThemeResponse = { kind: string, failureResponse: GeneralApiProblem }

// Session API Response Types
export type CurrentLoginInfoResponse = { kind: string, sessionResponse: CurrentLoginInfoModel, failureResponse: GeneralApiProblem }

// TokenAuth API Response Types
export type AuthenticateResponse = { kind: string, tokenAuthResponse: AuthenticateResponseModel, failureResponse: GeneralApiProblem }
export type ExternalAuthenticationProvidersResponse = { kind: string, tokenAuthResponse: ExternalAuthenticationProvidersResponseModel, failureResponse: GeneralApiProblem }
export type ExternalAuthenticateResponse = { kind: string, tokenAuthResponse: ExternalAuthenticateResponseModel, failureResponse: GeneralApiProblem }

// Blob API Response Types
export type UploadFileResponse = { kind: string, blobResponse: UploadFileResponseModel, failureResponse: GeneralApiProblem }
export type DownloadFileResponse = { kind: string, blobResponse: DownloadFileResponseModel, failureResponse: GeneralApiProblem }
export type GetFileUrlWithTokenResponse = { kind: string, blobResponse: DownloadFileResponseModel, failureResponse: GeneralApiProblem }
export type UploadProfileImageResponse = { kind: string, blobResponse: DownloadFileResponseModel, failureResponse: GeneralApiProblem }
export type UploadTeamLogoResponse = { kind: string, blobResponse: DownloadFileResponseModel, failureResponse: GeneralApiProblem }
export type UploadPitchVideoResponse = { kind: string, blobResponse: DownloadFileResponseModel, failureResponse: GeneralApiProblem }

// Register New Device Response Types
export type RegisterNewDeviceResponse = { kind: string, failureResponse: GeneralApiProblem }

export type GetUsersResult = { kind: "ok"; users: User[], failureResponse: GeneralApiProblem }
export type GetUserResult = { kind: "ok"; user: User, failureResponse: GeneralApiProblem }

// Common API Response Types
export type GetCommonValueByTypeCodeResponse = { kind: string, CommonValueByTypeCodeResponse: CommonValueModel[], failureResponse: GeneralApiProblem }