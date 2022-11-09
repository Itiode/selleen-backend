export type S3FolderName = "products" | "banners" | "logos" | "kyc-docs";

export interface Name {
  first: string;
  last: string;
}

export interface AuthReqBody {
  email: string;
  password: string;
}

export interface AuthResBody {
  message: string;
  data?: {
    id: string;
    token: string;
    tokenExpirationDate: number;
  };
}

export interface Shop {
  name: string;
  id: string;
}

export interface Role {
  name: "Owner" | "Manager" | "SupportStaff";
  shopId: string;
}

export interface Address {
  full: string;
  city: string;
  state: string;
  country: string;
}

export interface Coords {
  lng: number;
  lat: number;
}

export interface Image {
  url: string;
}

export interface GetFileUploadURLResBody {
  message: string;
  data?: {
    url: string;
    key: string;
  };
}

export interface GetFileUploadURLQueryParams {
  fileType: string;
  folderName: S3FolderName;
}

export interface Creator {
  userId: string;
  name: Name;
}

export interface Point {
  type: string;
  coordinates: number[];
}

export interface SimpleResBody {
  message: string;
}

export interface SocialMediaLink {
  name: "Facebook" | "Instagram" | "Twitter";
  url: string;
}

export interface PersonalId {
  type: "NationalId" | "PVC" | "DriverLicense";
  url: string;
  originalName: string;
}

export interface GetEntityCountResBody {
  message: string;
  data: {
    count: number;
  };
}

export interface SimpleReqQuery {
  searchText?: string;
  pageNumber: string;
  pageSize: string;
}

export interface SimpleReqParam {
  [id: string]: string;
}

export interface Todo {
  message: string;
}

export interface GetTodosResBody {
  message: string;
  data?: { todos: Todo[] };
}
