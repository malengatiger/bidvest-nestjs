import { Injectable, Logger } from "@nestjs/common";
import { CloudStorageService } from "src/services/cloud_storage_service";
import { FirestoreManager } from "src/services/firestore_manager";
import * as fs from "fs";
import { randomInt } from "crypto";
const mm = "🔴 🔴 BotService:";

@Injectable()
export class BotService {
  constructor(
    private readonly firestoreManager: FirestoreManager,
    private readonly cloudService: CloudStorageService
  ) {}

  async addBotVideos(videos: any[]) {
    const jsonList = [];

    await this.fillList(videos, jsonList);

    const vidObj = jsonList.reduce(
      (map, video) => {
        map.videos.push({ video: video });
        return map;
      },
      { videos: [] }
    );

    console.log(`${mm} vidObj: ${vidObj} ... 💧💧 handleFile ...`);
    const downloadUrl = await this.handleFile(vidObj);

    return downloadUrl;
  }

  private async fillList(videos: any[], jsonList: any[]) {
    videos.forEach(async (v) => {
      const jsonData = JSON.stringify(v);
      jsonList.push(jsonData);
      const res = await this.firestoreManager.createDocument("BotVideos", v);
      console.log(`${mm}  video added to firestore: ${res.path}`);
    });
  }

  private async handleFile(vidObj: any) {
    const fileName = `${new Date().toISOString()}_${randomInt(1000)}.json`;

    const jsonString = JSON.stringify(vidObj, null, 4);
   
    fs.writeFileSync(fileName, JSON.stringify(vidObj, null, 4));
    Logger.debug(`\n\n${mm} stringified: ${jsonString} 💧💧💧 file written OK 🥬 🥬 🥬 🥬\n`);

    const downloadUrl = await this.cloudService.uploadFile(
      Buffer.from(jsonString),
      fileName
    );
    Logger.debug(`\n\n${mm} cloud downloadUrl: \n${downloadUrl} `);

    const result = await this.firestoreManager.createDocument(
      "VideoBotCloudStorageLinks",
      {
        downloadUrl: downloadUrl,
        filename: fileName,
        date: new Date().toISOString(),
        numDate: new Date().getTime(),
      }
    );
    console.log(
      `${mm} VideoBotCloudStorageLink added to firestore: 🥬  🥬 🥬 path: ${result.path}\n`
    );
    return downloadUrl;
  }

  async getAllBotVideos(): Promise<any[]> {
    const res = await this.firestoreManager.getAllDocuments("BotVideos");
    console.log(`${mm}   getAllBotVideos, res: ${JSON.stringify(res)}`);

    return res;
  }
  async getBotVideos(orderBy: string, limit: number): Promise<any[]> {
    console.log(`${mm}  getBotVideos: limit: ${limit}`);
    const res = await this.firestoreManager.getDocumentsWithLimit(
      "BotVideos",
      limit,
      orderBy
    );
    return res;
  }
}
