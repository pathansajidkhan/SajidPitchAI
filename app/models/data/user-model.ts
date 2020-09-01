import { MainTenantModel } from "./tenant-model"

export class UserModel {
  id: number
  userName: string
  name: string
  surname: string
  emailAddress: string
  isActive: boolean
  fullName: string
  roleNames: string[]
  age: number
  weight: number
  height: number
  isRightHanded: boolean
  isAccountSetup: boolean
  userPhotoUrl: string
  userPhotoLocal: string = "" // Local DB Storage
  downloadOverWiFiOnly: boolean 
  birthDate: string
  userLinkStatusId: number
  userLinkStatusCode: string
}

export class CreateUserModel {
  username: string
  name: string
  surname: string
  emailAddress: string
  isActive: boolean
  roleNames: string[]
  password: string
}

export class AllUsersModel {
  totalCount: number
  items: UserModel[]
}

export class ResetPasswordModel {
  adminPassword: string
  userId: number
  newPassword: string
}

export class UpdatePasswordModel {
  userId: number
  newPassword: string
}

export class ChangePasswordModel {
  currentPassword: string
  newPassword: string
}

export class ChangeLanguageModel {
  languageName: string
}

export class UserRoleModel {
  id: number
  name: string
  displayName: string
  normalizedName: string
  description: string
  grantedPermissions: string[]
}

export class AllUserRolesModel {
  items: UserRoleModel[]
}

export class PlayerSetupModel {
  fullName: string
  emailAddress: string
  name: string
  surname: string
}

export class PlayerStatusModel {
  isAssociable: boolean
  status: string
}

export class AddPlayerModel {
  fullname: string
  emailAddress: string
}

export class PlayerTeamsModel {
  // teamName: string
  // teamId: number
  // linkStatus: string
  // teamLogoUrl: string
  // teamCoach: string
  // teamCoachEmail: string
  // playerId: number
  team: MainTenantModel
  linkStatus: string
  teamCoachEmail: string
  teamCoachId: string
  playerId: number
}

export class AddPlayerToTeamModel {
  playerId: number
  coachId: number
  coachTenantId: number
  playerEmailAddress: string
  fullName: string
  coachEmailAddress: string
}
