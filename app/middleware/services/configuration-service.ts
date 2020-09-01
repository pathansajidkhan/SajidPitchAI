import { Component } from "react"
import * as Types from "../../services/api/api.types"
import NetworkValidator from "../network-validator"
import { ChangeUiThemeModel } from "../../models/data/configuration-model"
import ConfigurationApiService from "../../services/api_services/configuration-service"

export default class ConfigurationService extends Component {
  configurationApiService: ConfigurationApiService
  constructor(props) {
    super(props)
    this.configurationApiService = new ConfigurationApiService()
  }

  changeUITheme = async (themeObj: ChangeUiThemeModel): Promise<Types.ChangeUIThemeResponse> => {
    let response: Types.ChangeUIThemeResponse
    try {
      if (await this.checkNetworkStatus()) {
        await this.configurationApiService.changeUITheme(themeObj).then(res => {
          if (res.failureResponse != null) {
            console.log(res.failureResponse)
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

  checkNetworkStatus = async (): Promise<boolean> => {
    let isNetworkConnected: boolean
    const networkValidator = new NetworkValidator()
    isNetworkConnected = await networkValidator.CheckConnectivity()
    return isNetworkConnected
  }
}
