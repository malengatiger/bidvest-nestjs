import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';
import { CreateRequest } from 'firebase-admin/lib/auth/auth-config';
import { FirestoreManager } from './firestore_manager';
const mm = '💦 💦 💦  UserManager  💦 ';
@Injectable()
export class UserManager {
  constructor(private readonly firestoreManager: FirestoreManager) {}
  private db: admin.firestore.Firestore;

  // Create a new user
  async createUser(user: User) {
    try {
      console.log(`${mm} ... creating user: ${JSON.stringify(user)}`); // Create user in Firebase Authentication
      if (!this.db) {
        this.db = admin.firestore();
      }
      const req: CreateRequest = {
        displayName: user.name,
        email: user.email,
        password: user.password,
      };
      //
      const userRec = await admin.auth().createUser(req);
      // Create user in Firestore
      if (userRec.uid) {
        user.userId = userRec.uid;
        console.log(
          `${mm} Auth User created successfully: 🥬 🥬 ${JSON.stringify(user)}`,
        );
      } else {
        console.error(
          `${mm} auth user creation failed: 👿👿👿 ${JSON.stringify(user)}`,
        );
        throw new Error(`Failed to create user.`);
      }
      const userRef = await this.firestoreManager.createDocument('Users', user);
      Logger.log(
        `${mm} Firestore User created successfully: ${JSON.stringify(userRef)}`,
      );
      return user;
    } catch (error) {
      console.error(`${mm} Error creating user:👿👿👿 `, error);
      throw new Error('Failed to create user.');
    }
  }

  // Get user by UID
  async getOrganizationUsers(organizationId: string): Promise<any[]> {
    try {
      // Get org users from Firestore
      if (!this.db) {
        this.db = admin.firestore();
      }
      const userDoc = await this.db
        .collection('Users')
        .where('organizationId' == organizationId)
        .get();

      const res = [];
      userDoc.docs.forEach((doc) => {
        res.push(doc.data);
      });
      return res;
    } catch (error) {
      console.error('Error getting users:', error);
      throw new Error('Failed to get users.');
    }
  }
  async getUserByEmail(email: string): Promise<any> {
    try {
      // Get user from Firestore
      if (!this.db) {
        this.db = admin.firestore();
      }
      const userDoc = await this.db
        .collection('Users')
        .where('email' == email)
        .limit(1)
        .get();
      if (userDoc.docs.length == 1) {
        return userDoc.docs[0].data;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Failed to get user.');
    }
  }
  async getUser(uid: string) {
    try {
      // Get user from Firestore
      if (!this.db) {
        this.db = admin.firestore();
      }
      const userRef = this.db.collection('Users').doc(uid);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        return userDoc.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Failed to get user.');
    }
  }
  async getAllUsers() {
    try {
      // Get user from Firestore
      if (!this.db) {
        this.db = admin.firestore();
      }
      const userRef = await this.db.collection('Users').get();
      const users = [];
      userRef.docs.forEach((doc) => {
        users.push(doc.data);
      });
    } catch (error) {
      console.error(`${mm} Error getting users 👿👿👿 :`, error);
      throw new Error('Failed to get user.');
    }
  }
  // Handle password forgotten scenario
  async sendPasswordResetEmail(email: string) {
    try {
      const link = await admin.auth().generatePasswordResetLink(email);
      Logger.log(`Password reset email sent to ${email} link: ${link}`);
      return link;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email.');
    }
  }
  // Update user information
  async updateUser(uid: string, data: any) {
    try {
      // Update user in Firestore
      if (!this.db) {
        this.db = admin.firestore();
      }
      const userRef = this.db.collection('Users').doc(uid);
      await userRef.update(data);

      // Update user in Firebase Authentication (optional)
      // You can update displayName, email, photoURL, etc.
      // await admin.auth().updateUser(uid, { displayName: data.displayName });

      return { message: 'User updated successfully' };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user.');
    }
  }

  // Delete user
  async deleteUser(uid: string) {
    try {
      // Delete user from Firestore
      if (!this.db) {
        this.db = admin.firestore();
      }
      const userRef = this.db.collection('Users').doc(uid);
      await userRef.delete();

      // Delete user from Firebase Authentication
      await admin.auth().deleteUser(uid);

      return { message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user.');
    }
  }
}
