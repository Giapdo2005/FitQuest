 // Import the functions you need from the SDKs you need
 import { initializeApp } from "firebase/app";
 import { getAuth } from "firebase/auth";

 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
   apiKey: "AIzaSyDHmspqaGR9-Kk0H7RndIatzDqgGCFeF4k",
   authDomain: "fitquest-18781.firebaseapp.com",
   projectId: "fitquest-18781",
   storageBucket: "fitquest-18781.appspot.com",
   messagingSenderId: "791537601509",
   appId: "1:791537601509:web:bcf798eff90133fa04bd0c",
   measurementId: "G-4F2EY7PM4Y"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 
 export { app, auth };