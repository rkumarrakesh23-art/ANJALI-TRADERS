// ======================================================
// ANJALI TRADERS - COMPLETE SCRIPT.JS
// ======================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ======================================================
// FIREBASE CONFIG
// ======================================================

const firebaseConfig = {
    apiKey: "AIzaSyDRYU05VxRB3B2PIp2OPGOcoIkS6BH8Usc",
    authDomain: "anjali-traders-bc0e6.firebaseapp.com",
    projectId: "anjali-traders-bc0e6",
    storageBucket: "anjali-traders-bc0e6.appspot.com",
    messagingSenderId: "17008156965",
    appId: "1:17008156965:web:51e29057d8da3a46f73acc"
};


// ======================================================
// FIREBASE START
// ======================================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ======================================================
// GLOBAL
// ======================================================

let allProducts = [];


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

    loadBanner();

    setupImageModal();

    createSavedButton();

});


// ======================================================
// GET MAIN PRODUCT IMAGE
// ======================================================

function getProductImage(product) {

    if (
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {
        return product.images[0];
    }

    if (
        Array.isArray(product.photos) &&
        product.photos.length > 0
    ) {
        return product.photos[0];
    }

    if (product.image) {
        return product.image;
    }

    if (product.imageUrl) {
        return product.imageUrl;
    }

    if (product.photo) {
        return product.photo;
    }

    if (product.image1) {
        return product.image1;
    }

    return "";
}


// ======================================================
// GET ALL PRODUCT IMAGES
// ======================================================

function getProductImages(product) {

    let images = [];

    if (Array.isArray(product.images)) {
        images = [...product.images];
    }

    if (Array.isArray(product.photos)) {
        images.push(...product.photos);
    }

    if (product.image) {
        images.push(product.image);
    }

    if (product.imageUrl) {
        images.push(product.imageUrl);
    }

    if (product.image1) {
        images.push(product.image1);
    }

    if (product.image2) {
        images.push(product.image2);
    }

    if (product.image3) {
        images.push(product.image3);
    }

    if (product.image4) {
        images.push(product.image4);
    }

    return [
        ...new Set(
            images.filter(Boolean)
        )
    ];
}


// ======================================================
// LOAD PRODUCTS
// ======================================================

async function loadProducts() {

    const productList =
        document.getElementById("product-list");

    if (!productList) return;

    productList.innerHTML = `
        <p class="loading">
            Products Loading...
        </p>
    `;

    try {

        const snapshot =
            await getDocs(
                collection(db, "products")
            );

        allProducts = [];

        snapshot.forEach((docSnap) => {

            allProducts.push({
                id: docSnap.id,
                ...docSnap.data()
            });

        });


        console.log(
            "✅ Products Loaded:",
            allProducts
        );


        if (allProducts.length === 0) {

            productList.innerHTML = `
                <p>
                    अभी कोई Product उपलब्ध नहीं है।
                </p>
            `;

            return;
        }


        // ==================================================
        // FRONT PRODUCT
        // हर बार PAGE OPEN होने पर नया PRODUCT
        // ==================================================

        showRandomFrontProduct();


        // ==================================================
        // ALL PRODUCTS
        // ==================================================

        displayProducts(allProducts);


        // Saved count update

        updateSavedButton();


    }

    catch (error) {

        console.error(
            "❌ Product Loading Error:",
            error
        );

        productList.innerHTML = `
            <p style="color:red;">
                Products load नहीं हो पाए।
            </p>
        `;

    }

}


// ======================================================
// RANDOM FRONT PRODUCT
// ======================================================

function showRandomFrontProduct() {

    if (!allProducts.length) return;


    // Random product

    const randomIndex =
        Math.floor(
            Math.random() *
            allProducts.length
        );


    const product =
        allProducts[randomIndex];


    const image =
        getProductImage(product);


    if (!image) {

        console.log(
            "Front product image नहीं मिली"
        );

        return;
    }


    const hero =
        document.querySelector(".hero");


    if (!hero) return;


    // ==================================================
    // EXISTING PRODUCT IMAGE को HERO में लगाना
    // ==================================================

    hero.style.backgroundImage = `
        linear-gradient(
            rgba(0,0,0,0.25),
            rgba(0,0,0,0.25)
        ),
        url("${image}")
    `;

    hero.style.backgroundSize =
        "cover";

    hero.style.backgroundPosition =
        "center";

    hero.style.backgroundRepeat =
        "no-repeat";


    // ==================================================
    // FRONT PRODUCT NAME
    // ==================================================

    const heroContent =
        document.querySelector(
            ".hero-content"
        );


    if (!heroContent) return;


    const oldName =
        document.getElementById(
            "frontProductName"
        );


    if (oldName) {
        oldName.remove();
    }


    const productName =
        product.name ||
        product.productName ||
        product.title ||
        "ANJALI TRADERS";


    const nameElement =
        document.createElement("p");


    nameElement.id =
        "frontProductName";


    nameElement.innerHTML =
        `⭐ Featured Product: <strong>${productName}</strong>`;


    heroContent.appendChild(
        nameElement
    );


    console.log(
        "⭐ Front Product:",
        productName
    );

}


// ======================================================
// DISPLAY PRODUCTS
// ======================================================

function displayProducts(products) {

    const productList =
        document.getElementById(
            "product-list"
        );


    if (!productList) return;


    productList.innerHTML = "";


    if (!products.length) {

        productList.innerHTML = `
            <p>
                कोई Saved Product नहीं है।
            </p>
        `;

        return;
    }


    products.forEach((product) => {

        const card =
            createProductCard(product);

        productList.appendChild(card);

    });

}


// ======================================================
// CREATE PRODUCT CARD
// ======================================================

function createProductCard(product) {

    const card =
        document.createElement("div");


    card.className =
        "product-card";


    const images =
        getProductImages(product);


    const mainImage =
        images[0] || "";


    const name =
        product.name ||
        product.productName ||
        product.title ||
        "Electric Vehicle";


    const price =
        product.price ||
        product.amount ||
        "";


    const description =
        product.description ||
        product.details ||
        "";


    const saved =
        isProductSaved(product.id);


    card.innerHTML = `

        <div class="product-image-box">

            ${
                mainImage
                ?
                `
                <img
                    src="${mainImage}"
                    alt="${name}"
                    class="product-image"
                    loading="lazy"
                >
                `
                :
                `
                <div>
                    Product Image
                </div>
                `
            }

        </div>


        <div class="product-info">

            <h3>
                ${name}
            </h3>


            ${
                price
                ?
                `
                <p class="product-price">
                    ₹${price}
                </p>
                `
                :
                ""
            }


            ${
                description
                ?
                `
                <p class="product-description">
                    ${description}
                </p>
                `
                :
                ""
            }


            <div class="product-buttons">

                <button
                    class="save-product-btn"
                    type="button"
                >
                    ${
                        saved
                        ? "⭐ Saved"
                        : "☆ Save Product"
                    }
                </button>


                <a
                    href="https://wa.me/918235093177?text=${encodeURIComponent(
                        "मुझे " + name + " के बारे में जानकारी चाहिए।"
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="order-product-btn"
                >
                    💬 WhatsApp
                </a>

            </div>

        </div>

    `;


    // ==================================================
    // IMAGE POPUP
    // ==================================================

    const productImage =
        card.querySelector(
            ".product-image"
        );


    if (productImage) {

        productImage.addEventListener(
            "click",
            () => {

                openImageModal(
                    mainImage
                );

            }
        );

    }


    // ==================================================
    // SAVE BUTTON
    // ==================================================

    const saveButton =
        card.querySelector(
            ".save-product-btn"
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            () => {

                toggleSavedProduct(
                    product.id
                );


                const savedNow =
                    isProductSaved(
                        product.id
                    );


                saveButton.innerHTML =
                    savedNow
                    ? "⭐ Saved"
                    : "☆ Save Product";


                updateSavedButton();

            }
        );

    }


    return card;

}


