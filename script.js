
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// =====================================================
// FIREBASE
// =====================================================

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


// =====================================================
// GLOBAL DATA
// =====================================================

const productGallery = {};

let popupProductId = null;
let popupImageIndex = 0;


// =====================================================
// LOAD PRODUCTS
// =====================================================

async function loadProducts() {

  const container = document.getElementById("product-list");

  if (!container) {
    console.error("product-list नहीं मिला.");
    return;
  }

  container.innerHTML =
    '<p class="loading">Products Loading...</p>';

  try {

    const snapshot = await getDocs(
      collection(db, "products")
    );

    if (snapshot.empty) {

      container.innerHTML =
        "<p>No products available.</p>";

      return;
    }

    container.innerHTML = "";

    // Duplicate रोकने के लिए
    const seenProducts = new Set();


    snapshot.forEach((docSnap) => {

      const product = docSnap.data();

      const productId = docSnap.id;


      // =================================================
      // IMAGES
      // =================================================

      let images = [];

      if (Array.isArray(product.images)) {

        images = product.images.filter(
          img =>
            img &&
            typeof img === "string"
        );

      }

      // पुराने product में सिर्फ image field हो
      if (
        images.length === 0 &&
        product.image
      ) {

        images = [product.image];

      }


      // Maximum 4 images
      images = images.slice(0, 4);


      // Image नहीं है तो product skip
      if (images.length === 0) {
        return;
      }


      // =================================================
      // DUPLICATE CHECK
      // =================================================

      const uniqueKey =
        String(product.name || "").trim().toLowerCase() +
        "-" +
        String(product.brand || "").trim().toLowerCase() +
        "-" +
        String(product.price || "").trim() +
        "-" +
        String(images[0] || "").trim();


      if (seenProducts.has(uniqueKey)) {

        console.log(
          "Duplicate product skipped:",
          product.name
        );

        return;
      }


      seenProducts.add(uniqueKey);


      // Gallery data
      productGallery[productId] = images;


      // =================================================
      // PRODUCT CARD
      // =================================================

      const card =
        document.createElement("div");

      card.className =
        "product-card";


      card.innerHTML = `

        <!-- PRODUCT IMAGE -->

        <div class="product-image-box">

          <img
            src="${images[0]}"
            class="product-main-image"
            id="product-image-${productId}"
            alt="${product.name || "ANJALI TRADERS Product"}"
            loading="lazy"
          >

          ${
            images.length > 1
              ? `
                <button
                  class="product-slide-btn product-prev"
                  type="button"
                  data-product="${productId}"
                  data-direction="-1"
                  aria-label="Previous image"
                >
                  ‹
                </button>

                <button
                  class="product-slide-btn product-next"
                  type="button"
                  data-product="${productId}"
                  data-direction="1"
                  aria-label="Next image"
                >
                  ›
                </button>

                <div
                  class="product-photo-count"
                  id="photo-count-${productId}"
                >
                  1 / ${images.length}
                </div>
              `
              : ""
          }

        </div>


        <!-- THUMBNAILS -->

        ${
          images.length > 1
            ? `
              <div
                class="product-thumbnails"
                id="thumbnails-${productId}"
              >

                ${images.map((img, index) => `

                  <img
                    src="${img}"
                    class="product-thumbnail ${
                      index === 0 ? "active" : ""
                    }"
                    data-product="${productId}"
                    data-index="${index}"
                    alt="Product photo ${index + 1}"
                    loading="lazy"
                  >

                `).join("")}

              </div>
            `
            : ""
        }


        <!-- PRODUCT NAME -->

        <h3>
          ${product.name || "Electric Vehicle"}
        </h3>


        <!-- BRAND -->

        ${
          product.brand
            ? `
              <p class="product-brand">
                <strong>Brand:</strong>
                ${product.brand}
              </p>
            `
            : ""
        }


        <!-- PRICE -->

        <p class="price">
          ${
            product.price
              ? `₹${product.price}`
              : "Contact for Price"
          }
        </p>


        <!-- DESCRIPTION -->

        ${
          product.description
            ? `
              <p class="description">
                ${product.description}
              </p>
            `
            : ""
        }


        <!-- OFFER -->

        ${
          product.offer
            ? `
              <p class="offer">
                ${product.offer}
              </p>
            `
            : ""
        }


        <!-- ACTIONS -->

        <div class="product-actions">

          <button
            type="button"
            class="save-product-btn"
            data-product-id="${productId}"
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
            rel="noopener noreferrer"
            class="order-btn"
          >
            💬 WhatsApp
          </a>

        </div>

      `;


      container.appendChild(card);


      // =================================================
      // MAIN IMAGE CLICK
      // =================================================

      const mainImage =
        card.querySelector(".product-main-image");


      if (mainImage) {

        mainImage.addEventListener(
          "click",
          () => {

            const currentIndex =
              getCurrentProductIndex(productId);

            openProductGallery(
              productId,
              currentIndex
            );

          }
        );

      }

    });


    // =================================================
    // SLIDER BUTTONS
    // =================================================

    document
      .querySelectorAll(".product-slide-btn")
      .forEach(button => {

        button.addEventListener(
          "click",
          function (event) {

            event.stopPropagation();

            const productId =
              this.dataset.product;

            const direction =
              Number(this.dataset.direction);

            const currentIndex =
              getCurrentProductIndex(productId);

            const images =
              productGallery[productId] || [];

            if (images.length === 0) {
              return;
            }

            let newIndex =
              currentIndex + direction;


            if (newIndex >= images.length) {
              newIndex = 0;
            }


            if (newIndex < 0) {
              newIndex = images.length - 1;
            }


            changeProductImage(
              productId,
              newIndex
            );

          }
        );

      });


    // =================================================
    // THUMBNAILS
    // =================================================

    document
      .querySelectorAll(".product-thumbnail")
      .forEach(thumbnail => {

        thumbnail.addEventListener(
          "click",
          function (event) {

            event.stopPropagation();

            const productId =
              this.dataset.product;

            const index =
              Number(this.dataset.index);


            changeProductImage(
              productId,
              index
            );

          }
        );

      });


    // =================================================
    // SAVE BUTTON
    // =================================================

    document
      .querySelectorAll(".save-product-btn")
      .forEach(button => {

        button.addEventListener(
          "click",
          function () {

            saveProduct(
              this.dataset.productId
            );

          }
        );

      });


    // =================================================
    // BANNER
    // =================================================

    setRandomFrontImage(snapshot);


  } catch (error) {

    console.error(
      "PRODUCT ERROR:",
      error
    );


    container.innerHTML = `
      <p>
        ❌ Products load nahi ho rahe.
        Please try again.
      </p>
    `;

  }

}


