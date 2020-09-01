export class AuthenticateRequestModel {
    userNameOrEmailAddress: string;
    password: string;
    rememberClient: boolean;
}

export class AuthenticateResponseModel {
    accessToken: string;
    encryptedAccessToken: string;
    expireInSeconds: number;
    userId: number;
}

export class ExternalAuthenticationProviderModel {
    name: string;
    clientId: string;
}

export class ExternalAuthenticationProvidersResponseModel{
    items: ExternalAuthenticationProviderModel[];
}

export class ExternalAuthenticateRequestModel {
    authProvider: string;
    providerKey: string;
    providerAccessCode: string;
    isLogin: boolean;
    accessCode: string;
}

export class ExternalAuthenticateResponseModel {
    accessToken: string;
    encryptedAccessToken: string;
    expireInSeconds: number;
    waitingForActivation: boolean;
}