// ======================================================
// SAVED PRODUCTS
// LOCAL STORAGE
// ======================================================

function getSavedProducts() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "anjaliSavedProducts"
            )
        ) || [];

    }

    catch {

        return [];

    }

}


// ======================================================
// CHECK SAVED
// ======================================================

function isProductSaved(id) {

    return getSavedProducts()
        .includes(id);

}


// ======================================================
// SAVE / REMOVE
// ======================================================

function toggleSavedProduct(id) {

    let saved =
        getSavedProducts();


    if (saved.includes(id)) {

        saved =
            saved.filter(
                item => item !== id
            );

    }

    else {

        saved.push(id);

    }


    localStorage.setItem(
        "anjaliSavedProducts",
        JSON.stringify(saved)
    );


    console.log(
        "⭐ Saved Products:",
        saved
    );

}


// ======================================================
// CREATE SAVED BUTTON
// ======================================================

function createSavedButton() {

    if (
        document.getElementById(
            "savedProductsButton"
        )
    ) {
        return;
    }


    const button =
        document.createElement("button");


    button.id =
        "savedProductsButton";


    button.type =
        "button";


    button.innerHTML =
        "⭐ Saved (0)";


    button.style.position =
        "fixed";

    button.style.right =
        "20px";

    button.style.bottom =
        "90px";

    button.style.zIndex =
        "9999";

    button.style.padding =
        "12px 16px";

    button.style.border =
        "none";

    button.style.borderRadius =
        "25px";

    button.style.cursor =
        "pointer";

    button.style.fontWeight =
        "600";


    button.addEventListener(
        "click",
        () => {

            showSavedProducts();

            document
                .getElementById(
                    "products"
                )
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


    document.body.appendChild(
        button
    );


    updateSavedButton();

}


// ======================================================
// UPDATE SAVED BUTTON
// ======================================================

function updateSavedButton() {

    const button =
        document.getElementById(
            "savedProductsButton"
        );


    if (!button) return;


    const count =
        getSavedProducts().length;


    button.innerHTML =
        `⭐ Saved (${count})`;

}


// ======================================================
// SHOW SAVED PRODUCTS
// ======================================================

function showSavedProducts() {

    const savedIds =
        getSavedProducts();


    const savedProducts =
        allProducts.filter(
            product =>
                savedIds.includes(
                    product.id
                )
        );


    displayProducts(
        savedProducts
    );


    console.log(
        "⭐ Showing Saved Products:",
        savedProducts
    );

}


// ======================================================
// LOAD BANNER
// ======================================================

async function loadBanner() {

    const bannerImage =
        document.getElementById(
            "bannerImage"
        );


    if (!bannerImage) return;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "banners"
                )
            );


        const banners = [];


        snapshot.forEach(
            (docSnap) => {

                const data =
                    docSnap.data();


                const image =
                    data.image ||
                    data.imageUrl ||
                    data.url;


                if (image) {

                    banners.push(
                        image
                    );

                }

            }
        );


        console.log(
            "✅ Banners Loaded:",
            banners
        );


        if (!banners.length) {

            console.log(
                "⚠️ No banner found."
            );

            return;

        }


        // ==================================================
        // RANDOM BANNER
        // PAGE OPEN होने पर एक banner
        // ==================================================

        const randomIndex =
            Math.floor(
                Math.random() *
                banners.length
            );


        bannerImage.src =
            banners[randomIndex];


        bannerImage.onerror =
            () => {

                console.error(
                    "❌ Banner image load नहीं हुई"
                );

            };


    }

    catch (error) {

        console.error(
            "❌ Banner Error:",
            error
        );

    }

}


// ======================================================
// IMAGE MODAL
// ======================================================

function setupImageModal() {

    const modal =
        document.getElementById(
            "imageModal"
        );


    const modalImage =
        document.getElementById(
            "modalImage"
        );


    const close =
        document.querySelector(
            ".close"
        );


    if (!modal) return;


    if (close) {

        close.addEventListener(
            "click",
            () => {

                modal.style.display =
                    "none";

            }
        );

    }


    modal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === modal
            ) {

                modal.style.display =
                    "none";

            }

        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                modal.style.display =
                    "none";

            }

        }
    );

}


// ======================================================
// OPEN IMAGE MODAL
// ======================================================

function openImageModal(image) {

    const modal =
        document.getElementById(
            "imageModal"
        );


    const modalImage =
        document.getElementById(
            "modalImage"
        );


    if (
        !modal ||
        !modalImage ||
        !image
    ) {
        return;
    }


    modalImage.src =
        image;


    modal.style.display =
        "flex";

}
