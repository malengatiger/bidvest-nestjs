import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserManager } from 'src/services/user_manager';
import { Firestore } from 'firebase-admin/firestore';
import { FirestoreManager } from '../services/firestore_manager';

@Module({
  controllers: [UserController],
  providers: [UserService, UserManager, Firestore, FirestoreManager],
})
export class UserModule {}
