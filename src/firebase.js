// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZONBJkuh6HeQWVqyORRrh9Ph7Mol0Vu8",
  authDomain: "react-chat-app-278eb.firebaseapp.com",
  databaseURL: "https://react-chat-app-278eb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "react-chat-app-278eb",
  storageBucket: "react-chat-app-278eb.appspot.com",
  messagingSenderId: "895107984331",
  appId: "1:895107984331:web:06f05713855ca4d3eea44e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

export default app;
