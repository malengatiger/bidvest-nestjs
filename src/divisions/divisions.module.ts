import { Module } from '@nestjs/common';
import { DivisionsService } from './divisions.service';
import { DivisionsController } from './divisions.controller';
import { FirestoreManager } from 'src/services/firestore_manager';

@Module({
  controllers: [DivisionsController],
  providers: [DivisionsService, FirestoreManager],
})
export class DivisionsModule {}
