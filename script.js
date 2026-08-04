```javascript
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
// PRODUCT GALLERY DATA
// =====================================================

const productGallery = {};

let popupProductId = null;
let popupImageIndex = 0;


// =====================================================
// PRODUCT LOAD
// =====================================================

async function loadProducts() {

  const container = document.getElementById("product-list");

  if (!container) return;

container.innerHTML = '<p class="loading">Products Loading...</p>';

try {

    const snapshot = await getDocs(
      collection(db, "products")
    );

    if (snapshot.empty) {

   container.innerHTML = '<p>No products available.</p>';   

      return;
    }

    container.innerHTML = "";

    // Duplicate product रोकने के लिए
    const seenProducts = new Set();


    snapshot.forEach((docSnap) => {

      const product = docSnap.data();

      // =================================================
      // PRODUCT IMAGES
      // =================================================

      let images = [];

      if (Array.isArray(product.images)) {

        images = product.images.filter(
          img => img && typeof img === "string"
        );

      }

      // पुराने product में सिर्फ image field हो
      if (
        images.length === 0 &&
        product.image
      ) {

        images = [product.image];

      }


      if (images.length === 0) return;


      // Maximum 4 photos
      images = images.slice(0, 4);


      // =================================================
      // DUPLICATE PRODUCT CHECK
      // =================================================

      const uniqueKey = (product.name || "") + "-" + (product.brand || "") + "-" + (product.price || "") + "-" + (images[0] || "");


      if (seenProducts.has(uniqueKey)) {
        return;
      }

      seenProducts.add(uniqueKey);


      const productId = docSnap.id;

      // Gallery में images save
      productGallery[productId] = images;


      // =================================================
      // PRODUCT CARD
      // =================================================

      const card = document.createElement("div");

      card.className = "product-card";


      card.innerHTML = `


     card.innerHTML = `
  <div class="product-image-box">

    <img
      src="${images[0]}"
      class="product-main-image"
      id="product-image-${productId}"
      alt="${product.name || "ANJALI TRADERS Product"}"
    >

    ${
      images.length > 1
        ? `
          <button
            class="product-slide-btn product-prev"
            type="button"
            data-product="${productId}"
            data-direction="-1"
          >
            ‹
          </button>

          <button
            class="product-slide-btn product-next"
            type="button"
            data-product="${productId}"
            data-direction="1"
          >
            ›
          </button>
        `
        : ""
    }

    ${
      images.length > 1
        ? `
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
`;   


          <!-- PHOTO COUNT -->

          ${
            images.length > 1
              ? `
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


        <!-- =========================================
             PRODUCT THUMBNAILS
        ========================================== -->

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
                  >

                `).join("")}

              </div>
            `
            : ""
        }


        <!-- =========================================
             PRODUCT NAME
        ========================================== -->

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


        <!-- =========================================
             SAVE + WHATSAPP
        ========================================== -->

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
            class="order-btn"
          >
            💬 WhatsApp
          </a>

        </div>

      `;


      container.appendChild(card);


      // =================================================
      // PRODUCT IMAGE CLICK
      // =================================================

      const mainImage =
        card.querySelector(".product-main-image");


      if (mainImage) {

        mainImage.addEventListener(
          "click",
          () => {

            openProductGallery(
              productId,
              0
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
          function () {

            const productId =
              this.dataset.product;

            const direction =
              Number(this.dataset.direction);

            const currentImage =
              getCurrentProductIndex(productId);

            let newIndex =
              currentImage + direction;

            const images =
              productGallery[productId] || [];


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
    // THUMBNAIL CLICK
    // =================================================

    document
      .querySelectorAll(".product-thumbnail")
      .forEach(thumbnail => {

        thumbnail.addEventListener(
          "click",
          function () {

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
    // FRONT BANNER
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
// GET CURRENT PRODUCT IMAGE INDEX
// =====================================================

function getCurrentProductIndex(productId) {

  const image =
    document.getElementById(
      `product-image-${productId}`
    );

  const images =
    productGallery[productId] || [];


  if (!image) return 0;


  const index =
    images.indexOf(image.src);


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


  if (!images[index]) return;


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


  // Thumbnail active

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
// OPEN PRODUCT GALLERY
// =====================================================

function openProductGallery(
  productId,
  index = 0
) {

  const images =
    productGallery[productId] || [];


  if (images.length === 0) return;


  popupProductId = productId;

  popupImageIndex = index;


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


  if (!modal) return;


  // पहले से buttons हटाएं
  modal
    .querySelectorAll(
      ".popup-slide-btn"
    )
    .forEach(
      btn => btn.remove()
    );


  const images =
    productGallery[popupProductId] || [];


  if (images.length <= 1) return;


  // Previous button

  const prev =
    document.createElement(
      "button"
    );

  prev.className =
    "popup-slide-btn popup-prev";

  prev.innerHTML =
    "❮";


  // Next button

  const next =
    document.createElement(
      "button"
    );

  next.className =
    "popup-slide-btn popup-next";

  next.innerHTML =
    "❯";


  prev.onclick =
    function (e) {

      e.stopPropagation();

      popupImageIndex--;

      if (popupImageIndex < 0) {

        popupImageIndex =
          images.length - 1;

      }

      updatePopupImage();

    };


  next.onclick =
    function (e) {

      e.stopPropagation();

      popupImageIndex++;

      if (
        popupImageIndex >=
        images.length
      ) {

        popupImageIndex = 0;

      }

      updatePopupImage();

    };


  modal.appendChild(prev);
  modal.appendChild(next);

}


// =====================================================
// UPDATE POPUP IMAGE
// =====================================================

function updatePopupImage() {

  const images =
    productGallery[popupProductId] || [];


  const modalImage =
    document.getElementById(
      "modalImage"
    );


  if (!modalImage) return;


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


  if (!bannerImage) return;


  const allImages = [];


  snapshot.forEach(
    docSnap => {

      const product =
        docSnap.data();


      let images = [];


      if (
        Array.isArray(
          product.images
        )
      ) {

        images =
          product.images;

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


  // Maximum 4 banner photos

  const slideImages =
    allImages.slice(0, 4);


  let currentIndex = 0;


  bannerImage.src =
    slideImages[currentIndex];


  bannerImage.style.display =
    "block";


  // 3 second slider

  if (slideImages.length > 1) {

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

}


// =====================================================
// CLOSE POPUP
// =====================================================

const closeButton =
  document.querySelector(
    ".close"
  );


if (closeButton) {

  closeButton.onclick =
    function () {

      const modal =
        document.getElementById(
          "imageModal"
        );


      if (modal) {

        modal.style.display =
          "none";

      }

    };

}


// =====================================================
// CLOSE POPUP OUTSIDE IMAGE
// =====================================================

const imageModal =
  document.getElementById(
    "imageModal"
  );


if (imageModal) {

  imageModal.onclick =
    function (e) {

      if (
        e.target === imageModal
      ) {

        imageModal.style.display =
          "none";

      }

    };

}


// =====================================================
// SAVE PRODUCT
// =====================================================

window.saveProduct =
  async function (id) {

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

  };


// =====================================================
// START WEBSITE
// =====================================================

loadProducts();
```
