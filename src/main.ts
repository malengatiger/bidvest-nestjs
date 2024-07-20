import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FirebaseManager } from './services/firebase_manager';
import { Logger } from '@nestjs/common';
import { MyUtils } from './services/my-utils';
import { ErrorsInterceptor } from './middleware/errors.interceptor';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';
const mm = ' 🥝 🥝 🥝 Bidvest Backend  🍎';
console.log(`${mm} ... starting up ...`);

const firebaseManager: FirebaseManager = new FirebaseManager();
async function bootstrap() {
  Logger.log(`${mm} ... Bidvest Backend (NestJS) bootstrapping .....`);

  const nestApp = await NestFactory.create(AppModule);
  const port = MyUtils.getPort();
  Logger.log(`${mm} ... Bidvest Backend running on port : ${port} `);

  // app.use(helmet());
  nestApp.enableCors();
  await nestApp.listen(port);
  const app = initializeApp({
    credential: applicationDefault(),
  });

 Logger.log(`${mm} Firebase initialized; ${JSON.stringify(app.options)}`);
 const db = getFirestore();
  Logger.log(`${mm} Firestore initialized; ${db}`);
  const list = await db.listCollections();

  list.forEach((m) => {
    Logger.log(`${mm} Collection: 🥬 ${m.path}`)
  })
Logger.log(`${mm} Number of Firestore collections: ${list.length}`);
  // await firebaseManager.initializeFirebase();
  await firebaseManager.sendInitializationMessage();
  nestApp.useGlobalInterceptors(new ErrorsInterceptor());
  //
  // pingDatabase();
}
bootstrap().then((r) =>
  Logger.debug(`${mm} Bidvest Backend Bootstrapping is complete. 💖💖💖 ... Let's do this! ${r}`),
);