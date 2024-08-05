import { Injectable, Logger } from "@nestjs/common";
import { CloudStorageService } from "src/services/cloud_storage_service";
import { FirestoreManager } from "src/services/firestore_manager";
import * as fs from "fs";
import { randomInt } from "crypto";

const mm = "🔴 🔴 🔴 BotService 🔴";

@Injectable()
export class BotService {
  constructor(
    private readonly firestoreManager: FirestoreManager,
    private readonly cloudService: CloudStorageService
  ) {}

  async addBotVideos(videos: any[]) {
    Logger.debug(`${mm} addBotVideos: ${videos.length} 💧💧`);

    const jsonList = [];

    await this.fillList(videos, jsonList);

    const vidObj = jsonList.reduce(
      (map, video) => {
        map.videos.push({ video: video });
        return map;
      },
      { videos: [] }
    );

    Logger.debug(`${mm} vidObj has ${vidObj.videos.length} 
      video objects to be written to Firestore and CloudStorage`);

    const downloadUrl = await this.handleFile(vidObj);

    return {
      date: new Date().toISOString(),
      videosUploaded: videos.length,
      downloadUrl: downloadUrl,
    };
  }

  private async fillList(videos: any[], jsonList: any[]) {
    let count = 0;
    videos.forEach(async (v) => {
      const jsonData = JSON.stringify(v);
      jsonList.push(jsonData);
      const res = await this.firestoreManager.createDocument("BotVideos", v);
      count++;
      console.log(`${mm}  video #${count} added to firestore: 🌀 ${res.path}`);
    });
  }

  private async handleFile(vidObj: any) {
    const fileName = `${new Date().toISOString()}_${randomInt(1000)}.json`;

    const jsonString = JSON.stringify(vidObj, null, 4);

    fs.writeFileSync(fileName, JSON.stringify(vidObj, null, 4));
    Logger.debug(
      `\n\n${mm} stringified json data file written OK 🥬 ${jsonString.length} 🥬
      \n🥬 fileName:${fileName}`
    );

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
    Logger.log(
      `${mm} VideoBotCloudStorageLink added to firestore: 🥬 🥬 🥬 path: ${result.path}\n`
    );
    return downloadUrl;
  }

  async getAllBotVideos(): Promise<any[]> {
    const res = await this.firestoreManager.getAllDocuments("BotVideos");
    Logger.debug(`${mm}   getAllBotVideos, res: ${JSON.stringify(res)}`);

    return res;
  }
  async getBotVideos(orderBy: string, limit: number): Promise<any[]> {
    Logger.debug(`${mm}  getBotVideos: limit: ${limit}`);
    const res = await this.firestoreManager.getDocumentsWithLimit(
      "BotVideos",
      limit,
      orderBy
    );

    return res;
  }
}
