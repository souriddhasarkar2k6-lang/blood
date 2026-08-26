import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAcC0hcVgY3RpMm6dPW6XiJbES3c4R7N0",
    authDomain: "loginsite-67.firebaseapp.com",
    projectId: "loginsite-67",
    storageBucket: "loginsite-67.firebasestorage.app",
    messagingSenderId: "312888450087",
    appId: "1:312888450087:web:ffe6fcd7b177f0911a0202",
    measurementId: "G-RZZ0FK89DK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const profileContainer = document.getElementById('profile-container');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            profileContainer.style.display = 'block';
        } else {
            // User is signed out
            loginBtn.style.display = 'block';
            registerBtn.style.display = 'block';
            profileContainer.style.display = 'none';
        }
    });
});