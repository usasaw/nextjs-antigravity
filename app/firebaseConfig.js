// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
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

// Initialize Analytics only on the client side
let analytics;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth, analytics };