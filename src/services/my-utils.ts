/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';
import * as qrcode from 'qrcode';
import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
const mm = '🥦 🥦 🥦 🥦 MyUtils 🥦🥦';

export abstract class MyUtils {
  public static getDatabaseUrl(): string {
    const env = process.env.NODE_ENV;
    let dbUrl: string;
    if (env === 'production') {
      dbUrl = process.env.REMOTE_DB_URI;
    } else {
      dbUrl = process.env.LOCAL_DB_URI;
    }
    if (!dbUrl) {
      dbUrl = process.env.REMOTE_DB_URI;
    }
    Logger.log(`${mm} 🍷🍷 MONGODB dbUrl: ${dbUrl}`);
    return dbUrl;
  }
  public static getPort(): string {
    let port: string;
    const env = process.env.NODE_ENV;

    if (env === 'production') {
      port = process.env.REMOTE_PORT;
    } else {
      port = process.env.LOCAL_PORT;
    }
    Logger.log(
      `${mm} port from .env: ${port} node environment: 🍷🍷 ${process.env.NODE_ENV} 🍷🍷 `
    );
    if (!port) {
      port = '8080';
    }
    return port;
  }
  public static getStartDate(numberOfHours: number): string {
    const date = new Date();
    date.setHours(date.getHours() - numberOfHours);
    const isoString = date.toISOString();
    return isoString;
  }

  public static async createQRCodeAndUploadToCloudStorage(
    input: string,
    prefix: string,
    size: number,
  ): Promise<string> {
    Logger.log(`${mm} qrcode prefix: ${prefix} - size: ${size}`);
    try {
      const fileName = `qrcode_${prefix}_${new Date().getTime()}.png`;
      const tempDir = path.join(__dirname, '..', 'tempFiles');
      const tempFilePath = path.join(tempDir, fileName);

      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      let version = 15;
      if (size == 1) {
        version = 20;
      }
      if (size == 2) {
        version = 30;
      }
      if (size == 3) {
        version = 40;
      }
      Logger.log(`${mm} qrcode version: ${version}`);
      await qrcode.toFile(tempFilePath, input, {
        version: version,
      });
      Logger.log(`${mm} tempFilePath.length: ${tempFilePath.length} bytes`);
      // Upload QR code image to Google Cloud Storage
      const storage = admin.storage();
      Logger.log(`${mm} uploading qrcode file: ${tempFilePath}`);

      const options = {
        destination: `kasieMedia/${fileName}`,
        metadata: {
          contentType: 'image/png',
          predefinedAcl: 'publicRead',
        },
      };
      const [file] = await storage.bucket().upload(tempFilePath, options);
      const [metadata] = await file.getMetadata();
      Logger.log(`${mm} returning medialink: 🔵 🔵 🔵 ${metadata.mediaLink}`);
      return metadata.mediaLink;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create QR code and upload to Cloud Storage.');
    }
  }
  public static formatISOStringDate(
    dateString: string,
    locale: string,
  ): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    if (locale) {
      return date.toLocaleString(locale, options);
    } else {
      return date.toLocaleString('en', options);
    }
  }
  public static deleteOldFiles(): void {
    Logger.log(`${mm} Deleting old files ...`);
    const tempDir = path.join(__dirname, '..', 'tempFiles');
    const files = fs.readdirSync(tempDir);
    const currentTime = Date.now();
    const tenMinutesAgo = currentTime - (10 * 60 * 1000); // 10 minutes in milliseconds

    let cnt = 0;
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const fileStats = fs.statSync(filePath);
      const fileCreatedTime = fileStats.ctimeMs;
      if (fileCreatedTime < tenMinutesAgo) {
        fs.unlinkSync(filePath);
        cnt++;
      }
    }
    Logger.log(`${mm} Deleted: ${cnt} temporary files`);
  }
}
