// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjNCMSkUrlQk1xizlJrWvsmz3hCBDUJL8",
  authDomain: "connectzone-50325.firebaseapp.com",
  projectId: "connectzone-50325",
  storageBucket: "connectzone-50325.appspot.com",
  messagingSenderId: "420207508596",
  appId: "1:420207508596:web:18ad639a26fde86de1e521",
  measurementId: "G-Z8EF2J11JJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export default auth;