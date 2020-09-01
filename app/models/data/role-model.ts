export class RoleModel {
    id: number;
    name: string;
    displayName: string;
    normalizedName: string;
    description: string;
    grantedPermissions: string[];
}

export class CreateRoleModel {
    name: string;
    displayName: string;
    normalizedName: string;
    description: string;
    grantedPermissions: string[];
}

export class GetRoleModel {
    id: number;
    name: string;
    displayName: string;
    isStatic: boolean;
    isDefault: boolean;
    creationTime: Date;
}

export class GetAllRolesModel {
    items: GetRoleModel[];
}

export class PermissionModel {
    id: number;
    name: string;
    displayName: string;
    description: string;
}

export class EditRolePermissionModel {
    name: string;
    displayName: string;
    description: string;
}

export class AllPermissionsModel {
    items: PermissionModel[];
}

export class EditRoleModel {
    role: {
        id: number;
        name: string;
        displayName: string;
        description: string;
        isStatic: boolean;
    };
    permissions: EditRolePermissionModel[];
    grantedPermissionNames: string[];
}

export class AllRolesModel {
    totalCount: number;
    items: RoleModel[];
}