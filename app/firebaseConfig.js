// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCQx1cO24BK-ADYFlEmowAr9t8BevXnOcM",
    authDomain: "nextjsantigravity.firebaseapp.com",
    databaseURL: "https://nextjsantigravity-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nextjsantigravity",
    storageBucket: "nextjsantigravity.firebasestorage.app",
    messagingSenderId: "563496378902",
    appId: "1:563496378902:web:806343711ee8cf99920b37",
    measurementId: "G-RT9HR9LKBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);