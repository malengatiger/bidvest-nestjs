import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [UserModule, OnboardingModule, OrganizationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
