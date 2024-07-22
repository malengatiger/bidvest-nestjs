import {
  Controller,
  Logger,
  Post,
  Get,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  Body,
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
import { UploadResponse } from "src/models/models";
import { FirestoreManager } from "src/services/firestore_manager";
const mm = "🥦🥦 OrganizationsController 🥦🥦";

@Controller("organizations")
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly cloudStorageService: CloudStorageService,
    private readonly userManager: UserManager,
    private readonly firestore: FirestoreManager
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
          list = await this.userManager.addOrganizationUsers(
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
          Logger.debug(
            `${mm} Organizations uploaded successfully: ${list.length}`
          );
          return;
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
  @Get("/getOrganizations")
  async getOrganizations() {
    return this.organizationsService.getOrganizations();
  }
  @Post("/uploadLogo")
  @UseInterceptors(FileInterceptor("file"))
  async uploadLogo(
    @UploadedFile() file: Express.Multer.File,
    @Query("organizationId") organizationId: string
  ): Promise<UploadResponse> {
    try {
      // Convert the file to a Buffer
      const fileBuffer = file.buffer;
      // Define the file name and bucket name
      const org =
        await this.organizationsService.getOrganization(organizationId);
      if (!org) {
        throw new Error(`Organization not found: ${organizationId}`);
      }

      const fName = `${new Date().getTime()}_${file.originalname}`;
      const fileName = `${org.name}/logo/${fName}`;
      // Upload the file to Firebase Cloud Storage
      const publicUrl = await this.cloudStorageService.uploadFile(
        fileBuffer,
        fileName,
        organizationId
      );

      Logger.debug(`${mm} File uploaded to Cloud Storage, url: \n${publicUrl}`);
      // Send the public URL as a response
      return { downloadUrl: publicUrl, date: new Date().toISOString() };
    } catch (error) {
      Logger.error(`${mm} Error uploading file:`, error);
      throw new Error(`Failed to upload file: ${error}`);
    }
  }
  @Post("/uploadUserProfileImage")
  @UseInterceptors(FileInterceptor("file"))
  async uploadUserProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Query("userId") userId: string
  ): Promise<UploadResponse> {
    try {
      // Convert the file to a Buffer
      const fileBuffer = file.buffer;
      // Define the file name and bucket name
      const user = await this.firestore.getDocument("Users", userId, "userId");
      if (!user) {
        throw new Error(`User not found: ${userId}`);
      }
      
      const fName = `${new Date().getTime()}_${file.originalname}`;
      const fileName = `${user.name}/userProfile/${fName}`;
      // Upload the file to Firebase Cloud Storage
      const publicUrl = await this.cloudStorageService.uploadFile(
        fileBuffer,
        fileName,
        userId
      );

      Logger.debug(`${mm} File uploaded to Cloud Storage, url: \n${publicUrl}`);
      // Send the public URL as a response
      return { downloadUrl: publicUrl, date: new Date().toISOString() };
    } catch (error) {
      Logger.error(`${mm} Error uploading file:`, error);
      throw new Error(`Failed to upload file: ${error}`);
    }
  }
  @Post("/uploadUserSplashImage")
  @UseInterceptors(FileInterceptor("file"))
  async uploadUserSplashImage(
    @UploadedFile() file: Express.Multer.File,
    @Query("userId") userId: string
  ): Promise<UploadResponse> {
    try {
      // Convert the file to a Buffer
      const fileBuffer = file.buffer;
      // Define the file name and bucket name
      const user = await this.firestore.getDocument("Users", userId, "userId");
      if (!user) {
        throw new Error(`User not found: ${userId}`);
      }
      const org = await this.firestore.getDocument(
        "Organizations",
        user.organizationId,
        "organizationId"
      );
      if (!user) {
        throw new Error(`User not found: ${userId}`);
      }

      const fName = `${new Date().getTime()}_${file.originalname}`;
      const fileName = `${user.name}/userProfile/${fName}`;
      // Upload the file to Firebase Cloud Storage
      const publicUrl = await this.cloudStorageService.uploadFile(
        fileBuffer,
        fileName,
        org.organization
      );

      Logger.debug(`${mm} File uploaded to Cloud Storage, url: \n${publicUrl}`);
      // Send the public URL as a response
      return {
        downloadUrl: publicUrl,
        date: new Date().toISOString(),
      };
    } catch (error) {
      Logger.error(`${mm} Error uploading file:`, error);
      throw new Error(`Failed to upload file: ${error}`);
    }
  }
  @Post("/uploadSplashImage")
  @UseInterceptors(FileInterceptor("file"))
  async uploadSplashImage(
    @UploadedFile() file: Express.Multer.File,
    @Query("organizationId") organizationId: string
  ): Promise<UploadResponse> {
    try {
      // Convert the file to a Buffer
      const fileBuffer = file.buffer;
      // Define the file name and bucket name
      const org =
        await this.organizationsService.getOrganization(organizationId);
      if (!org) {
        throw new Error(`Organization not found: ${organizationId}`);
      }

      const fName = `${new Date().getTime()}_${file.originalname}`;
      const fileName = `${org.name}/splash/${fName}`;
      // Upload the file to Firebase Cloud Storage
      const publicUrl = await this.cloudStorageService.uploadFile(
        fileBuffer,
        fileName,
        organizationId
      );

      Logger.debug(`${mm} File uploaded to Cloud Storage, url: \n${publicUrl}`);
      // Send the public URL as a response
      return { downloadUrl: publicUrl, date: new Date().toISOString() };
    } catch (error) {
      Logger.error(`${mm} Error uploading file:`, error);
      throw new Error(`Failed to upload file: ${error}`);
    }
  }
  @Post("/uploadBannerImage")
  @UseInterceptors(FileInterceptor("file"))
  async uploadBannerImage(
    @UploadedFile() file: Express.Multer.File,
    @Query("organizationId") organizationId: string
  ): Promise<UploadResponse> {
    try {
      // Convert the file to a Buffer
      const fileBuffer = file.buffer;
      // Define the file name and bucket name
      const org =
        await this.organizationsService.getOrganization(organizationId);
      if (!org) {
        throw new Error(`Organization not found: ${organizationId}`);
      }

      const fName = `${new Date().getTime()}_${file.originalname}`;
      const fileName = `${org.name}/banner/${fName}`;
      // Upload the file to Firebase Cloud Storage
      const publicUrl = await this.cloudStorageService.uploadFile(
        fileBuffer,
        fileName,
        organizationId
      );

      Logger.debug(`${mm} File uploaded to Cloud Storage, url: \n${publicUrl}`);
      // Send the public URL as a response
      return { downloadUrl: publicUrl, date: new Date().toISOString() };
    } catch (error) {
      Logger.error(`${mm} Error uploading file:`, error);
      throw new Error(`Failed to upload file: ${error}`);
    }
  }
  @Post("/addOrganizationBranding")
  async addOrganizationBranding(@Body() branding: any) {
    Logger.debug(
      `${mm}Adding organization branding: ${JSON.stringify(branding)}`
    );
    try {
      return this.organizationsService.addOrganizationBranding(branding);
    } catch (error) {
      Logger.error(`${mm} Error adding organization branding:`, error);
      throw error;
    }
  }
  @Post("/addUserBranding")
  async addUserBranding(@Body() branding: any) {
    Logger.debug(`${mm}Adding user branding: ${JSON.stringify(branding)}`);
    try {
      return this.organizationsService.addUserBranding(branding);
    } catch (error) {
      Logger.error(`${mm} Error adding user branding:`, error);
      throw error;
    }
  }
  @Get("/getOrganizationBranding")
  async getOrganizationBranding(
    @Query("organizationId") organizationId: string
  ) {
    Logger.debug(`${mm} Getting organization branding: ${organizationId}`);
    try {
      return this.organizationsService.getOrganizationBranding(organizationId);
    } catch (error) {
      Logger.error(`${mm} Error getting organization branding:`, error);
      throw error;
    }
  }
  @Get("/getUserBranding")
  async getOUserBranding(@Query("userId") userId: string) {
    try {
      return this.organizationsService.getUserBranding(userId);
    } catch (error) {
      Logger.error(`${mm} Error getting user branding:`, error);
      throw error;
    }
  }
}
