import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { BrandingModule } from './branding/branding.module';
import { DivisionsModule } from './divisions/divisions.module';

@Module({
  imports: [UserModule, OnboardingModule, OrganizationsModule, BrandingModule, DivisionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
