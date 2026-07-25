import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDRYU05VxRB3B2PIp2OPGOcoIkS6BH8Usc",
  authDomain: "anjali-traders-bc0e6.firebaseapp.com",
  projectId: "anjali-traders-bc0e6",
  storageBucket: "anjali-traders-bc0e6.firebasestorage.app",
  messagingSenderId: "17008156965",
  appId: "1:17008156965:web:51e29057d8da3a46f73acc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CLOUD_NAME = "ayr3jtsa";
const UPLOAD_PRESET = "anjali_traders_2026";
window.uploadProduct = async function () {

  const name = document.getElementById("productName").value.trim();
  const file = document.getElementById("productImage").files[0];

  if (!name || !file) {
    alert("Please enter product name and select an image.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {

    // Upload image to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error("Cloudinary upload failed");
    }

    const imageData = await response.json();

    // Save product to Firestore
    await addDoc(collection(db, "products"), {
      name: name,
      image: imageData.secure_url,
      createdAt: new Date()
    });

    alert("✅ Product uploaded successfully!");

    document.getElementById("productName").value = "";
    document.getElementById("productImage").value = "";

  } catch (error) {
    console.error(error);
    alert("❌ Upload failed: " + error.message);
  }

};
