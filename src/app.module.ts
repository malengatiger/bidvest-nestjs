import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { BrandingModule } from './branding/branding.module';
import { DivisionsModule } from './divisions/divisions.module';
import { ElapsedTimeMiddleware } from './middleware/elapsed.middleware';
import { FirestoreManager } from './services/firestore_manager';
import { FirebaseManager } from './services/firebase_manager';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ConfigModule } from '@nestjs/config';
import { SurveysModule } from './surveys/surveys.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    OnboardingModule,
    OrganizationsModule,
    BrandingModule,
    DivisionsModule,
    SurveysModule,
    BotModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirestoreManager, FirebaseManager],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ElapsedTimeMiddleware).forRoutes("*");
    consumer.apply(AuthMiddleware).forRoutes("*");
  }
}
