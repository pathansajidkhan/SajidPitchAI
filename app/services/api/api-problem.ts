import { ApiResponse } from "apisauce"

export type GeneralApiProblem =
  /**
   * Times up.
   */
  | { kind: "timeout"; temporary: true; message: "" }
  /**
   * Cannot connect to the server for some reason.
   */
  | { kind: "cannot-connect"; temporary: true; message: "" }
  /**
   * The server experienced a problem. Any 5xx error.
   */
  | { kind: "server"; message: "" }
  /**
   * We're not allowed because we haven't identified ourself. This is 401.
   */
  | { kind: "unauthorized"; message: "" }
  /**
   * We don't have access to perform that request. This is 403.
   */
  | { kind: "forbidden"; message: "" }
  /**
   * Unable to find that resource.  This is a 404.
   */
  | { kind: "not-found"; message: "" }
  /**
   * All other 4xx series errors.
   */
  | { kind: "rejected"; message: "" }
  /**
   * Something truly unexpected happened. Most likely can try again. This is a catch all.
   */
  | { kind: "unknown"; temporary: true; message: "" }
  /**
   * The data we received is not in the expected format.
   */
  | { kind: "bad-data"; message: "" }

/**
 * Attempts to get a common cause of problems from an api response.
 *
 * @param response The api response.
 */
export function getGeneralApiProblem(response: ApiResponse<any>): GeneralApiProblem | void {
  switch (response.problem) {
    case "CONNECTION_ERROR":
      return { kind: "cannot-connect", temporary: true, message: "" }
    case "NETWORK_ERROR":
      return { kind: "cannot-connect", temporary: true, message: "" }
    case "TIMEOUT_ERROR":
      return { kind: "timeout", temporary: true, message: "" }
    case "SERVER_ERROR":
      return { kind: "server", message: processResponseMessage(response) }
    case "UNKNOWN_ERROR":
      return { kind: "unknown", temporary: true, message: "" }
    case "CLIENT_ERROR":
      switch (response.status) {
        case 401:
          return { kind: "unauthorized", message: "" }
        case 403:
          return { kind: "forbidden", message: processResponseMessage(response) }
        case 404:
          return { kind: "not-found", message: "" }
        default:
          return { kind: "rejected", message: processResponseMessage(response) }
      }
    case "CANCEL_ERROR":
      return null
  }

  return null
}

function processResponseMessage(response: ApiResponse<any>): any {
  let responseMessage = ""
  if (response.data.error.details != null) {
    responseMessage = response.data.error.details;
  }

  if (responseMessage == "" && response.data.error.message != null) {
    responseMessage = response.data.error.message;
  }

  return responseMessage;
}
