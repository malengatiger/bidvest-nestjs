import { Injectable } from '@nestjs/common';
import { FirestoreManager } from './services/firestore_manager';

@Injectable()
export class AppService {
  constructor(private readonly firestore: FirestoreManager) {}
  getHello(): string {
    return `🍎 🍎 🍎 Bidvest Backend pinged at  🍎 ${new Date().toISOString()}`;
  }
  async getSystemErrors() : Promise<any> {
    const list = await this.firestore.getAllDocuments('SystemErrors');
    return list;
  }
}
