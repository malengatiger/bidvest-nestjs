import {
  Controller,
  Logger,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudStorageService } from "src/services/cloud_storage_service";
import * as admin from "firebase-admin";
const mm = "🥦🥦 OrganizationsController 🥦🥦";
@Controller("organizations")
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly cloudStorageService: CloudStorageService
  ) {}

  @Post("/upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query("organizationId") organizationId: string,
    @Query("fileType") fileType: string,
  ) {
    try {
      Logger.debug(
        `${mm} ... uploading file to Cloud Storage: orgId: ${organizationId} fileType: ${fileType}`,
        file
      ); 
      // Convert the file to a Buffer
      const fileBuffer = file.buffer;
      // Define the file name and bucket name
      const fileName = `${organizationId}/${fileType}/${file.originalname}`;
      // Upload the file to Firebase Cloud Storage
      const publicUrl = await this.cloudStorageService.uploadFile(
        fileBuffer,
        fileName,
        organizationId,
        fileType
      );

      Logger.debug(`${mm} File uploaded to Cloud Storage: ${publicUrl}`);
      // Send the public URL as a response
      return publicUrl;
    } catch (error) {
      Logger.error(`${mm} Error uploading file:`, error);
      throw new Error(`Failed to upload file: ${error}`);
    }
  }
}
