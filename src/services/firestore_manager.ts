import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
const mm = '🔴 🔴 🔴 FirestoreManager 🔴 ';
@Injectable()
export class FirestoreManager {
  private db: admin.firestore.Firestore;

  // constructor(private readonly firestore: admin.firestore.Firestore) {
  //   // Initialize Firestore database
  //   this.db = firestore;
  //   console.log(`${mm} Firestore database initialized: {this.db.databaseId}`);
  // }

  // Get a document by ID
  async getDocument(collectionName: string, documentId: string) {
    if (!this.db) {
      this.db = admin.firestore();
    }
    const docRef = this.db.collection(collectionName).doc(documentId);
    const doc = await docRef.get();
    if (doc.exists) {
      return doc.data();
    } else {
      return null;
    }
  }

  // Create a new document
  async createDocument(collectionName: string, data: any) {
    try {
      console.log(
        `${mm} ... creating document, collection: ${collectionName} 
        🥝 data:${JSON.stringify(data)}`,
      );
       if (!this.db) {
         this.db = admin.firestore();
       }
      const mx = this.db.collection(collectionName);
      const res = await mx.add(data);
      console.log(`${mm} document created successfully: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      console.error(`${mm} Error creating document:`, error);
      throw new Error(`Failed to create Firestore document: ${error}`);
    }
  }

  // Update a document
  async updateDocument(collectionName: string, documentId: string, data: any) {
    const docRef = this.db.collection(collectionName).doc(documentId);
    await docRef.update(data);
  }

  // Delete a document
  async deleteDocument(collectionName: string, documentId: string) {
    const docRef = this.db.collection(collectionName).doc(documentId);
    await docRef.delete();
  }

  // Get all documents in a collection
  async getAllDocuments(collectionName: string): Promise<any[]> {
    const querySnapshot = await this.db.collection(collectionName).get();
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents;
  }

  // Get documents matching a query
  async getDocumentsByQuery(
    collectionName: string,
    query: admin.firestore.Query,
  ): Promise<any[]> {
    const querySnapshot = await query.get();
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents;
  }

  // Get documents matching a query with pagination
  async getDocumentsByQueryWithPagination(
    collectionName: string,
    query: admin.firestore.Query,
    pageSize: number,
    startAfter?: admin.firestore.DocumentSnapshot,
  ) {
    let querySnapshot;
    if (startAfter) {
      querySnapshot = await query.startAfter(startAfter).limit(pageSize).get();
    } else {
      querySnapshot = await query.limit(pageSize).get();
    }
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return {
      documents,
      lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
    };
  }

  // Get a document by ID with a specific field
  async getDocumentField(
    collectionName: string,
    documentId: string,
    fieldName: string,
  ) {
    const docRef = this.db.collection(collectionName).doc(documentId);
    const doc = await docRef.get();
    if (doc.exists) {
      return doc.data()[fieldName];
    } else {
      return null;
    }
  }

  // Get a document by ID with a specific field with a specific value
  async getDocumentByField(
    collectionName: string,
    fieldName: string,
    fieldValue: any,
  ) {
    const querySnapshot = await this.db
      .collection(collectionName)
      .where(fieldName, '==', fieldValue)
      .get();
    if (querySnapshot.empty) {
      return null;
    } else {
      return querySnapshot.docs[0].data();
    }
  }

  // Get a document by ID with a specific field with a specific value with pagination
  async getDocumentsByFieldWithPagination(
    collectionName: string,
    fieldName: string,
    fieldValue: any,
    pageSize: number,
    startAfter?: admin.firestore.DocumentSnapshot,
  ) {
    let querySnapshot;
    if (startAfter) {
      querySnapshot = await this.db
        .collection(collectionName)
        .where(fieldName, '==', fieldValue)
        .startAfter(startAfter)
        .limit(pageSize)
        .get();
    } else {
      querySnapshot = await this.db
        .collection(collectionName)
        .where(fieldName, '==', fieldValue)
        .limit(pageSize)
        .get();
    }
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return {
      documents,
      lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
    };
  }

  // Get a document by ID with a specific field with a specific value with pagination and ordering
  async getDocumentsByFieldWithPaginationAndOrdering(
    collectionName: string,
    fieldName: string,
    fieldValue: any,
    pageSize: number,
    orderByField: string,
    orderByDirection: 'asc' | 'desc',
    startAfter?: admin.firestore.DocumentSnapshot,
  ) {
    let querySnapshot;
    if (startAfter) {
      querySnapshot = await this.db
        .collection(collectionName)
        .where(fieldName, '==', fieldValue)
        .orderBy(orderByField, orderByDirection)
        .startAfter(startAfter)
        .limit(pageSize)
        .get();
    } else {
      querySnapshot = await this.db
        .collection(collectionName)
        .where(fieldName, '==', fieldValue)
        .orderBy(orderByField, orderByDirection)
        .limit(pageSize)
        .get();
    }
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return {
      documents,
      lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
    };
  }
}
