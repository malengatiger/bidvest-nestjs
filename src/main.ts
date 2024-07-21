import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { FirebaseManager } from "./services/firebase_manager";
import { Logger } from "@nestjs/common";
import { MyUtils } from "./services/my-utils";
import { ErrorsInterceptor } from "./middleware/errors.interceptor";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} from "firebase-admin/firestore";
const mm = "🥝 🥝 🥝 Bidvest Backend App 🍎";
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

  const cred = applicationDefault();
  const expiry = (await cred.getAccessToken()).expires_in;
  Logger.log(
    `${mm} Firebase initialized; expires in; 🔶🔶🔶 ${JSON.stringify(expiry)} days 🔶🔶🔶 `
  );
  
  const db = getFirestore();
  const list = await db.listCollections();

  list.forEach((m) => {
    Logger.log(`${mm} Collection name: 🥬 ${m.path}`);
  });
  Logger.log(`${mm} Number of Firestore collections: ${list.length}`);
  await firebaseManager.sendInitializationMessage();
  nestApp.useGlobalInterceptors(new ErrorsInterceptor());
}

bootstrap().then((r) =>
  Logger.log(
    `${mm} Bidvest Backend Bootstrapping is complete. 💖 💖 💖 ... Let's do this!!!`
  )
);
