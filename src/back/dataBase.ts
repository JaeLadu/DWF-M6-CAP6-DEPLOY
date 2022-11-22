const key = require("./dataBaseKey.json");
// import key from "./dataBaseKey.json";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";

const app = initializeApp({
   credential: cert(key),
   databaseURL: "https://dwf-mod6-cap6rooms-default-rtdb.firebaseio.com",
});

const rtdb = getDatabase(app);
const firestore = getFirestore(app);

export { rtdb, firestore };
