export class CurrentLoginInfoModel {
  application: {
    version: string
    releaseDate: Date
    features: FeaturesModel
  }
  user: UserSessionModel
  tenant: TenantSessionModel
}

export class FeaturesModel {
  additionalProp1: boolean
  additionalProp2: boolean
  additionalProp3: boolean
}

export class UserSessionModel {
  name: string
  surname: string
  userName: string
  emailAddress: string
  id: number
  isAccountSetup: boolean
  roleNames: string[]
  photourl: string
  isExternalAuth: boolean
  isRightHanded: boolean
}

export class TenantSessionModel {
  tenancyName: string
  name: string
  id: number
}
