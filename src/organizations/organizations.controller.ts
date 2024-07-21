import {
  Controller,
  Logger,
  Post,
  Get,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudStorageService } from "src/services/cloud_storage_service";
import { UserManager } from "src/services/user_manager";

import * as admin from "firebase-admin";
import { Constants } from "src/services/constants";
import * as csvParser from "csv-parser"; // Import csv-parser
import { Readable } from "stream";
import * as fs from "fs";
const mm = "🥦🥦 OrganizationsController 🥦🥦";

@Controller("organizations")
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly cloudStorageService: CloudStorageService,
    private readonly userManager: UserManager
  ) {}

  @Post("/uploadOrganizationUsers")
  @UseInterceptors(FileInterceptor("file"))
  async uploadOrganizationUsers(
    @UploadedFile() file: Express.Multer.File,
    @Query("organizationId") organizationId: string
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
          jsonData.push(jsonObject);
        })
        .on("end", async () => {
         list = await this.userManager.addOrganizationUsers(jsonData, organizationId);
          Logger.debug( `${mm} Organization users uploaded successfully`);
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
  @Post("/uploadOrganizations")
  @UseInterceptors(FileInterceptor("file"))
  async uploadOrganizations(@UploadedFile() file: Express.Multer.File) {
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
          jsonData.push(jsonObject);
        })
        .on("end", async () => {
          list = await this.organizationsService.addOrganizations(jsonData);
          Logger.debug( `${mm} Organizations uploaded successfully: ${list.length}`);
          return 
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
  @Post("/upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query("organizationId") organizationId: string,
    @Query("fileType") fileType: string
  ) {
    try {
      // Convert the file to a Buffer
      const fileBuffer = file.buffer;
      // Define the file name and bucket name
      const org =
        await this.organizationsService.getOrganization(organizationId);
      if (!org) {
        throw new Error(`Organization not found: ${organizationId}`);
      }
      const mmx = Constants.parse(fileType);
      const fileName = `${org.name}/${mmx}/${file.originalname}`;
      // Upload the file to Firebase Cloud Storage
      const publicUrl = await this.cloudStorageService.uploadFile(
        fileBuffer,
        fileName,
        organizationId,
        fileType
      );

      Logger.debug(`${mm} File uploaded to Cloud Storage, url: ${publicUrl}`);
      // Send the public URL as a response
      return publicUrl;
    } catch (error) {
      Logger.error(`${mm} Error uploading file:`, error);
      throw new Error(`Failed to upload file: ${error}`);
    }
  }
  @Get("/getOrganizations")
  async getOrganizations() {
    return this.organizationsService.getOrganizations();
  }
}
