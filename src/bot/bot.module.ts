import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { FirestoreManager } from 'src/services/firestore_manager';
import { CloudStorageService } from 'src/services/cloud_storage_service';

@Module({
  controllers: [BotController],
  providers: [BotService, FirestoreManager, CloudStorageService],
})
export class BotModule {}
