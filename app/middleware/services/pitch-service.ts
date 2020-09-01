import { Component } from "react"
import * as Types from "../../services/api/api.types"
import NetworkValidator from "../network-validator"
import { CreatePitchModel, UpdatePitchModel, GetPitchesModel } from "../../models/data/pitch-model"
import PitchApiService from "../../services/api_services/pitch-service"
import PitchDBService from "../database_services/pitch-db-services"
import BlobService from "./blob-service"
import * as FileSystem from 'expo-file-system';
import AssetUtils from 'expo-asset-utils';

export default class PitchService extends Component {
  pitchApiService: PitchApiService
  pitchDBService: PitchDBService
  constructor(props) {
    super(props)
    this.pitchApiService = new PitchApiService()
    this.pitchDBService = new PitchDBService()
  }

  createPitch = async (pitchObj: CreatePitchModel, videoLocalPath: string): Promise<Types.CreatePitchResponse> => {
    let response: Types.CreatePitchResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.pitchApiService.createPitch(pitchObj).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            response = res
            this.getPitchById(response.id).then(pitchDetails => {
              pitchDetails.pitchResponse.videoUrlLocal = videoLocalPath;
              this.pitchDBService.checkIfPitchExistsThenAddOrUpdate(pitchDetails.pitchResponse.id, pitchDetails.pitchResponse, true).then(() => { });
            });
          }
        })
      } else {
        return { kind: "NETWORK_ISSUE", id: 0, failureResponse: null }
      }
      return response
    } catch {
      return { kind: "bad-data", id: 0, failureResponse: null }
    }
  }

  updatePitch = async (pitchObj: UpdatePitchModel): Promise<Types.UpdatePitchResponse> => {
    let response: Types.UpdatePitchResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.pitchApiService.updatePitch(pitchObj).then(res => {
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

  deletePitch = async (pitchId: number): Promise<Types.DeletePitchResponse> => {
    let response: Types.DeletePitchResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.pitchApiService.deletePitch(pitchId).then(res => {
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

  getPitchByIdForComparePitches = async (pitchId: number): Promise<Types.GetPitchByIdResponse> => {
    let response: Types.GetPitchByIdResponse
    try {
      if (await this.checkNetworkStatus()) {
        let result = await this.pitchApiService.getPitchById(pitchId);
        if (result.failureResponse != null) {
          response = result
        } else {
          if (result.pitchResponse != null) {
            response = result
          } else {
            response = result;
          }
        }
      } else {
        return { kind: "NETWORK_ISSUE", pitchResponse: null, failureResponse: null }
      }
      return response;
    } catch {
      return { kind: "bad-data", pitchResponse: null, failureResponse: null }
    }
  }

  getPitchById = async (pitchId: number): Promise<Types.GetPitchByIdResponse> => {
    let response: Types.GetPitchByIdResponse
    try {
      if (await this.checkNetworkStatus()) {
        let result = await this.pitchApiService.getPitchById(pitchId);
        if (result.failureResponse != null) {
          response = result
        } else {
          if (result.pitchResponse != null) {
            response = result
            await this.pitchDBService.checkIfPitchExistsThenAddOrUpdate(response.pitchResponse.id, response.pitchResponse, true);
          } else {
            response = result
          }
        }
      } else {
        return { kind: "NETWORK_ISSUE", pitchResponse: await this.pitchDBService.getPitchById(pitchId), failureResponse: null }
      }
      return response;
    } catch {
      return { kind: "bad-data", pitchResponse: null, failureResponse: null }
    }
  }

  getPitchListByPlayerId = async (playerUserId: number, pageNumber: number, pageSize: number): Promise<Types.GetRecentPitchesResponse> => {
    let response: Types.GetRecentPitchesResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.pitchApiService.getPitchListByPlayerId(playerUserId, pageNumber, pageSize).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            response = res
            if (res.pitchResponse != null) {
              response.pitchResponse.pitches.forEach(pitchDetails => {
                this.pitchDBService.checkIfPitchExistsThenAddOrUpdate(pitchDetails.id, pitchDetails, true).then(() => { });
              });
            }
          }
        })
      } else {
        return { kind: "NETWORK_ISSUE", pitchResponse: null, failureResponse: null }
      }
      return response
    } catch {
      return { kind: "bad-data", pitchResponse: null, failureResponse: null }
    }
  }

  getRecentPitchesByPlayerId = async (playerUserId: number, pageSize: number): Promise<Types.GetRecentPitchesByPlayerIdResponse> => {
    let response: Types.GetRecentPitchesByPlayerIdResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.pitchApiService.getRecentPitchesByPlayerId(playerUserId, pageSize).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.pitchResponse != null) {
              response = res
              response.pitchResponse.pitches.forEach(pitchDetails => {
                this.pitchDBService.checkIfPitchExistsThenAddOrUpdate(pitchDetails.id, pitchDetails, true).then(() => { });
              });
            } else {
              response = res
            }
          }
        })
      } else {
        return { kind: "NETWORK_ISSUE", pitchResponse: null, failureResponse: null }
      }
      return response
    } catch {
      return { kind: "bad-data", pitchResponse: null, failureResponse: null }
    }
  }

  getPitchUrlDetailsById = async (pitchId: number): Promise<Types.GetPitchUrlDetailsByIdResponse> => {
    let response: Types.GetPitchUrlDetailsByIdResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.pitchApiService.getPitchUrlDetailsById(pitchId).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.pitchResponse != null) {
              response = res
            } else {
              response = res
            }
          }
        })
      } else {
        return { kind: "NETWORK_ISSUE", pitchResponse: null, failureResponse: null }
      }
      return response
    } catch {
      return { kind: "bad-data", pitchResponse: null, failureResponse: null }
    }
  }

  checkNetworkStatus = async (): Promise<boolean> => {
    let isNetworkConnected: boolean
    const networkValidator = new NetworkValidator()
    isNetworkConnected = await networkValidator.CheckConnectivity()
    return isNetworkConnected
  }

  getRecentPitchesByUserId = async (pageSize: number): Promise<Types.GetRecentPitchesResponse> => {
    let response: Types.GetRecentPitchesResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.pitchApiService.getRecentPitchesByUserId(pageSize).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.pitchResponse != null) {
              response = res
            } else {
              response = res
            }
          }
        })
      } else {
        return { kind: "NETWORK_ISSUE", pitchResponse: null, failureResponse: null }
      }
      return response
    } catch {
      return { kind: "bad-data", pitchResponse: null, failureResponse: null }
    }
  }

  getRecentPitches = async (pageSize: number): Promise<Types.GetRecentPitchesResponse> => {
    let response: Types.GetRecentPitchesResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.pitchApiService.getRecentPitches(pageSize).then(res => {
          if (res.failureResponse != null) {
            response = res
          } else {
            if (res.pitchResponse != null) {
              response = res
            } else {
              response = res
            }
          }
        })
      } else {
        return { kind: "NETWORK_ISSUE", pitchResponse: null, failureResponse: null }
      }
      if (response.pitchResponse != null) {
        response.pitchResponse.pitches.forEach(async pitchDetails => {
          await this.pitchDBService.checkIfPitchExistsThenAddOrUpdate(pitchDetails.id, pitchDetails, true).then(() => { });
        });
      }
      return response
    } catch {
      return { kind: "bad-data", pitchResponse: null, failureResponse: null }
    }
  }


  addUntaggedPitchPlayer = async (playerId: number, pitchId: number): Promise<Types.DeleteUserResponse> => {
    let response: Types.DeleteUserResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.pitchApiService.addUntaggedPitchPlayer(playerId, pitchId).then(res => {
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

  checkIfVideoExistsAndDownloadVideo = async (item: GetPitchesModel): Promise<GetPitchesModel> => {
    const blobService = new BlobService();
    const pitchDBService = new PitchDBService();
    return await pitchDBService.getPitchById(item.id).then(async pitchDetail => {
      item.videoSkeletonUrlLocal = pitchDetail.videoSkeletonUrlLocal
      item.videoUrlLocal = pitchDetail.videoUrlLocal
      if (!!item.videoSkeletonUrlLocal) {
        console.log("Skeleton Video Already Exist")
        return item
      } else {
        if (!!item.videoSkeletonUrl) {
          return await blobService.getFileUrlWithToken(item.videoSkeletonUrl).then(async videoSkeletonUrlWithToken => {
            if (!!videoSkeletonUrlWithToken.blobResponse && !!videoSkeletonUrlWithToken.blobResponse.fileUri) {
              return await blobService.download(videoSkeletonUrlWithToken.blobResponse.fileUri).then(async downloadVideoObj => {
                return await AssetUtils.fromUriAsync(videoSkeletonUrlWithToken.blobResponse.fileUri).then(async asset => {
                  const videoSkeletonUrlLocal = FileSystem.documentDirectory + asset.name
                  item.videoSkeletonUrlLocal = videoSkeletonUrlLocal
                  await pitchDBService.UpdatePitchVideoSkeletonUrlLocal(videoSkeletonUrlLocal, item.id).then(() => { console.log("Video Skeleton Url Updated") })
                  return item
                })
              })
            } else {
              return item
            }
          })
        } else {
          if (!!item.videoUrlLocal) {
            console.log("Video Already Exist")
            return item
          } else {
            if (!!item.videoUrl) {
              return await blobService.getFileUrlWithToken(item.videoUrl).then(async videoUrlWithToken => {
                if (!!videoUrlWithToken.blobResponse && !!videoUrlWithToken.blobResponse.fileUri) {
                  return await blobService.download(videoUrlWithToken.blobResponse.fileUri).then(async downloadVideoObj => {
                    return await AssetUtils.fromUriAsync(videoUrlWithToken.blobResponse.fileUri).then(async asset => {
                      const videoUrlLocal = FileSystem.documentDirectory + asset.name
                      item.videoUrlLocal = videoUrlLocal
                      await pitchDBService.UpdatePitchVideoUrlLocal(videoUrlLocal, item.id).then(() => { console.log("Video Url Updated") });
                      return item
                    })
                  })
                } else {
                  return item
                }
              })
            } else {
              return item
            }
          }
        }
      }

    });
  }
}
