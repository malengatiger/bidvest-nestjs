import { Injectable, Logger } from "@nestjs/common";
import { FirestoreManager } from "src/services/firestore_manager";
import { UserManager } from "src/services/user_manager";

const organizationsCollection = "Organizations";
const mm = "💦 💦 💦 OrganizationsService 💦 ";
@Injectable()
export class OrganizationsService {
  constructor(
    private readonly firestoreManager: FirestoreManager,
    private readonly userManager: UserManager
  ) {}
  async getOrganization(id: string) {
    return await this.firestoreManager.getDocument(
      organizationsCollection,
      id,
      "organizationId"
    );
  }
  async getOrganizations() {
    return await this.firestoreManager.getAllDocuments(organizationsCollection);
  }
  async createOrganization(organization: Organization) {
    const org = await this.firestoreManager.getDocument(
      organizationsCollection,
      organization.name,
      "name"
    );
    if (org) {
      throw new Error(`${organization.name} ... already exists`);
    }
    organization.organizationId = `${new Date().getTime()}`;
    organization.date = new Date().toISOString();
    const res = await this.firestoreManager.createDocument(
      organizationsCollection,
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
      profileUrl: "",
    };
    Logger.debug(`${mm} admin user to authenticate: ${JSON.stringify(user)}`);
    await this.userManager.createUser(user);
  }

  async addOrganizations(jsonData: any[]) {
    Logger.debug(`${mm} processJsonData: ${JSON.stringify(jsonData)}`);
    const orgs = [];
    for (const j of jsonData) {
      j.date = new Date().toISOString();
      j.organizationId = `${new Date().getTime()}`;
      j.date = new Date().toISOString();

      const org = await this.firestoreManager.getDocument(
        "Organizations",
        j.name,
        "name"
      );
      if (!org) {
        const x = await this.firestoreManager.createDocument(
          organizationsCollection,
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
}
