import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { FirestoreManager } from 'src/services/firestore_manager';
import { Firestore } from 'firebase-admin/firestore';
import { CloudStorageService } from 'src/services/cloud_storage_service';
import { UserManager } from "src/services/user_manager";

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService, FirestoreManager, 
    UserManager,
    Firestore, CloudStorageService],
})
export class OrganizationsModule {}
