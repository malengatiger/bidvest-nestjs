import { Injectable, Logger } from "@nestjs/common";
import * as admin from "firebase-admin";
import * as path from "path";
import * as dotenv from "dotenv";

const mm = "🔆🔆 CloudStorageService 🔆";

@Injectable()
export class CloudStorageService {
  private storage: admin.storage.Storage;

  constructor() {
    dotenv.config(); 
  }
  
  async uploadFile(
    file: Buffer,
    fileName: string,
  ): Promise<string> {
    try {
     
      if (!this.storage) {
        this.storage = admin.storage();
      }
      const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
      Logger.debug(`${mm} uploading to Cloud Storage : ${bucketName}`);
      const fileRef = this.storage.bucket(bucketName).file(fileName);
      const contentType = this.extractContentType(fileName);
      await fileRef.save(file, {
        metadata: {
          contentType: contentType, // Set the content type
          cacheControl: "public, max-age=31536000", // Set cache control for 1 year
        },
      });
      const [metadata] = await fileRef.getMetadata();
      Logger.log(
        `${mm} File uploaded to Cloud Storage successfully: ${fileName} \n mediaLink: ${metadata.mediaLink}`
      );
      const link = metadata.mediaLink;
      Logger.debug(`${mm} ... file link: ${link}`);
      return link;
    } catch (error) {
      console.error(`${mm} Error uploading file: 👿👿👿 `, error);
      throw new Error("Failed to upload file.");
    }
  }

  private extractContentType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    switch (ext) {
      case ".jpg":
      case ".jpeg":
        return "image/jpeg";
      case ".png":
        return "image/png";
      case ".gif":
        return "image/gif";
      case ".pdf":
        return "application/pdf";
      case ".json":
        return "application/json";
      case ".doc":
      case ".docx":
        return "application/msword";
      case ".xls":
      case ".xlsx":
        return "application/vnd.ms-excel";
      case ".txt":
        return "text/plain";
      case ".zip":
        return "application/zip";
      case ".mp4": // Add this case for .mp4 files
        return "video/mp4";
      default:
        return "application/octet-stream";
    }
  }
}
