import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbSxja2seez2HOWTd6Ba08JSLpzL0YTGM",
  authDomain: "bus-app-ffdee.firebaseapp.com",
  projectId: "bus-app-ffdee",
  storageBucket: "bus-app-ffdee.appspot.com",
  messagingSenderId: "781649874616",
  appId: "1:781649874616:web:4c614af4c30e30035e6e4d"
};

// Initialize Firebase
let app;
let auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  // Initialize Firebase Authentication with AsyncStorage persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Realtime Database
// const db1 = getDatabase(app);

export { auth, storage, db };
