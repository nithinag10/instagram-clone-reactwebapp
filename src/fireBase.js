import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBTxtJWdy9V0GbWCyoHBn52hEGbHCoLJ5c",
  authDomain: "instagram-clone-react-b0b2b.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-b0b2b.firebaseio.com",
  projectId: "instagram-clone-react-b0b2b",
  storageBucket: "instagram-clone-react-b0b2b.appspot.com",
  messagingSenderId: "809106393278",
  appId: "1:809106393278:web:3e89db6065a8185d5976ef",
  measurementId: "G-RFFRVQ4RNH",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const baseDb = firebaseApp.firestore();
const db = baseDb;
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
