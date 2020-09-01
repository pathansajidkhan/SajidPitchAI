import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import * as AsyncStorage from '../../utils/storage/storage'
/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

    /**
   * Bearer Token.
   */
  token: String
  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
   constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer token",
      },
    })

    this.apisauce.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.loadString("token") || '';
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // config.headers['Content-Type'] = 'application/json';
        return config;
      },
      (error) => {
        Promise.reject(error);
      },
    );
  
    this.apisauce.addMonitor(this.tokenMonitor);
    
  }
  setupForBlob() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer token",
        "content-type": "multipart/form-data",
        "mime-type": "multipart/form-data"
      },
    })

    this.apisauce.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.loadString("token") || '';
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          config.headers['content-type'] = "multipart/form-data"
        }
        // config.headers['Content-Type'] = 'application/json';
        return config;
      },
      (error) => {
        Promise.reject(error);
      },
    );
  
    this.apisauce.addMonitor(this.tokenMonitor);
    
  }
  setupWithoutAuthorization(){
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    });
    this.apisauce.addMonitor(this.tokenMonitor);
  }
  
  private async tokenMonitor(response: any) {
    const { ok, status } = response;
  
    if (!ok && status !== 200) {
      // I should do redirect here
      await AsyncStorage.remove('token');
    }
  }
  /**
   * Gets a list of users.
   */
  async getUsers(): Promise<Types.GetUsersResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const convertUser = raw => {
      return {
        id: raw.id,
        name: raw.name,
      }
    }

    // transform the data into the format we are expecting
    try {
      const rawUsers = response.data
      const resultUsers: Types.User[] = rawUsers.map(convertUser)
      return { kind: "ok", users: resultUsers }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a single user by ID
   */

  async getUser(id: string): Promise<Types.GetUserResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users/${id}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultUser: Types.User = {
        id: response.data.id,
        name: response.data.name,
      }
      return { kind: "ok", user: resultUser }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
