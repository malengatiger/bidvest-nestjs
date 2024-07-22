import { Injectable, Logger } from "@nestjs/common";
import {
  BidvestDivision,
  OrganizationBidvestDivision,
} from "src/models/models";
import { FirestoreManager } from "src/services/firestore_manager";
const mm = "🥦🥦 DivisionsService 🥦🥦";

@Injectable()
export class DivisionsService {
  constructor(private readonly firestoreManager: FirestoreManager) {}

  async addDivision(division: BidvestDivision): Promise<any> {
    const div = await this.firestoreManager.getDocument(
      "BidvestDivisions",
      division.name,
      "name"
    );
    if (!div) {
      const d = await this.firestoreManager.createDocument(
        "BidvestDivisions",
        division
      );
      Logger.debug(`${mm} Division added: ${JSON.stringify(division)}`);
      return d;
    } else {
      Logger.debug(`${mm} division exists, ignored:  💧 ${division.name}`);
      return div;
    }
  }
  async addDivisions(jsonData: any[]): Promise<any> {
    let list = [];
    jsonData.forEach(async (division) => {
      const div = await this.firestoreManager.getDocument(
        "BidvestDivisions",
        division.name,
        "name"
      );
      if (!div) {
        division.divisionId = `${new Date().getTime()}`;
        division.date = new Date().toISOString();
        const d = await this.firestoreManager.createDocument(
          "BidvestDivisions",
          division
        );
        list.push(d);
      } else {
        Logger.debug(`${mm} division exists, ignored:  💧 ${division.name}`);
      }
    });
    Logger.debug(`${mm} Organizations uploaded successfully: ${list.length}`);
    return list;
  }
  async getDivisions(): Promise<any> {
    return await this.firestoreManager.getAllDocuments("BidvestDivisions");
  }
  async addOrganizationDivision(organizationId: string, divisionId: string) {
    const org = await this.firestoreManager.getDocument(
      "Organizations",
      organizationId,
      "organizationId"
    );
    if (!org) {
      throw new Error(`Organization does not exist: ${organizationId}`);
    }
    const division = await this.firestoreManager.getDocument(
      "BidvestDivisions",
      divisionId,
      "divisionId"
    );
    if (!division) {
      throw new Error(`Division does not exist: ${divisionId}`);
    }

    const orgBidvestDivision = {
      organizationId: organizationId,
      organizationName: org.name,
      divisionId: divisionId,
      divisionName: division.name,
      date: new Date().toISOString(),
    };
    const res = await this.firestoreManager.createDocument(
      "OrganizationBidvestDivisions",
      orgBidvestDivision
    );
    Logger.debug(
      `${mm} OrganizationDivision added: ${JSON.stringify(orgBidvestDivision)}`
    );
    Logger.debug(`OrganizationDivision add at path: ${res.path}`)
    return orgBidvestDivision;
  }
  async getOrganizationDivisions(organizationId: string): Promise<any> {
    const list = await this.firestoreManager.getDocuments(
      "OrganizationBidvestDivisions",
      organizationId,
      "organizationId"
    );
    Logger.debug(
      `${mm} OrganizationDivisions, found : ${JSON.stringify(list)}}`
    );
    return list;
  }
  async deleteDivision(divisionId: string): Promise<any> {}
  async deleteOrganizationDivision(orgDivisionId: string): Promise<any> {}
}
