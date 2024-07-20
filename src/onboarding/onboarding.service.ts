import { Injectable } from '@nestjs/common';
import { UserManager } from 'src/services/user_manager';
import * as csvParser from 'csv-parser'; // Import csv-parser
import { Readable } from 'stream';
import { FirestoreManager } from 'src/services/firestore_manager';
import { Firestore } from 'firebase-admin/firestore';
const mm = '🍀🍀🍀 OnboardingService';
@Injectable()
export class OnboardingService {
  constructor(private readonly firestore: FirestoreManager,
    private readonly userManager: UserManager) {}

  async addOrganization(organization: Organization) {
    try {
              console.log(
                `${mm} Organization to be added: 🥦 ${JSON.stringify(organization)}`,
              );

      const res = await this.firestore.createDocument('Organizations', organization);
      console.log(`${mm} Organization added successfully: ${JSON.stringify(organization)}`);
      return { message: `Organization added successfully: ${res}`};
    } catch (error) {
      console.error(' 👿 👿 👿 Error adding organization:', error);
      throw error;
    }
  }

  async addUser(user: User) {
    try {
      const mUser = await this.userManager.createUser(user);
      console.log(`${mm} User added successfully: ${JSON.stringify(mUser)}`);
      return mUser;
    } catch (error) {
      console.error('Error adding user:', error);
      throw new Error(`Error adding user: ${error}`);
    }
  }

  async addOrganizations(csvFile: File) {
    try {
        console.log(`${mm} adding organizations from csv file`);
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
          
          let count = 0;  for (const organization of organizations) {
            await this.addOrganization(organization);
            count++;
          }
          console.log(`${mm} organizations added successfully: ${count}}`);
          return { message: `${count} Organizations added successfully` };
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

  async addUsers(csvFile: File) {
    try {
      const users: User[] = [];
      const buffer = await csvFile.arrayBuffer(); // Get the ArrayBuffer
      const stream = Readable.from(Buffer.from(buffer)); // Create a Readable stream from the buffer
      const parser = csvParser({});
      stream
        .pipe(parser)
        .on('data', (row) => {
          users.push(row as User);
        })
        .on('end', async () => {
          let count = 0;
            for (const user of users) {
            await this.addUser(user);
            count++;
          }
          console.log(`${mm} users added successfully: ${count}}`);
          return { message: `${count} Users added successfully` };
        })
        .on('error', (error) => {
          console.error('Error parsing CSV:', error);
          throw error;
        });
    } catch (error) {
      console.error('Error adding users:', error);
      throw error;
    }
  }
}