// =====================================================
// CURRENT IMAGE INDEX
// =====================================================

function getCurrentProductIndex(productId) {

  const image =
    document.getElementById(
      `product-image-${productId}`
    );

  const images =
    productGallery[productId] || [];


  if (!image || images.length === 0) {
    return 0;
  }


  // URL को normalize करके compare करना
  const currentSrc =
    image.src;


  const index =
    images.findIndex(
      img => {

        try {

          return new URL(
            img,
            window.location.href
          ).href === currentSrc;

        } catch {

          return img === currentSrc;

        }

      }
    );


  return index >= 0 ? index : 0;

}


// =====================================================
// CHANGE PRODUCT IMAGE
// =====================================================

function changeProductImage(
  productId,
  index
) {

  const images =
    productGallery[productId] || [];


  if (!images[index]) {
    return;
  }


  const mainImage =
    document.getElementById(
      `product-image-${productId}`
    );


  if (mainImage) {

    mainImage.src =
      images[index];

  }


  // Photo count

  const count =
    document.getElementById(
      `photo-count-${productId}`
    );


  if (count) {

    count.textContent =
      `${index + 1} / ${images.length}`;

  }


  // Active thumbnail

  const thumbnails =
    document.querySelectorAll(
      `.product-thumbnail[data-product="${productId}"]`
    );


  thumbnails.forEach(
    thumb => {

      thumb.classList.remove(
        "active"
      );

    }
  );


  const activeThumbnail =
    document.querySelector(
      `.product-thumbnail[data-product="${productId}"][data-index="${index}"]`
    );


  if (activeThumbnail) {

    activeThumbnail.classList.add(
      "active"
    );

  }

}


// =====================================================
// OPEN FULL IMAGE POPUP
// =====================================================

function openProductGallery(
  productId,
  index = 0
) {

  const images =
    productGallery[productId] || [];


  if (images.length === 0) {
    return;
  }


  popupProductId =
    productId;

  popupImageIndex =
    index;


  const modal =
    document.getElementById(
      "imageModal"
    );


  const modalImage =
    document.getElementById(
      "modalImage"
    );


  if (!modal || !modalImage) {

    console.error(
      "imageModal या modalImage HTML में नहीं मिला."
    );

    return;
  }


  modalImage.src =
    images[popupImageIndex];


  modal.style.display =
    "flex";


  setupPopupButtons();

}


// =====================================================
// POPUP BUTTONS
// =====================================================

