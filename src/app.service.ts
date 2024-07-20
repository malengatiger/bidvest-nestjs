import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `🍎 🍎 🍎 Bidvest Backend pinged at  🍎 ${new Date().toISOString()}`;
  }
}
