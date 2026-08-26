// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-analytics.js";
  import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
  } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
  import {
    getFirestore,
    doc,
    getDoc,
  } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
    // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  
  const _analytics = getAnalytics(app);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const googleProvider = new GoogleAuthProvider();

  // On successful login, redirect to the success page.
  const redirectToSuccess = () => (window.location.href = "success.html");

  // Function to handle Google Sign-In
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      redirectToSuccess();
    } catch (error) {
      console.error("Google sign in error:", error);
      // Don't show an alert if the user closes the popup.
      if (error.code !== 'auth/popup-closed-by-user') {
        alert(`Google sign in failed: ${error.message}`);
      }
    }
  };

  // Function to send the magic link
  const sendMagicLink = async (email) => {
    const actionCodeSettings = {
      url: window.location.href, // Redirect back to the same page to complete sign-in
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      alert(`A sign-in link has been sent to ${email}. Please check your inbox.`);
    } catch (error) {
      console.error("Magic link error:", error);
      alert(`Error sending link: ${error.message}`);
    }
  };

  // Logic to handle sign-in completion when the user clicks the link
  const handleSignIn = async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device.
        email = window.prompt('Please provide your email for confirmation');
      }
      try {
        const result = await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        redirectToSuccess();
      } catch (error) {
        console.error("Magic link sign in error:", error);
        alert(`Error signing in: ${error.message}`);
      }
    }
  };

  // Run the sign-in handler on page load
  handleSignIn();

  // Event listener for the Google login button
  const googleLoginBtn = document.getElementById('google-login-btn');
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", signInWithGoogle);
  }

  // Event listener for the submit button (Email/Password Sign In)
  const submit = document.getElementById('submit');
  submit.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    sendMagicLink(email);
  });