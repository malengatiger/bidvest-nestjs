import { Injectable, Logger } from "@nestjs/common";
import { UserManager } from "src/services/user_manager";
import { FirestoreManager } from "src/services/firestore_manager";
import { BidvestUser, Organization, User } from "src/models/models";
const mm = "🍀🍀🍀 OnboardingService";
@Injectable()
export class OnboardingService {
  constructor(
    private readonly firestore: FirestoreManager,
    private readonly userManager: UserManager
  ) {}

  async addOrganization(organization: Organization): Promise<any> {
    try {
      console.log(
        `${mm} Organization to be added: 🥦 ${JSON.stringify(organization)}`
      );

      const res = await this.firestore.createDocument(
        "Organizations",
        organization
      );
      console.log(
        `${mm} Organization added successfully: ${JSON.stringify(organization)}`
      );
      return { message: `Organization added successfully: ${res}` };
    } catch (error) {
      console.error(" 👿 👿 👿 Error adding organization:", error);
      throw error;
    }
  }

  async addUser(user: User): Promise<any> {
    try {
      const mUser = await this.userManager.createUser(user, "Users");
      console.log(`${mm} User added successfully: ${JSON.stringify(mUser)}`);
      return mUser;
    } catch (error) {
      console.error("Error adding user:", error);
      throw new Error(`Error adding user: ${error}`);
    }
  }
  async addBidvestUser(user: BidvestUser): Promise<any> {
    try {
      const mUser = await this.userManager.createBidvestUser(user);
      console.log(
        `${mm} Bidvest User added successfully: ${JSON.stringify(mUser)}`
      );
      return mUser;
    } catch (error) {
      console.error("Error adding user:", error);
      throw new Error(`Error adding user: ${error}`);
    }
  }
  async addOrganizations(jsonData: any[]): Promise<any> {
    const list = [];
    try {
      jsonData.forEach(async (element) => {
        element.date = new Date().toISOString();
        element.organizationId = new Date().getTime();
        try {
          const m = await this.firestore.createDocument(
            "Organizations",
            element
          );
          list.push(m);
        } catch (error) {
          Logger.debug(
            `${mm} user add failed. ignored: ${JSON.stringify(element)}`
          );
        }
      });
    } catch (error) {
      console.error("Error adding organizations:", error);
      throw error;
    }
    return list;
  }
  async addOrganizationUsers(
    jsonData: any[],
    organizationId: string
  ): Promise<any> {
    const list = 
    await this.userManager.addOrganizationUsers(jsonData, organizationId);
    try {
    } catch (error) {
      console.error("Error adding users:", error);
      throw error;
    }
    return list;
  }

  async addBidvestUsers(jsonData: any[], divisionId: string): Promise<any[]> {
    const users: BidvestUser[] = [];

    try {
      const div = await this.firestore.getDocument(
        "BidvestDivisions",
        divisionId,
        "divisionId"
      );
      if (!div) {
        throw new Error(`${mm} Division does not exist`);
      }

      await this.userManager.addBidvestUsers(jsonData, divisionId);
    } catch (e) {
      Logger.debug(`${mm} error adding user`);
    }
    return users;
  }
  async addCoachUsers(jsonData: any[]): Promise<any[]> {
    const users: BidvestUser[] = [];

    try {
      await this.userManager.addCoachUsers(jsonData);
    } catch (e) {
      Logger.debug(`${mm} error adding coach`);
    }
    return users;
  }
}
