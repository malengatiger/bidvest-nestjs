import { Injectable } from '@nestjs/common';
import { FirestoreManager } from 'src/services/firestore_manager';
import * as csvParser from 'csv-parser'; // Import csv-parser
import { Readable } from 'stream';

const organizationsCollection = 'organizations';

@Injectable()
export class OrganizationsService {
  constructor(private readonly firestoreService: FirestoreManager) {}
  async getOrganization(id: string) {
    return await this.firestoreService.getDocument(
      organizationsCollection,
      id,
    );
  }
  async getOrganizations() {
    return await this.firestoreService.getAllDocuments(organizationsCollection);
  }
  async createOrganization(organization: Organization) {
    return await this.firestoreService.createDocument(
      organizationsCollection,
      organization,
    );
  }
  async createOrganizations(organization: Organization) {
    return await this.firestoreService.createDocument(
      organizationsCollection,
      organization,
    );
  }
  async addOrganizations(csvFile: File) {
    try {
      const organizations: Organization[] = [];
      const buffer = await csvFile.arrayBuffer(); // Get the ArrayBuffer
      const stream = Readable.from(Buffer.from(buffer)); // Create a Readable stream from the buffer
      const parser = csvParser({});
      stream
        .pipe(parser)
        .on('data', (row) => {
          organizations.push(row as Organization);
        })
        .on('end', async () => {
          for (const organization of organizations) {
            await this.firestoreService.createDocument(
              organizationsCollection,
              organization,
            );
          }
          return { message: 'Organizations added successfully' };
        })
        .on('error', (error) => {
          console.error('Error parsing CSV:', error);
          throw error;
        });
    } catch (error) {
      console.error('Error adding organizations:', error);
      throw error;
    }
  }
}
