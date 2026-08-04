import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ==============================
// FIREBASE
// ==============================

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


// ==============================
// PRODUCT LOAD
// ==============================

async function loadProducts() {

  const container = document.getElementById("product-list");

  if (!container) return;

  container.innerHTML = `
    <p class="loading">Products Loading...</p>
  `;

  try {

    const snapshot = await getDocs(
      collection(db, "products")
    );

    if (snapshot.empty) {
      container.innerHTML = `
        <p>No products available.</p>
      `;
      return;
    }

    container.innerHTML = "";

    // Duplicate product रोकने के लिए
    const seenProducts = new Set();

    snapshot.forEach((docSnap) => {

      const product = docSnap.data();

      const images =
        product.images ||
        (product.image ? [product.image] : []);

      if (images.length === 0) return;

      const mainImage = images[0];

      // Same product दो बार न दिखे
      const uniqueKey =
        `${product.name || ""}-${product.brand || ""}-${product.price || ""}-${mainImage}`;

      if (seenProducts.has(uniqueKey)) {
        return;
      }

      seenProducts.add(uniqueKey);


      container.innerHTML += `

        <div class="product-card">

          <!-- PRODUCT PHOTO -->
          <div class="product-image-box">

            <img
              src="${mainImage}"
              class="product-main-image"
              alt="${product.name || "ANJALI TRADERS Product"}"
              onclick="openProductImage('${mainImage}')"
            >

          </div>


          <!-- PRODUCT NAME -->
          <h3>
            ${product.name || "Electric Vehicle"}
          </h3>


          <!-- BRAND -->
          <p class="product-brand">
            <strong>Brand:</strong>
            ${product.brand || ""}
          </p>


          <!-- PRICE -->
          <p class="price">
            ₹${product.price || "Contact for Price"}
          </p>


          <!-- DESCRIPTION -->
          <p class="description">
            ${product.description || ""}
          </p>


          <!-- OFFER -->
          <p class="offer">
            ${product.offer || ""}
          </p>


          <!-- SAVE + WHATSAPP -->
          <div class="product-actions">

            <button
              onclick="saveProduct('${docSnap.id}')"
            >
              ⭐ Save
            </button>

            <a
              href="https://wa.me/918235093177?text=${encodeURIComponent(
                "Namaste ANJALI TRADERS, mujhe " +
                (product.name || "product") +
                " ke baare mein jankari chahiye."
              )}"
              target="_blank"
              class="order-btn"
            >
              💬 WhatsApp
            </a>

          </div>

        </div>

      `;

    });


    setRandomFrontImage(snapshot);


  } catch (error) {

    console.error("PRODUCT ERROR:", error);

    container.innerHTML = `
      <p>
        ❌ Products load nahi ho rahe.
        Please try again.
      </p>
    `;

} catch (error) {
  console.error("PRODUCT ERROR:", error);

  container.innerHTML = `
    <p>
      ❌ Products load nahi ho rahe.
      Please try again.
    </p>
  `;

}

}



function setRandomFrontImage(snapshot) {

  const bannerImage =
    document.getElementById("bannerImage");

  if (!bannerImage) return;


  const allImages = [];


  snapshot.forEach((docSnap) => {

    const product = docSnap.data();

    const images =
      product.images ||
      (product.image ? [product.image] : []);


    images.forEach((img) => {

      if (img) {
        allImages.push(img);
      }

    });

  });


  if (allImages.length === 0) {

    bannerImage.style.display = "none";

    return;
  }


  // Website open hone par
  // existing products ki images me se
  // ek random image select hogi

  const randomIndex =
    Math.floor(Math.random() * allImages.length);


  bannerImage.src =
    allImages[randomIndex];

  bannerImage.style.display =
    "block";

}


// ==============================
// IMAGE POPUP
// ==============================

window.openProductImage = function(imageUrl) {

  const modal =
    document.getElementById("imageModal");

  const modalImage =
    document.getElementById("modalImage");


  if (!modal || !modalImage) return;


  modalImage.src = imageUrl;

  modal.style.display = "flex";

};


// ==============================
// CLOSE IMAGE POPUP
// ==============================

const closeButton =
  document.querySelector(".close");


if (closeButton) {

  closeButton.onclick = function() {

    const modal =
      document.getElementById("imageModal");

    if (modal) {

      modal.style.display = "none";

    }

  };

}


// ==============================
// CLOSE POPUP OUTSIDE IMAGE
// ==============================

const imageModal =
  document.getElementById("imageModal");


if (imageModal) {

  imageModal.onclick = function(e) {

    if (e.target === imageModal) {

      imageModal.style.display = "none";

    }

  };

}


// ==============================
// SAVE PRODUCT
// ==============================

window.saveProduct = async function(id) {

  try {

    let saved =
      JSON.parse(
        localStorage.getItem("anjaliSavedProducts") || "[]"
      );


    if (saved.includes(id)) {

      alert("⭐ Product already saved hai.");

      return;

    }


    saved.push(id);


    localStorage.setItem(
      "anjaliSavedProducts",
      JSON.stringify(saved)
    );


    alert("✅ Product Save ho gaya.");

  } catch (error) {

    console.error("Save Error:", error);

    alert("❌ Product save nahi hua.");

  }

};


// ==============================
// START WEBSITE
// ==============================

loadProducts();
