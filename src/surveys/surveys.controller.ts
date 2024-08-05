import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { SurveysService } from "./surveys.service";
import { FileInterceptor } from "@nestjs/platform-express";
import * as csvParser from "csv-parser"; // Import csv-parser
import { Readable } from "stream";
import { SurveyResponse, SurveyTemplate } from "src/models/models";
const mm = "💖 💖 💖 SurveysController";
@Controller("surveys")
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post("/uploadSurveyTemplate")
  @UseInterceptors(FileInterceptor("file"))
  async uploadSurveyTemplate(
    @UploadedFile() file: Express.Multer.File,
    @Query("surveyName") surveyName: string,
    @Query("divisionId") divisionId: string
  ) {
    {
      let surv = {};
      try {
        const fileBuffer = file.buffer;
        Logger.debug(
          `${mm} ... uploaded file buffer: ${fileBuffer.length} bytes`
        );
        // Create a Readable stream from the file buffer
        const readable = Readable.from(fileBuffer);
        const jsonData: any[] = [];
        // Parse the CSV data and convert it to JSON
        surv = await this.processJsonData(
          readable,
          jsonData,
          surv,
          divisionId,
          surveyName
        );
      } catch (error) {
        Logger.error(`${mm} 👿👿👿 Error uploading file:`, error);
        throw new HttpException(
          "👿👿👿 Failed to upload file",
          HttpStatus.BAD_REQUEST
        );
      }
      return surv;
    }
  }
  private async processJsonData(
    readable: Readable,
    jsonData: any[],
    surv: {},
    divisionId: string,
    surveyName: string
  ) {
    return new Promise((resolve, reject) => {
      readable
        .pipe(csvParser())
        .on("data", (row) => {
          // Convert the row to a JSON object
          const jsonObject = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [key, value])
          );
          jsonData.push(jsonObject);
        })
        .on("end", async () => {
          Logger.debug(
            `${mm} json data parsed from csv: \n${JSON.stringify(jsonData)}`
          );
          try {
            surv = await this.surveysService.addSurveyTemplate(
              divisionId,
              surveyName,
              jsonData
            );
            resolve(surv);
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => {
          Logger.error(`${mm} Error parsing CSV:`, error);
          reject(error);
        });
    });
  }

  @Get("/getDivisionSurveyTemplates")
  async getDivisionSurveyTemplates(@Query("divisionId") divisionId: string) {
    return this.surveysService.getDivisionSurveyTemplates(divisionId);
  }
  @Get("/getSurveyTemplates")
  async getSurveyTemplates() {
    return this.surveysService.getSurveysTemplates();
  }

  @Post("/addSurveyResponse")
  async addSurveyResponse(@Body() surveyResponse: SurveyResponse) {
    return this.surveysService.addSurveyResponse(surveyResponse);
  }

  @Get("/getSurveyResponses")
  async getSurveyResponses(
    @Query("surveyTemplateId") surveyTemplateId: string
  ) {
    return this.surveysService.getSurveyResponses(surveyTemplateId);
  }

  @Get("/getSurveyAggregate")
  async getSurveyAggregate(
    @Query("surveyTemplateId") surveyTemplateId: string
  ) {
    return this.surveysService.aggregateSurveyResponses(surveyTemplateId);
  }
}
