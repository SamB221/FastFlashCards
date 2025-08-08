import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBMPddnAt0fnCm1NXaeutBUFwdE80aLJmo",
    authDomain: "fastflashcardsdev.firebaseapp.com",
    projectId: "fastflashcardsdev",
    storageBucket: "fastflashcardsdev.firebasestorage.app",
    messagingSenderId: "913164313802",
    appId: "1:913164313802:web:379016d687202b80c38033"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);