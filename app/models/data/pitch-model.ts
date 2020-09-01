import { UserModel } from "./user-model"

export class PitchModel {
  id: number
  playerUserId: number
  playerUser: UserModel
  pitchDate: Date
  originalCoordinates: string
  kinematics: string
  comparisonCoordinates2d: string
  comparisonCoordinates3d: string
  filmSourceId: number
  filmSource: FilmSourceModel
  pitchTypeId: number
  pitchType: PitchTypeModel
  throwTypeId: number
  throwType: ThrowTypeModel
  coachId: number
  coach: CoachModel
  videoUrl: string
  videoSkeletonUrl: string
}

export class PitchByPlayerIdModel {
  pitches: PitchModel[]
  totalCount: number
  pageNumber: number
}

export class CommonValueTypeModel {
  tenantId: number
  tenant: TenantModel
  code: string
  description: string
  isActive: boolean
}

export class TenantModel {
  tenancyName: string
  name: string
  isActive: boolean
  id: number
}

export class CoachModel {
  userName: string
  name: string
  surname: string
  emailAddress: string
  isActive: boolean
  fullName: string
  lastLoginTime: Date
  creationTime: Date
  roleNames: string[]
  id: number
}

export class PitchTypeModel {
  tenantId: number
  tenant: TenantModel
  code: string
  description: string
  parentId: number
  commonValueType: CommonValueTypeModel
  commonValueTypeId: number
}

export class ThrowTypeModel {
  tenantId: number
  tenant: TenantModel
  code: string
  description: string
  parentId: number
  commonValueType: CommonValueTypeModel
  commonValueTypeId: number
}

export class FilmSourceModel {
  tenantId: number
  tenant: TenantModel
  code: string
  description: string
  parentId: number
  commonValueType: CommonValueTypeModel
  commonValueTypeId: number
}

export class CreatePitchModel {
  uploadFile: any
  playerUserId?: number
  playerUser: {
    id?: number
    height?: number
    isRightHanded: boolean
    emailAddress?: string
  }
  pitchDate?: string
  filmSource: string
}

export class GetPitchesModel {
  id: number
  playerUserId: number
  playerFullName: string
  playerEmailAddress: string
  pitchDate: Date
  filmSourceId: number
  filmSourceCode: string
  coachId: number
  coachFullName: string
  coachEmailAddress: string
  videoUrl: string
  videoBlobSASUrl: string
  videoUrlLocal: string
  videoSkeletonUrl: string
  videoSkeletonBlobSASUrl: string
  videoSkeletonUrlLocal: string
  videoReportUrl: string
  statusId: number
  statusCode: string
  originalCoordinates: string
  kinematics: string
  comparisonCoordinates2d: string
  comparisonCoordinates3d: string
  encodedPitchId:string
}

export class PitchMarkerModel{
  FP: number
  MER: number
  BR: number
  PK: number
}
export class UpdatePitchModel {
  id: number
  playerUserId: number
}

export class GetPitchDetailModel {
  videoUrl: string
  videoSkeletonUrl: string
  videoReportUrl: string
}

export class GetPitchesSummaryModel {
  pitches: GetPitchesModel[]
  totalPitches: number
  totalPlayers: number
  totalUntaggedPlayers: number
}

export class frame {
  time: number
  frame: number
  joints: number[]
  video_frame: number
}

export class comparisonCoordinates2d {
  hand: string
  team: string
  frames: frame[]
  height: number
  length: number
  player: string
  pitchId: string
  filename: string
  filepath: string
  joint_list: string[]
}

export class kinematicFrame {
  time: number
  frame: number
  angle: number[]
  video_frame: number
  velocity: number[]
}

export class kinematic {
  pitchId: string
  filename: string
  filepath: string
  player: string
  team: string
  hand: string
  height: number
  angle_list: string[]
  length: number
  frames: kinematicFrame[]
  markers: PitchMarkerModel
}
