import { Component } from "react"
import * as Types from "../../services/api/api.types"
import NetworkValidator from "../network-validator"
import {
  UserModel,
  CreateUserModel,
  ChangeLanguageModel,
  ChangePasswordModel,
  ResetPasswordModel,
  PlayerSetupModel,
  AddPlayerModel,
  UpdatePasswordModel,
  PlayerTeamsModel,
  AddPlayerToTeamDto,
  AddPlayerToTeamModel,
} from "../../models/data/user-model"
import UserDBService from "../database_services/user-db-service"
import UserApiService from "../../services/api_services/user-service"
import { CurrentLoginInfoModel } from "../../models/data/session-model"
import * as AsyncStorage from "../../utils/storage/storage"
import * as FileSystem from "expo-file-system"
import BlobService from "./blob-service"
import AssetUtils from "expo-asset-utils"
import TenantDBService from "../database_services/tenant-db-service"

export default class UserService extends Component {
  userDBService: UserDBService
  userAPIService: UserApiService
  tenantDBService: TenantDBService
  response: UserModel
  constructor(props?) {
    super(props)
    this.userDBService = new UserDBService(props)
    this.userAPIService = new UserApiService()
  }

  createUser = async (userObj: CreateUserModel): Promise<Types.CreateUserResponse> => {
    let response: Types.CreateUserResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.createUser(userObj).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.userResponse != null) {
              response = res
            } else {
              response = res
            }
          }
        })
      } else {
        return { kind: "NETWORK_ISSUE", userResponse: null, failureResponse: null }
      }
      return response
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  updateUser = async (userObj: UserModel): Promise<Types.UpdateUserResponse> => {
    let response: Types.UpdateUserResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.updateUser(userObj).then(async res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.userResponse != null) {
              response = res
              await this.userDBService.checkIfUserExistsThenAddOrUpdate(res.userResponse.id, res.userResponse, true).then(() => { console.log("User Added/Updated"); });
              response = await this.validateAndDownload(res.userResponse.id, res.userResponse).then(userDetailResponse => { console.log("User Picture Validated/Downloaded"); return userDetailResponse; });
            } else {
              response = res
            }
          }
        })
      } else {
        return { kind: "Ok", userResponse: await this.userDBService.getUserById(userObj.id), failureResponse: null }
      }
      return response
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  deleteUser = async (userId: number): Promise<Types.DeleteUserResponse> => {
    let response: Types.DeleteUserResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.deleteUser(userId).then(res => {
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

  getPlayersByCoachId = async (coachId: number): Promise<Types.GetPlayersByCoachIdResponse> => {
    let response: Types.GetPlayersByCoachIdResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.getPlayersByCoachId(coachId).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.userResponse != null) {
              response = res
              res.userResponse.forEach(userItem => {
                this.userDBService.checkIfUserExistsThenAddOrUpdate(userItem.id, userItem, true)
              })
            } else {
              response = res
            }
          }
        })
      } else {
        return {
          kind: "Ok",
          userResponse: (await this.userDBService.getAllUsers()).items,
          failureResponse: null,
        }
      }
      return response
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  getPlayerById = async (playerId: number): Promise<Types.GetPlayer> => {
    let response: Types.GetPlayer
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.getPlayerById(playerId).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.userResponse != null) {
              response = res
              this.userDBService.checkIfUserExistsThenAddOrUpdate(
                res.userResponse.id,
                res.userResponse,
                true,
              )
            } else {
              response = res
            }
          }
        })
      } else {
        return {
          kind: "Ok",
          userResponse: await this.userDBService.getUserById(playerId),
          failureResponse: null,
        }
      }
      return response
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  getRoles = async (): Promise<Types.RolesResponse> => {
    let response: Types.RolesResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.getUserRoles().then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.rolesResponse != null) {
              response = res
            } else {
              response = res
            }
          }
        })
      } else {
        return { kind: "NETWORK_ISSUE", rolesResponse: null, failureResponse: null }
      }
      return response
    } catch {
      return { kind: "bad-data", rolesResponse: null, failureResponse: null }
    }
  }

  changeLanguage = async (languageObj: ChangeLanguageModel): Promise<Types.ChangeLanguageResponse> => {
    let response: Types.ChangeLanguageResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.changeLanguage(languageObj).then(res => {
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

  getUser = async (userId: number): Promise<Types.GetUserResponse> => {
    let response: Types.GetUserResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.getUser(userId).then(async result => {
          if (result.failureResponse != null) {
            response = result
          } else {
            if (result.userResponse != null) {
              response = result;
              await this.userDBService.checkIfUserExistsThenAddOrUpdate(result.userResponse.id, result.userResponse, true).then(() => { console.log("User Added/Updated"); });
              response = await this.validateAndDownload(userId, result.userResponse).then(userDetailResponse => { console.log("User Picture Validated/Downloaded"); return userDetailResponse; });
            } else {
              response = result
            }
          }
        });
      } else {
        return { kind: "Ok", userResponse: await this.userDBService.getUserById(userId), failureResponse: null }
      }
      return response;
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  validateAndDownload = async (userId: number, userResponse: UserModel): Promise<Types.GetUserResponse> => {
    let response: Types.GetUserResponse;
    response = await this.userDBService.getUserById(userId).then(async userDetail => {
      if (!!userResponse.userPhotoUrl && userResponse.userPhotoUrl != userDetail.userPhotoUrl) {
        response = await this.downloadBlobFileImage(userDetail).then(userResp => { return { kind: "ok", userResponse: userResp, failureResponse: null }; });
      } else if (!!userDetail.userPhotoLocal) {
        response = await FileSystem.getInfoAsync(userDetail.userPhotoLocal).then(async localImage => {
          if (!localImage.exists) {
            response = await this.downloadBlobFileImage(userDetail).then(userResp => { return { kind: "ok", userResponse: userResp, failureResponse: null }; });
          } else {
            response = { kind: "ok", userResponse: userDetail, failureResponse: null };
          }
          return response;
        });
      } else {
        response = await this.downloadBlobFileImage(userDetail).then(userResp => { return { kind: "ok", userResponse: userResp, failureResponse: null }; });
      }
      return response;
    });
    return response;
  }

  getAllUsers = async (keyword: string, isActive: boolean, skipCount: number, maxResultCount: number): Promise<Types.GetAllUsersResponse> => {
    let response: Types.GetAllUsersResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService
          .getAllUsers(keyword, isActive, skipCount, maxResultCount)
          .then(res => {
            if (res.failureResponse != null) {
              response = res
            } else {
              if (res.userResponse != null) {
                response = res
                response.userResponse.items.forEach(userItem => {
                  this.userDBService.checkIfUserExistsThenAddOrUpdate(userItem.id, userItem, true)
                })
              } else {
                response = res
              }
            }
          })
      } else {
        return {
          kind: "Ok",
          userResponse: await this.userDBService.getAllUsers(),
          failureResponse: null,
        }
      }
      return response
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  changePassword = async (passwordObj: ChangePasswordModel): Promise<Types.ChangePasswordResponse> => {
    let response: Types.ChangePasswordResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.changePassword(passwordObj).then(res => {
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

  resetPassword = async (passwordObj: ResetPasswordModel): Promise<Types.ResetPasswordResponse> => {
    let response: Types.ResetPasswordResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.resetPassword(passwordObj).then(res => {
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

  getUsersByTenantId = async (tenantId: number): Promise<Types.GetUsersByTenantIdResponse> => {
    let response: Types.GetUsersByTenantIdResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.getUsersByTenantId(tenantId).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.userResponse != null) {
              response = res
            } else {
              response = res
            }
          }
        })
      } else {
        return { kind: "NETWORK_ISSUE", userResponse: null, failureResponse: null }
      }
      return response
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  addPlayer = async (playerObj: PlayerSetupModel): Promise<Types.AddPlayerResponse> => {
    let response: Types.AddPlayerResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.addPlayer(playerObj).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.userResponse != null) {
              response = res
              this.userDBService.checkIfUserExistsThenAddOrUpdate(
                response.userResponse.id,
                response.userResponse,
                true,
              )
            } else {
              response = res
            }
          }
        })
      } else {
        let userObj = new UserModel()
        userObj.emailAddress = playerObj.emailAddress
        userObj.fullName = playerObj.fullName
        this.userDBService.checkIfUserExistsThenAddOrUpdate(0, userObj, false)
        return { kind: "Ok", userResponse: userObj, failureResponse: null }
      }
      return response
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  joinTeam = async (emailAddress: string): Promise<Types.JoinTeamResponse> => {
    let response: Types.JoinTeamResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.joinTeam(emailAddress).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.userResponse != null) {
              response = res
            } else {
              response = res
            }
          }
        })
      } else {
        return { kind: "NETWORK_ISSUE", userResponse: null, failureResponse: null }
      }
      return response
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  getPlayerStatus = async (emailAddress: string): Promise<Types.GetPlayerStatusResponse> => {
    let response: Types.GetPlayerStatusResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.getPlayerStatus(emailAddress).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.userResponse != null) {
              response = res
            } else {
              response = res
            }
          }
        })
      } else {
        return { kind: "NETWORK_ISSUE", userResponse: null, failureResponse: null }
      }
      return response
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  addPlayers = async (userObj: AddPlayerModel[]): Promise<Types.AddPlayerResponse> => {
    let response: Types.AddPlayerResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.addPlayer(userObj).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.userResponse != null) {
              response = res
            } else {
              response = res
            }
          }
        })
      } else {
        return { kind: "NETWORK_ISSUE", userResponse: null, failureResponse: null }
      }
      return response
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  checkNetworkStatus = async (): Promise<boolean> => {
    let isNetworkConnected: boolean
    const networkValidator = new NetworkValidator()
    isNetworkConnected = await networkValidator.CheckConnectivity()
    return isNetworkConnected
  }

  getUserIdFromStorage = async () => {
    let userId = 0
    const res = await AsyncStorage.loadString("UserDetails")
    if (!!res) {
      const userDetails = JSON.parse(res) as CurrentLoginInfoModel
      userId = userDetails.user.id
    }
    return userId
  }

  updatePassword = async (passwordObj: UpdatePasswordModel): Promise<Types.UpdatePasswordModelResponse> => {
    let response: Types.UpdatePasswordModelResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.updatePassword(passwordObj).then(res => {
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

  downloadBlobFileImage = async (userDetail: UserModel): Promise<UserModel> => {
    const blobService = new BlobService();
    let userResponse = new UserModel();
    if (!!userDetail.userPhotoUrl) {
      userResponse = await blobService.getFileUrlWithToken(userDetail.userPhotoUrl).then(async userPhotoUrlWithToken => {
        if (!!userPhotoUrlWithToken.blobResponse && !!userPhotoUrlWithToken.blobResponse.fileUri) {
          await blobService.download(userPhotoUrlWithToken.blobResponse.fileUri).then(() => { console.log("Picture downloaded") });
          userDetail = await AssetUtils.fromUriAsync(userPhotoUrlWithToken.blobResponse.fileUri).then(async asset => {
            userDetail.userPhotoLocal = FileSystem.documentDirectory + asset.name;
            await this.userDBService.checkIfUserExistsThenAddOrUpdate(userDetail.id, userDetail, true).then(() => { console.log("Picture Url Updated"); });
            return userDetail;
          });
        }
        return userDetail;
      });
    } else {
      userResponse = userDetail;
    }
    return userResponse;
  }

  

  sendRequestToCoach = async (userObj: AddPlayerToTeamModel): Promise<Types.AddPlayerResponse> => {
    let response: Types.AddPlayerResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.addPlayerToTeam(userObj).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.userResponse != null) {
              response = res
            } else {
              response = res
            }
          }
        })
      } else {
        return { kind: "NETWORK_ISSUE", userResponse: null, failureResponse: null }
      }
      return response
    } catch {
      return { kind: "bad-data", userResponse: null, failureResponse: null }
    }
  }

  unLinkPlayerFromTeam = async (teamId: number, playerId: number): Promise<Types.DeleteUserResponse> => {
    let response: Types.DeleteUserResponse
      try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.unLinkPlayerFromTeam(teamId, playerId).then(res => {
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

  cancelRequestToJoinTeam = async (teamId: number, playerId: number): Promise<Types.DeleteUserResponse> => {
    let response: Types.DeleteUserResponse
      try {
      if (await this.checkNetworkStatus()) {
        await this.userAPIService.cancelRequestToJoinTeam(teamId, playerId).then(res => {
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

}
