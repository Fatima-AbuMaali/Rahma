import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDPLEdfCMZhdgmqKTFBmoJ18EeTOpNssyI",
  authDomain: "kiswa-161b6.firebaseapp.com",
  projectId: "kiswa-161b6",
  storageBucket: "kiswa-161b6.appspot.com",
  messagingSenderId: "328139468827",
  appId: "1:328139468827:web:ac710e6c1fd7555ca848be",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
