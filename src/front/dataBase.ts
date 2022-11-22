import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
   apiKey: "AIzaSyDnxy4p6ot4z-3P-v-epmv21ar4vUZL74g",
   authDomain: "dwf-mod6-cap6rooms.firebaseapp.com",
   databaseURL: "https://dwf-mod6-cap6rooms-default-rtdb.firebaseio.com",
   projectId: "dwf-mod6-cap6rooms",
   storageBucket: "dwf-mod6-cap6rooms.appspot.com",
   messagingSenderId: "494850413381",
   appId: "1:494850413381:web:baf68eff1d41fd3459642c",
};

const app = initializeApp(firebaseConfig);

const rtdb = getDatabase(app);

export { rtdb };
