import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDRYU05VxRB3B2PIp2OPGOcoIkS6BH8Usc",
  authDomain: "anjali-traders-bc0e6.firebaseapp.com",
  projectId: "anjali-traders-bc0e6",
 storageBucket: "anjali-traders-bc0e6.appspot.com",
  messagingSenderId: "17008156965",
  appId: "1:17008156965:web:51e29057d8da3a46f73acc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const CLOUD_NAME = "ayr3jtsa";
const UPLOAD_PRESET = "anjali_traders_2026";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    const email = prompt("Enter Admin Email");
    const password = prompt("Enter Password");

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("✅ Login Successful");
      })
      .catch(() => {
        alert("❌ Wrong Email or Password");
        window.location.href = "index.html";
      });
  }
});

window.uploadProduct = async function () {

  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const brand = document.getElementById("productBrand").value;
  const description = document.getElementById("productDescription").value;
  const offer = document.getElementById("productOffer").value;

  const file = document.getElementById("image1").files[0];

  if (!name || !price || !brand || !description || !offer || !file) {
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
    offer,
    image: img.secure_url,
    createdAt: new Date()
  });

  alert("✅ Product Uploaded Successfully");

  location.reload();
};
// ==============================
// Load All Products
// ==============================

async function loadAdminProducts() {

  const container = document.getElementById("adminProducts");

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "products"));

  snapshot.forEach((docSnap) => {

    const product = docSnap.data();

    container.innerHTML += `
      <div class="product-card" style="margin:20px 0;padding:15px;">

        <img src="${product.image}" width="150">

        <h3>${product.name}</h3>

        <p>₹${product.price}</p>

        <p>${product.offer}</p>

        <button onclick="editProduct('${docSnap.id}')">
          ✏️ Edit
        </button>

        <button onclick="deleteProduct('${docSnap.id}')">
          🗑️ Delete
        </button>

      </div>
    `;

  });

}

loadAdminProducts();
// ==============================
// Delete Product
// ==============================

window.deleteProduct = async function(id) {

  const ok = confirm("Are you sure you want to delete this product?");

  if (!ok) return;

  await deleteDoc(doc(db, "products", id));

  alert("✅ Product Deleted");

  loadAdminProducts();
};
