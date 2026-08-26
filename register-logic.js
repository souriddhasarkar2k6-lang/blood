import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAcC0hcVgY3RpMm6dPW6XiJbES3c4R7N0",
  authDomain: "loginsite-67.firebaseapp.com",
  projectId: "loginsite-67",
  storageBucket: "loginsite-67.firebasestorage.app",
  messagingSenderId: "312888450087",
  appId: "1:312888450087:web:ffe6fcd7b177f0911a0202",
  measurementId: "G-RZZ0FK89DK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const submitBtn = document.getElementById("submit");

  let currentUser = null;

  // Listen for authentication state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in.
      currentUser = user;
      document.querySelector(".container").style.display = "flex"; // Show form
    } else {
      // User is not signed in.
      // Redirect them to the login page as they shouldn't be here.
      alert("You must be logged in to register your details.");
      window.location.href = "index.html";
    }
  });

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!currentUser) {
        alert("No authenticated user found. Please log in again.");
        return;
      }

      // Disable button to prevent multiple submissions
      submitBtn.disabled = true;
      submitBtn.textContent = "Registering...";

      // Get form data
      const name = document.getElementById("name").value;
      const bloodGroup = document.getElementById("blood-group").value;
      const contact = document.getElementById("contact").value;
      const aadhar = document.getElementById("aadhar").value;
      const reportFile = document.getElementById("report").files[0];

      let reportURL = "";

      try {
        // 1. Upload file to Firebase Storage if it exists
        if (reportFile) {
          const storageRef = ref(storage, `reports/${currentUser.uid}/${reportFile.name}`);
          const uploadResult = await uploadBytes(storageRef, reportFile);
          reportURL = await getDownloadURL(uploadResult.ref);
        }

        // 2. Save user data to Firestore
        await setDoc(doc(db, "users", currentUser.uid), {
          name: name,
          bloodGroup: bloodGroup,
          contact: contact,
          aadhar: aadhar,
          reportURL: reportURL,
          email: currentUser.email, // Save email for reference
        });

        alert("Registration successful!");
        window.location.href = "home2.html"; // Redirect to the main page
      } catch (error) {
        console.error("Error during registration:", error);
        alert(`An error occurred: ${error.message}`);
        submitBtn.disabled = false;
        submitBtn.textContent = "Register";
      }
    });
  }
});