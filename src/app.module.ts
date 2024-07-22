import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { BrandingModule } from './branding/branding.module';

@Module({
  imports: [UserModule, OnboardingModule, OrganizationsModule, BrandingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
