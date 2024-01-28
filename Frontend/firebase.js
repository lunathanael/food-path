// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjYzQ8JfadVxf6llSikhjiEfpX-Lbg4iQ",
  authDomain: "food-path-24322.firebaseapp.com",
  databaseURL: "https://food-path-24322-default-rtdb.firebaseio.com",
  projectId: "food-path-24322",
  storageBucket: "food-path-24322.appspot.com",
  messagingSenderId: "1084147699802",
  appId: "1:1084147699802:web:f1e97a8fac6b203d16c863",
  measurementId: "G-8QL9VFEXW9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export {app}