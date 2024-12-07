import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(() => {
    const firebaseConfig = {
        apiKey: "AIzaSyA23dhs5WYB8JtBgIJlYQ2VbriLB4S3ohg",
        authDomain: "habitsapp-ee559.firebaseapp.com",
        projectId: "habitsapp-ee559",
        storageBucket: "habitsapp-ee559.firebasestorage.app",
        messagingSenderId: "501445643290",
        appId: "1:501445643290:web:1d1dcff7bc8a0530d755a3"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    return {
        provide: {
            firebaseApp: app,
            db,
        }
    }
})