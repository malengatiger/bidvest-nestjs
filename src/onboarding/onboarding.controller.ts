import { Body, Controller, HttpException, HttpStatus, Logger, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { Organization, User } from 'src/models/models';
import { FileInterceptor } from '@nestjs/platform-express';
import * as csvParser from "csv-parser"; // Import csv-parser
import { Readable } from "stream";
const mm = " 🌿 🌿 🌿 OnboardingController ";
@Controller("onboarding")
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post("/addOrganizations")
  @UseInterceptors(FileInterceptor("file"))
  async addOrganizations(
    @UploadedFile() file: Express.Multer.File,
  ) {
     let list = [];
     try {
       const fileBuffer = file.buffer;
       // Create a Readable stream from the file buffer
       const readable = Readable.from(fileBuffer);
       const jsonData: any[] = [];
       // Parse the CSV data and convert it to JSON
       readable
         .pipe(csvParser())
         .on("data", (row) => {
           // Convert the row to a JSON object
           const jsonObject = Object.fromEntries(
             Object.entries(row).map(([key, value]) => [key, value])
           );
           jsonObject.organizationId = new Date().getTime();
           jsonObject.date = new Date().toISOString();
           jsonData.push(jsonObject);
         })
         .on("end", async () => {
           list = await this.onboardingService.addOrganizations(
             jsonData,
           );
           Logger.debug(`${mm} Organization users uploaded successfully`);
         })
         .on("error", (error) => {
           Logger.error(`${mm} Error parsing CSV:`, error);
           throw error;
         });
     } catch (error) {
       Logger.error(`${mm} Error uploading file:`, error);
       throw error;
     }
     return list;
  }
  @Post("/addBidvestUsers")
  @UseInterceptors(FileInterceptor("file"))
  async addBidvestUsers(
    @UploadedFile() file: Express.Multer.File,
    @Query("divisionId") divisionId: string
  ) {
    let list = [];
    try {
      const fileBuffer = file.buffer;
      // Create a Readable stream from the file buffer
      const readable = Readable.from(fileBuffer);
      const jsonData: any[] = [];
      // Parse the CSV data and convert it to JSON
      readable
        .pipe(csvParser())
        .on("data", (row) => {
          // Convert the row to a JSON object
          const jsonObject = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [key, value])
          );
          jsonObject.divisionId = divisionId;
          jsonObject.date = new Date().toISOString();
          jsonData.push(jsonObject);
        })
        .on("end", async () => {
          list = await this.onboardingService.addBidvestUsers(
            jsonData,
            divisionId
          );
          Logger.debug(`${mm} Bidvest users uploaded successfully`);
        })
        .on("error", (error) => {
          Logger.error(`${mm} Error parsing CSV:`, error);
          throw error;
        });
    } catch (error) {
      Logger.error(`${mm} Error uploading file:`, error);
      throw error;
    }
    return list;
  }
  @Post("/addOrganization")
  async addOrganization(@Body() organization: Organization) {
    try {
      const result = await this.onboardingService.addOrganization(organization);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post("/addOrganizationUsers")
  @UseInterceptors(FileInterceptor("file"))
  async addOrganizationUsers(@UploadedFile() file:  Express.Multer.File, organizationId: string) {
        let list = [];
    try {
      const fileBuffer = file.buffer;
      // Create a Readable stream from the file buffer
      const readable = Readable.from(fileBuffer);
      const jsonData: any[] = [];
      // Parse the CSV data and convert it to JSON
      readable
        .pipe(csvParser())
        .on("data", (row) => {
          // Convert the row to a JSON object
          const jsonObject = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [key, value])
          );
          jsonObject.organizationId = organizationId;
          jsonObject.date = new Date().toISOString();
          jsonData.push(jsonObject);
        })
        .on("end", async () => {
          list = await this.onboardingService.addOrganizationUsers(
            jsonData,
            organizationId
          );
          Logger.debug(`${mm} Organization users uploaded successfully`);
        })
        .on("error", (error) => {
          Logger.error(`${mm} Error parsing CSV:`, error);
          throw error;
        });
    } catch (error) {
      Logger.error(`${mm} Error uploading file:`, error);
      throw error;
    }
    return list;
  }
  @Post("/addUser")
  async addUser(@Body() user: User) {
    return this.onboardingService.addUser(user);
  }
}
