interface User {
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

interface Organization {
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

interface OrganizationLocation {
  name: string;
  latitude: number;
  longitude: number;
  organizationId: number;
  organizationName: string;
  geoHash: string;
  date: string;
}

interface BidvestDivision {
  name: string;
  adminEmail: string;
  adminCellphone: string;
  divisionId: string;
  adminPassword: string;
  date: string;
}

interface OrganizationBidvestDivision {
  divisionId: string;
  divisionName: string;
  organizationName: string;
  organizationId: string;
  orgDivisionId: string;
}
interface Usage {
  userId: string;
  organizationId: string;
  name: string;
  workType: string;
  date: string;
}

