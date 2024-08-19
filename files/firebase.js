// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, getDoc,deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateEmail, sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider, } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDAR1WbLoQ_zfAoVKgOccMJpMBgyAOYXuk",
    authDomain: "blog-app-f6542.firebaseapp.com",
    projectId: "blog-app-f6542",
    storageBucket: "blog-app-f6542.appspot.com",
    messagingSenderId: "461718721230",
    appId: "1:461718721230:web:c07edf4b08b729d59b369f"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export {
    app,
    // authientation
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updateEmail,
    sendEmailVerification,
    reauthenticateWithCredential,
    EmailAuthProvider,
    //firestore
    db,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    doc,
    getDoc,
    deleteDoc,
    // storage
    storage,
    ref,
    uploadBytes,
    getDownloadURL
}