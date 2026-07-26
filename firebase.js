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

  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const brand = document.getElementById("productBrand").value;
  const description = document.getElementById("productDescription").value;

  const file = document.getElementById("image1").files[0];

  if (!name || !price || !brand || !description || !file) {
    alert("Please fill all fields.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  const img = await res.json();

  await addDoc(collection(db, "products"), {
    name,
    price,
    brand,
    description,
    image: img.secure_url,
    createdAt: new Date()
  });

  alert("✅ Product Uploaded Successfully");

  location.reload();

};
