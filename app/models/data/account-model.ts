export class RegisterRequestModel {
    name: string;
    surname: string;
    userName: string;
    emailAddress: string;
    password: string;
    accessCode: string;
}

export class RegisterResponseModel {
    canLogin: boolean;
}

export class TenantAvailableModel {
    tenancyName: string;
}

export class TenantAvailableResponseModel {
    state: number;
    tenantId: number;
}

export class ValidateCodeRequestModel {
    code: string;
}