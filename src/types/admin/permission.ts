export interface Permission {
  _id: string;
  name: string;
}

export interface CreatePermissionReqBody {
  name: string;
}

export interface AddPermissionsReqBody {
  names: string[];
  adminId: string;
}
