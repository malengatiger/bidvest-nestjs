import { Body, Controller, Get, Logger, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { BotService } from "./bot.service";
import { UploadResponse } from "@google-cloud/storage";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudStorageService } from "src/services/cloud_storage_service";
const mm = "🥦🥦 BotController 🥦🥦";

@Controller("bot")
export class BotController {
  constructor(
    private readonly cloudStorageService: CloudStorageService,
    private readonly botService: BotService
  ) {}

  @Post("/addBotVideos")
  async addBotVideos(@Body() videos: any[]) {
    return this.botService.addBotVideos(videos);
  }

  @Get("/getAllBotVideos")
  async getAllBotVideos(): Promise<any[]> {
    return this.botService.getAllBotVideos();
  }
  @Get("/getBotVideos")
  async getBotVideos(
    @Query("limit") limit: number,
    @Query("orderBy") orderBy: string
  ): Promise<any[]> {
    return this.botService.getBotVideos(orderBy, limit);
  }

  @Get("/ping")
  async ping(): Promise<string> {
    return "🔴 🔴 🔴 🔴 🔴 Yebo, Bot controller is ALIVE!  🥬 🥬 🥬";
  }
  @Post("/uploadBotVideo")
  @UseInterceptors(FileInterceptor("file"))
  async uploadBotVideo(
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    try {
      // Convert the file to a Buffer
      const fileBuffer = file.buffer;
      const fName = `${new Date().getTime()}_${file.originalname}`;
      const fileName = `botvideo/${fName}`;
      // Upload the file to Firebase Cloud Storage
      const publicUrl = await this.cloudStorageService.uploadFile(
        fileBuffer,
        fileName
      );

      Logger.debug(`${mm} File uploaded to Cloud Storage, url: \n${publicUrl}`);
      // Send the public URL as a response
      return { 'downloadUrl': publicUrl, date: new Date().toISOString() };
    } catch (error) {
      Logger.error(`${mm} Error uploading file:`, error);
      throw new Error(`Failed to upload file: ${error}`);
    }
  }
}
