import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { FirestoreManager } from 'src/services/firestore_manager';
import { UserManager } from 'src/services/user_manager';
import { Firestore } from 'firebase-admin/firestore';

@Module({
  controllers: [OnboardingController],
  providers: [OnboardingService, FirestoreManager, UserManager, Firestore],
})
export class OnboardingModule {}
