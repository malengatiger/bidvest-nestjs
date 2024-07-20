import { Injectable, Logger } from '@nestjs/common';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';
const mm = '🍎🍎🍎 FileArchiverService: 🍎🍎🍎';

@Injectable()
export class FileArchiverService {
  async zip(fileContents: { content: string }[]): Promise<string> {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2, 8);
    const key = `${timestamp}_${randomString}`;
    const zipFileName = `file${key}.zip`;
    const zipFilePath = path.join(__dirname, '..', 'tempFiles', zipFileName);

    Logger.log(`${mm} input content: ${fileContents[0].content.length} bytes`);
    return new Promise<string>((resolve, reject) => {
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('data', (chunk) => {
        Logger.log(`${mm} ... on data: chunk length: ${chunk.length} bytes`);
      });
      output.on('close', () => {
        Logger.log(`${mm} ... onClose .. resolved the Promise`);
        resolve(zipFilePath);
      });

      archive.on('error', (error: any) => {
        Logger.log(`${mm} ... archive error: ${error}`);
        reject(error);
      });

      archive.pipe(output);

      for (const file of fileContents) {
        archive.append(file.content, { name: zipFileName });
      }
      Logger.log(`${mm} ... finalize archive: files zipped`);

      archive.finalize();
    });
  }
}