function setupPopupButtons() {

  const modal =
    document.getElementById(
      "imageModal"
    );


  if (!modal) {
    return;
  }


  // पुराने buttons हटाओ

  modal
    .querySelectorAll(
      ".popup-slide-btn"
    )
    .forEach(
      btn => btn.remove()
    );


  const images =
    productGallery[popupProductId] || [];


  if (images.length <= 1) {
    return;
  }


  // Previous

  const prev =
    document.createElement(
      "button"
    );

  prev.className =
    "popup-slide-btn popup-prev";

  prev.type =
    "button";

  prev.innerHTML =
    "❮";


  // Next

  const next =
    document.createElement(
      "button"
    );

  next.className =
    "popup-slide-btn popup-next";

  next.type =
    "button";

  next.innerHTML =
    "❯";


  prev.addEventListener(
    "click",
    function (event) {

      event.stopPropagation();

      popupImageIndex--;

      if (popupImageIndex < 0) {

        popupImageIndex =
          images.length - 1;

      }

      updatePopupImage();

    }
  );


  next.addEventListener(
    "click",
    function (event) {

      event.stopPropagation();

      popupImageIndex++;

      if (
        popupImageIndex >=
        images.length
      ) {

        popupImageIndex = 0;

      }

      updatePopupImage();

    }
  );


  modal.appendChild(prev);
  modal.appendChild(next);

}


// =====================================================
// UPDATE POPUP
// =====================================================

function updatePopupImage() {

  const images =
    productGallery[popupProductId] || [];


  const modalImage =
    document.getElementById(
      "modalImage"
    );


  if (!modalImage || !images.length) {
    return;
  }


  modalImage.src =
    images[popupImageIndex];

}


// =====================================================
// BANNER SLIDER
// =====================================================

function setRandomFrontImage(
  snapshot
) {

  const bannerImage =
    document.getElementById(
      "bannerImage"
    );


  if (!bannerImage) {
    return;
  }


  const allImages = [];


  snapshot.forEach(
    docSnap => {

      const product =
        docSnap.data();


      let images = [];


      if (
        Array.isArray(product.images)
      ) {

        images =
          product.images.filter(
            img =>
              img &&
              typeof img === "string"
          );

      }


      if (
        images.length === 0 &&
        product.image
      ) {

        images = [
          product.image
        ];

      }


      images.forEach(
        img => {

          if (
            img &&
            !allImages.includes(img)
          ) {

            allImages.push(img);

          }

        }
      );

    }
  );


  if (allImages.length === 0) {

    bannerImage.style.display =
      "none";

    return;
  }


  // Maximum 4 banner images

  const slideImages =
    allImages.slice(0, 4);


  let currentIndex = 0;


  bannerImage.src =
    slideImages[currentIndex];

  bannerImage.style.display =
    "block";

  bannerImage.style.opacity =
    "1";

  bannerImage.style.transition =
    "opacity 0.4s ease";


  if (slideImages.length <= 1) {
    return;
  }


  // 3 second slider

  setInterval(
    () => {

      bannerImage.style.opacity =
        "0";


      setTimeout(
        () => {

          currentIndex++;


          if (
            currentIndex >=
            slideImages.length
          ) {

            currentIndex = 0;

          }


          bannerImage.src =
            slideImages[currentIndex];


          bannerImage.style.opacity =
            "1";

        },
        400
      );

    },
    3000
  );

}


// =====================================================
// CLOSE POPUP
// =====================================================

function closeImageModal() {

  const modal =
    document.getElementById(
      "imageModal"
    );


  if (modal) {

    modal.style.display =
      "none";

  }


  popupProductId =
    null;

  popupImageIndex =
    0;

}


// =====================================================
// CLOSE BUTTON
// =====================================================

const closeButton =
  document.querySelector(
    ".close"
  );


if (closeButton) {

  closeButton.addEventListener(
    "click",
    closeImageModal
  );

}


// =====================================================
// CLOSE OUTSIDE IMAGE
// =====================================================

const imageModal =
  document.getElementById(
    "imageModal"
  );


if (imageModal) {

  imageModal.addEventListener(
    "click",
    function (event) {

      if (
        event.target === imageModal
      ) {

        closeImageModal();

      }

    }
  );

}


// =====================================================
// ESC KEY
// =====================================================

document.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Escape") {

      closeImageModal();

    }

  }
);


// =====================================================
// SAVE PRODUCT
// =====================================================

function saveProduct(id) {

  try {

    let saved =
      JSON.parse(
        localStorage.getItem(
          "anjaliSavedProducts"
        ) || "[]"
      );


    if (saved.includes(id)) {

      alert(
        "⭐ Product already saved hai."
      );

      return;
    }


    saved.push(id);


    localStorage.setItem(
      "anjaliSavedProducts",
      JSON.stringify(saved)
    );


    alert(
      "✅ Product Save ho gaya."
    );


  } catch (error) {

    console.error(
      "Save Error:",
      error
    );


    alert(
      "❌ Product save nahi hua."
    );

  }

}


// =====================================================
// START WEBSITE
// =====================================================

loadProducts();
