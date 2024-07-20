import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { FirestoreManager } from 'src/services/firestore_manager';
import { Firestore } from 'firebase-admin/firestore';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService, FirestoreManager, Firestore],
})
export class OrganizationsModule {}
