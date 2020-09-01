
export class TenantModel {
    id: number;
    name: string;
    tenancyName: string;
    isActive: boolean;
    city: string;
    countryId: number;
    teamLogoUrl: string;
    coachFullName: string;
    isAccountSetup: boolean;
}

export class CreateTenantModel {
    name: string;
    tenancyName: string;
    adminEmailAddress: string;
    connectionString: string;
    isActive: boolean;
}

export class AllTenantsModel {
    totalCount: number;
    items: TenantModel[];
}

export class MainTenantModel {
    id: number;
    tenancyName: string;
    name: string;
    isActive: boolean;
    coachFullName: string;
    countryId: number;
    country: CountryModel;
    city: string;
    teamLogoUrl: string;
    teamLogoLocal: string;
    isAccountSetup: boolean;
}

export class CountryModel {
    tenantId: number;
    code: string;
    description: string;
    parentId: number;
    commonValueType: CommonValueTypeModel;
    commonValueTypeId : number;
}

export class CommonValueTypeModel {
    tenantId: number;
    code: string;
    description: string;
    isActive: boolean;
}