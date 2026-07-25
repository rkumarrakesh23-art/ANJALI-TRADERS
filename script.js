import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
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

const container = document.getElementById("product-list");

async function loadProducts() {

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "products"));

  snapshot.forEach((doc) => {

    const product = doc.data();

    container.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <a href="tel:8235093177" class="btn">📞 Call Now</a>
        <a href="https://wa.me/918235093177" class="btn">💬 WhatsApp</a>
      </div>
    `;

  });

}

loadProducts();
