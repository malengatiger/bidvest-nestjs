import { Injectable, Logger } from "@nestjs/common";
import * as admin from "firebase-admin";
import { Firestore } from "firebase-admin/firestore";
import { CreateRequest } from "firebase-admin/lib/auth/auth-config";
import { FirestoreManager } from "./firestore_manager";
import { BidvestUser, User } from "src/models/models";
const mm = "💦 💦 💦  UserManager  💦 ";
@Injectable()
export class UserManager {
  constructor(private readonly firestoreManager: FirestoreManager) {}
  private db: admin.firestore.Firestore;

  // Create a new user
  async createBidvestUser(user: BidvestUser): Promise<any> {
    try {
      console.log(`${mm} ... creating user: ${JSON.stringify(user)}`); // Create user in Firebase Authentication
      if (!this.db) {
        this.db = admin.firestore();
      }
      const u = await this.getBidvestUserByEmail(user.email);
      if (u) {
        throw new Error(`BidvestUser already exists: ${JSON.stringify(user)}`);
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
          `${mm} Auth User created successfully: 🥬 🥬 ${JSON.stringify(user)}`
        );
      } else {
        console.error(
          `${mm} auth user creation failed: 👿👿👿 ${JSON.stringify(user)}`
        );
        throw new Error(`Failed to create user.`);
      }
      const passwd = user.password;
      user.password = "";
      const userRef = await this.firestoreManager.createDocument(
        "BidvestUsers",
        user
      );
      Logger.log(
        `${mm} Firestore User created successfully: ${JSON.stringify(userRef)}`
      );
      user.password = passwd;
      return user;
    } catch (error) {
      console.error(`${mm} Error creating user:👿👿👿 `, error);
      throw new Error("Failed to create user.");
    }
  }
  async createUser(user: User): Promise<any> {
    try {
      console.log(`${mm} ... creating user: ${JSON.stringify(user)}`); // Create user in Firebase Authentication
      if (!this.db) {
        this.db = admin.firestore();
      }
      const u = await this.getUserByEmail(user.email);
      if (u) {
        throw new Error(`User already exists: ${JSON.stringify(user)}`);
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
          `${mm} Auth User created successfully: 🥬 🥬 ${JSON.stringify(user)}`
        );
      } else {
        console.error(
          `${mm} auth user creation failed: 👿👿👿 ${JSON.stringify(user)}`
        );
        throw new Error(`Failed to create user.`);
      }
      const passwd = user.password;
      user.password = "";
      const userRef = await this.firestoreManager.createDocument("Users", user);
      Logger.log(
        `${mm} Firestore User created successfully: ${JSON.stringify(userRef)}`
      );
      user.password = passwd;
      return user;
    } catch (error) {
      console.error(`${mm} Error creating user:👿👿👿 `, error);
      throw new Error("Failed to create user.");
    }
  }
  // Get user by UID
  async getOrganizationUsers(organizationId: string): Promise<any[]> {
    try {
      console.log(`${mm} ... getting org users: ${organizationId}`); // Get org users from Firestore
      if (!this.db) {
        this.db = admin.firestore();
      }
      const userDoc = await this.db
        .collection("Users")
        .where("organizationId", "==", organizationId)
        .get();

      const res = [];
      userDoc.docs.forEach((doc) => {
        res.push(doc.data());
      });
      return res;
    } catch (error) {
      console.error("Error getting users:", error);
      throw new Error("Failed to get users.");
    }
  }
  async addOrganizationUsers(jsonData: any[], organizationId: string) {
    Logger.debug(`${mm} addOrganizationUsers: ${JSON.stringify(jsonData)}`);
    Logger.debug(`${mm} organizationId: ${organizationId}`);
    let list = [];
    const org = await this.firestoreManager.getDocument(
      "Organizations",
      organizationId,
      "organizationId"
    );
    if (org) {
      Logger.debug(`${mm} ... we good, Boss! there IS an Organization! ???`);
    } else {
      Logger.debug(`${mm} organization not found?? : ${organizationId}`);
      throw new Error(`Organization does not exist`);
    }
    for (const j of jsonData) {
      j.date = new Date().toISOString();
      j.organizationId = organizationId;
      j.organizationName = org.name;
      const mUser = await this.getUserByEmail(j.email);
      Logger.debug(`${mm} user found by email? ${mUser.email}`);
      if (!mUser) {
        const user = await this.createUser(j);
        Logger.debug(`${mm} record processed: ${JSON.stringify(j)}`);
        list.push(user);
      } else {
        Logger.error(`${mm} user exists already: ${mUser.name}`);
      }
    }
    return list;
  }
  async getUserByEmail(email: string): Promise<any> {
    try {
      // Get user from Firestore
      if (!this.db) {
        this.db = admin.firestore();
      }
      const userDoc = await this.db
        .collection("Users")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (userDoc.docs.length > 0) {
        return userDoc.docs[0].data();
      } else {
        return null;
      }
    } catch (error) {
      Logger.error("Error getting user:", error);
      throw new Error("Failed to get user.");
    }
  }
  async getBidvestUserByEmail(email: string): Promise<any> {
    try {
      // Get user from Firestore
      if (!this.db) {
        this.db = admin.firestore();
      }
      const userDoc = await this.db
        .collection("BidvestUsers")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (userDoc.docs.length > 0) {
        return userDoc.docs[0].data();
      } else {
        return null;
      }
    } catch (error) {
      Logger.error("Error getting user:", error);
      throw new Error("Failed to get user.");
    }
  }
  async getUser(uid: string): Promise<any> {
    try {
      // Get user from Firestore
      if (!this.db) {
        this.db = admin.firestore();
      }
      const userRef = this.db.collection("Users").doc(uid);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        return userDoc.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting user:", error);
      throw new Error("Failed to get user.");
    }
  }
  async getAllUsers(): Promise<any> {
    try {
      // Get user from Firestore
      if (!this.db) {
        this.db = admin.firestore();
      }
      const userRef = await this.db.collection("Users").get();
      const users = [];
      userRef.docs.forEach((doc) => {
        users.push(doc.data);
      });
    } catch (error) {
      console.error(`${mm} Error getting users 👿👿👿 :`, error);
      throw new Error("Failed to get user.");
    }
  }
  // Handle password forgotten scenario
  async sendPasswordResetEmail(email: string): Promise<any> {
    try {
      const link = await admin.auth().generatePasswordResetLink(email);
      Logger.log(`Password reset email sent to ${email} link: ${link}`);
      return link;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email.");
    }
  }
  // Update user information
  async updateUser(uid: string, data: any) {
    try {
      // Update user in Firestore
      if (!this.db) {
        this.db = admin.firestore();
      }
      const userRef = this.db.collection("Users").doc(uid);
      await userRef.update(data);

      // Update user in Firebase Authentication (optional)
      // You can update displayName, email, photoURL, etc.
      // await admin.auth().updateUser(uid, { displayName: data.displayName });

      return { message: "User updated successfully" };
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user.");
    }
  }

  // Delete user
  async deleteUser(uid: string) {
    try {
      // Delete user from Firestore
      if (!this.db) {
        this.db = admin.firestore();
      }
      const userRef = this.db.collection("Users").doc(uid);
      await userRef.delete();

      // Delete user from Firebase Authentication
      await admin.auth().deleteUser(uid);

      return { message: "User deleted successfully" };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user.");
    }
  }
}
