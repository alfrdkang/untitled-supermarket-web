// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvdvz0qRv2rjtaMX1Kzwo4SnAycl5_laQ",
  authDomain: "untitled-supermarket-simulator.firebaseapp.com",
  databaseURL: "https://untitled-supermarket-simulator-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "untitled-supermarket-simulator",
  storageBucket: "untitled-supermarket-simulator.firebasestorage.app",
  messagingSenderId: "1008548943648",
  appId: "1:1008548943648:web:99a254ccbcb262c62a2945"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app }