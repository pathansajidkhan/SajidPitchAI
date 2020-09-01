import { Component } from "react";
import * as Types from "../../services/api/api.types";
import NetworkValidator from "../network-validator";
import CommonApiService from "../../services/api_services/common-service";

export default class CommonService extends Component {
    isNetworkConnected: boolean;
    commonApiService: CommonApiService;
    constructor(props) {
        super(props);
        this.commonApiService = new CommonApiService();
        const networkValidator = new NetworkValidator(props);
        networkValidator.CheckConnectivity().then(isConnected => { this.isNetworkConnected = isConnected; });
     
    }

    getCommonValueByTypeCode = async (CommonObj: string): Promise<Types.GetCommonValueByTypeCodeResponse> => {
        let response: Types.GetCommonValueByTypeCodeResponse;
        try {
            if (this.isNetworkConnected) {
                await this.commonApiService.getCommonValueByTypeCode(CommonObj).then(res => {
                    if (res.failureResponse != null) {
                        console.log(res.failureResponse);
                        response = res;
                    } else {
                        if (res.CommonValueByTypeCodeResponse != null) {
                            response = res;
                        } else {
                            response = res;
                        }
                    }
                });
            } else {
                return { kind: "NETWORK_ISSUE", CommonValueByTypeCodeResponse: null, failureResponse: null }
            }
            return response;
        } catch {
            return { kind: "bad-data", CommonValueByTypeCodeResponse: null, failureResponse: null }
        }
    };

}