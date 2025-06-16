import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { firebaseConfig } from './firebasecr.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Function to sign in with Google
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log('User signed in: ', user);
        return user;
    } catch (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error('Error signing in: ', errorCode, errorMessage);
        return null;
    }
}

// Function to sign out
export async function signOutUser() {
    try {
        await signOut(auth);
        console.log('User signed out');
        return true;
    } catch (error) {
        console.error('Error signing out: ', error);
        return false;
    }
}

// Function to check auth state
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}