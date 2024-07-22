export interface User {
  name: string;
  email: string;
  cellphone: string;
  userId: string;
  password: string;
  organizationId: string;
  organizationName: string;
  position: string;
  date: string;
  profileUrl: string;
}

export interface Organization {
  name: string;
  adminName: string;
  adminEmail: string;
  adminCellphone: string;
  organizationId: string;
  adminPassword: string;
  date: string;
  logoUrl: string;
  splashImageUrl: string;
}
export interface OrganizationBranding {
  brandingId: string;
  organizationId: string;
  organizationName: string;
  date: string;
  logoUrl: string;
  splashImageUrl: string;
  bannerImageUrl: string;
}
export interface UserBranding {
  brandingId: string;
  userId: string;
  userName: string;
  organizationId: string;
  organizationName: string;
  date: string;
  profileImageUrl: string;
  splashImageUrl: string;
}

export interface OrganizationLocation {
  name: string;
  latitude: number;
  longitude: number;
  organizationId: number;
  organizationName: string;
  geoHash: string;
  date: string;
}

export interface BidvestDivision {
  name: string;
  adminEmail: string;
  adminCellphone: string;
  divisionId: string;
  adminPassword: string;
  date: string;
}

export interface OrganizationBidvestDivision {
  divisionId: string;
  divisionName: string;
  organizationName: string;
  organizationId: string;
  orgDivisionId: string;
}
export interface Usage {
  userId: string;
  organizationId: string;
  name: string;
  workType: string;
  date: string;
}

export interface UploadResponse {
  downloadUrl: string;
  date: string;
}

