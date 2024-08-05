import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { FirestoreManager } from 'src/services/firestore_manager';

@Module({
  controllers: [SurveysController],
  providers: [SurveysService, FirestoreManager],
})
export class SurveysModule {}
