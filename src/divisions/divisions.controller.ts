import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { DivisionsService } from "./divisions.service";
import { BidvestDivision } from "src/models/models";
import { FileInterceptor } from "@nestjs/platform-express";
import * as csvParser from "csv-parser"; // Import csv-parser
import { Readable } from "stream";
const mm = "🥦🥦 DivisionsController 🥦🥦";

@Controller("divisions")
export class DivisionsController {
  constructor(private readonly divisionsService: DivisionsService) {}

  @Post("/addDivision")
  async addDivision(@Body() division: BidvestDivision) {
    return await this.divisionsService.addDivision(division);
  }
  @Get("/getDivisions")
  async getDivisions() {
    return await this.divisionsService.getDivisions();
  }
  @Get("/addOrganizationDivision")
  async addOrganizationDivision(
    @Query("organizationId")
    organizationId: string,
    @Query("divisionId") divisionId: string
  ) {
    return await this.divisionsService.addOrganizationDivision(
      organizationId,
      divisionId
    );
  }
  @Get("/getOrganizationDivisions")
  async getOrganizationDivisions(
    @Query("organizationId") organizationId: string
  ) {
    return await this.divisionsService.getOrganizationDivisions(organizationId);
  }
  @Post("/uploadDivisions")
  @UseInterceptors(FileInterceptor("file"))
  async uploadDivisions(@UploadedFile() file: Express.Multer.File) {
    let list = [];
    try {
      const fileBuffer = file.buffer;
      // Create a Readable stream from the file buffer.
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
          list = await this.divisionsService.addDivisions(jsonData);
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
}
