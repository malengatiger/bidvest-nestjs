import { Injectable, Logger } from "@nestjs/common";
import { randomBytes, randomInt } from "crypto";
import {
  SurveyTemplate,
  SurveyRow,
  SurveySection,
  SurveyResponse,
  AggregateSurveyResponse,
} from "src/models/models";
import { FirestoreManager } from "src/services/firestore_manager";
const mm = "🍎🍎🍎 SurveysService ";

@Injectable()
export class SurveysService {
  constructor(private readonly firestore: FirestoreManager) {}

  async addSurveyTemplate(
    divisionId: string,
    surveyName: string,
    surveyJson: any[]
  ): Promise<any> {
    Logger.debug(`addSurveyTemplate to be added to Firestore: ${surveyName}`);

    const surveyTemplateId = `${new Date().getTime()}`;
    const survey: SurveyTemplate = {
      surveyTemplateId: surveyTemplateId,
      name: surveyName,
      date: new Date().toISOString(),
      divisionId: divisionId,
      sections: [],
    };
    let hashMap = new Map<string, string>();
    surveyJson.forEach((m) => {
      hashMap.set(m.section, m.section);
    });
    const sections = [];
    hashMap.forEach(async (m) => {
      Logger.debug(`${mm} Section: ${JSON.stringify(m)}`);
      const sectionId = `${new Date().getTime() + randomInt(1000)}`;
      const section: SurveySection = {
        sectionId: sectionId,
        rows: [],
        surveyTemplateId: surveyTemplateId,
        name: m,
      };
      const rows: SurveyRow[] = [];
      surveyJson.forEach((surveyRow) => {
        if (surveyRow.section === m) {
          surveyRow.date = new Date().toISOString();
          surveyRow.surveyRowId = new Date().getTime() + randomInt(1000);
          surveyRow.sectionId = sectionId;
          surveyRow.surveyTemplateId = surveyTemplateId;
          surveyRow.rating = 0;
          rows.push(surveyRow as SurveyRow);
          Logger.debug(
            `${mm} Row added to list; 🔶 sections: ${sections.length} - 🔶 rows: ${rows.length} \n${JSON.stringify(surveyRow)} \n`
          );
        }
      });
      section.rows = rows;
      sections.push(section);
      Logger.debug(
        `\n\n${mm} Section added to list; ${m} - 🔶 rows: ${rows.length}`
      );
    });
    survey.sections = sections;
    const res = await this.firestore.createDocument("SurveyTemplates", survey);
    Logger.debug(
      `\n\n${mm} SurveyTemplate added to Firestore - ${survey.name} 🔶🔶🔶 sections: ${survey.sections.length} `
    );
    Logger.debug(JSON.stringify(res));
    return survey;
  }
  async getSurveysTemplates(): Promise<any[]> {
    const res = await this.firestore.getAllDocuments("SurveyTemplates");
    return res;
  }
  async getDivisionSurveyTemplates(divisionId: string): Promise<any[]> {
    const res = await this.firestore.getDocuments(
      "SurveyTemplates",
      divisionId,
      "divisionId"
    );
    return res;
  }
  async addSurveyResponse(surveyResponse: SurveyResponse) {
    const res = await this.firestore.createDocument(
      "SurveyResponses",
      surveyResponse
    );
    Logger.debug(`${mm} SurveyResponse added to Firestore`);
    Logger.debug(JSON.stringify(res));
    return res;
  }
  async getSurveyResponses(surveyTemplateId: string): Promise<any[]> {
    const res = await this.firestore.getDocuments(
      "SurveyResponses",
      surveyTemplateId,
      "surveyTemplateId"
    );
    const agg = this.aggregateSurveyResponses(surveyTemplateId);
    res.push(agg);
    Logger.debug(`${mm} SurveyResponses added to Firestore`);
    Logger.debug(JSON.stringify(res))
    return res;
  }

  async aggregateSurveyResponses(surveyTemplateId: string): Promise<any> {
   
    const responses = this.getSurveyResponses(surveyTemplateId);
    let totalRating = 0;
   
    let totalRows = 0;
    (await responses).forEach((r) => {
        totalRating += r.rating;
        totalRows++;
       
    });

    const agg: AggregateSurveyResponse = {
        surveyTemplateId: surveyTemplateId,
        
        totalRating: totalRating,
        totalRows: totalRows,
        averageRating: totalRating/totalRows,
        medianRating: 0,
        date: new Date().toISOString(),
    }
    return agg;
  }
}


