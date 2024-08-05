import { Injectable, Logger } from "@nestjs/common";
import { Organization, OrganizationBranding, User, UserBranding } from "src/models/models";
import { FirestoreManager } from "src/services/firestore_manager";
import { UserManager } from "src/services/user_manager";

const organizations = "Organizations";
const organizationBranding = "OrganizationBranding";
const userBranding = "UserBranding";
const users = "Users";


const mm = "💦 💦 💦 OrganizationsService 💦 ";
@Injectable()
export class OrganizationsService {
  constructor(
    private readonly firestoreManager: FirestoreManager,
    private readonly userManager: UserManager
  ) {}
  async getOrganization(id: string) {
    return await this.firestoreManager.getDocument(
      organizations,
      id,
      "organizationId"
    );
  }
  async getOrganizations() {
    return await this.firestoreManager.getAllDocuments(organizations);
  }
  async getOrganizationBranding(organizationId: string) {
    return await this.firestoreManager.getDocuments(
      organizationBranding,
      organizationId,
      "organizationId"
    );
  }
  async getUserBranding(userId: string) {
    return await this.firestoreManager.getDocuments(
      userBranding,
      userId,
      "userId"
    );
  }
  async createOrganization(organization: Organization) {
    const org = await this.firestoreManager.getDocument(
      organizations,
      organization.name,
      "name"
    );
    if (org) {
      throw new Error(`${organization.name} ... already exists`);
    }
    organization.organizationId = `${new Date().getTime()}`;
    organization.date = new Date().toISOString();
    const res = await this.firestoreManager.createDocument(
      organizations,
      organization
    );
    await this.buildUser(organization);
    return res;
  }

  private async buildUser(organization: Organization) {
    const user: User = {
      name: organization.name,
      email: organization.adminEmail,
      password: organization.adminPassword,
      organizationId: organization.organizationId,
      organizationName: organization.name,
      date: new Date().toISOString(),
      cellphone: organization.adminCellphone,
      userId: "",
      position: "",
    };
    Logger.debug(`${mm} admin user to authenticate: ${JSON.stringify(user)}`);
    await this.userManager.createUser(user,'Users');
  }

  async addOrganizations(jsonData: any[]) {
    Logger.debug(`${mm} processJsonData: ${JSON.stringify(jsonData)}`);
    const orgs = [];
    for (const j of jsonData) {
      j.date = new Date().toISOString();
      j.organizationId = `${new Date().getTime()}`;
      j.date = new Date().toISOString();

      const org = await this.firestoreManager.getDocument(
        organizations,
        j.name,
        "name"
      );
      if (!org) {
        const x = await this.firestoreManager.createDocument(
          organizations,
          j
        );
        await this.buildUser(j);
        Logger.debug(`${mm} record processed:  💧 ${JSON.stringify(j)}`);
        orgs.push(x);
      } else {
        Logger.debug(`${mm} org exists, ignored:  💧 ${org.name}`);
      }
    }
    return orgs;
  }

  async addOrganizationBranding(branding: OrganizationBranding) {
    Logger.debug(`${mm} addOrganizationBranding: ${JSON.stringify(branding)}`);

    try {
      branding.date = new Date().toISOString();
      branding.brandingId = `${new Date().getTime()}`;
      const res = await this.firestoreManager.createDocument(
        organizationBranding,
        branding
      );
      Logger.debug(
        `${mm} OrganizationBranding processed:  💧 ${JSON.stringify(branding)}`
      );
      return branding;
    } catch (error) {
      throw new Error(`Failed to add organization branding: ${error}`);
    }
  }
  async addUserBranding(branding: UserBranding) {
    Logger.debug(`${mm} addUserBranding: ${JSON.stringify(branding)}`);

    try {
      const user = await this.firestoreManager.getDocument(
        users,
        branding.userId,
        "userId"
      );
      if (!user) {
        throw new Error(`User does not exist: ${branding.userId}`);
      }
      const org = await this.firestoreManager.getDocument(
        organizations,
        user.organizationId,
        "organizationId"
      );
      if (!org) {
        throw new Error(
          `Organization does not exist: ${branding.organizationId}`
        );
      }

      branding.date = new Date().toISOString();
      branding.brandingId = `${new Date().getTime()}`;
      branding.userName = user.name;
      branding.organizationName = org.name;

      const res = await this.firestoreManager.createDocument(
        userBranding,
        branding
      );
      Logger.debug(
        `${mm} UserBranding processed:  💧 ${JSON.stringify(branding)}`
      );
      return branding;
    } catch (error) {
      throw new Error(`Failed to add organization branding: ${error}`);
    }
  }
}
