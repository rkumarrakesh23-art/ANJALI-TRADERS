// ======================================================
// ANJALI TRADERS - COMPLETE SCRIPT.JS
// ======================================================

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


// ======================================================
// FIREBASE CONFIG
// ======================================================

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};


// ======================================================
// FIREBASE START
// ======================================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ======================================================
// GLOBAL DATA
// ======================================================

let allProducts = [];


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

    loadBanner();

    setupImageModal();

});


// ======================================================
// GET IMAGE FROM PRODUCT
// ======================================================

function getProductImage(product) {

    // Single image
    if (product.image) {
        return product.image;
    }

    if (product.imageUrl) {
        return product.imageUrl;
    }

    if (product.photo) {
        return product.photo;
    }

    // Images array
    if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0];
    }

    if (Array.isArray(product.photos) && product.photos.length > 0) {
        return product.photos[0];
    }

    // Multiple image fields
    if (product.image1) {
        return product.image1;
    }

    if (product.image2) {
        return product.image2;
    }

    return "";
}


// ======================================================
// GET ALL PRODUCT IMAGES
// ======================================================

function getProductImages(product) {

    let images = [];

    if (Array.isArray(product.images)) {
        images = product.images;
    }

    if (Array.isArray(product.photos)) {
        images = product.photos;
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

    return [...new Set(images.filter(Boolean))];

}


// ======================================================
// LOAD PRODUCTS FROM FIRESTORE
// ======================================================

async function loadProducts() {

    const productList = document.getElementById("product-list");

    if (!productList) return;

    try {

        productList.innerHTML = `
            <p class="loading">
                Products Loading...
            </p>
        `;


        const snapshot = await getDocs(
            collection(db, "products")
        );


        allProducts = [];


        snapshot.forEach((doc) => {

            allProducts.push({
                id: doc.id,
                ...doc.data()
            });

        });


        console.log("Products Loaded:", allProducts);


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
        // ==================================================

        showRandomFrontProduct();


        // ==================================================
        // ALL PRODUCTS
        // ==================================================

        displayProducts(allProducts);


    } catch (error) {

        console.error("Product Loading Error:", error);

        productList.innerHTML = `
            <p style="color:red;">
                Products load नहीं हो पाए।
            </p>
        `;

    }

}


// ======================================================
// FRONT PRODUCT
// PAGE OPEN होने पर SAME DATABASE के PRODUCTS में से
// एक अलग Product दिखेगा
// ======================================================

function showRandomFrontProduct() {

    if (!allProducts.length) return;


    // Random Product
    const randomIndex = Math.floor(
        Math.random() * allProducts.length
    );


    const product = allProducts[randomIndex];


    const image = getProductImage(product);


    if (!image) return;


    const hero = document.querySelector(".hero");


    if (!hero) return;


    // Existing background हटाकर
    // Product image लगाई जा रही है

    hero.style.backgroundImage = `
        linear-gradient(
            rgba(0,0,0,0.20),
            rgba(0,0,0,0.20)
        ),
        url("${image}")
    `;

    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";
    hero.style.backgroundRepeat = "no-repeat";


    // Front Product Name

    const heroContent =
        document.querySelector(".hero-content");


    if (heroContent) {

        const productName =
            product.name ||
            product.productName ||
            product.title ||
            "ANJALI TRADERS";


        const oldFrontProduct =
            document.getElementById("frontProductName");


        if (oldFrontProduct) {
            oldFrontProduct.remove();
        }


        const nameElement =
            document.createElement("p");


        nameElement.id =
            "frontProductName";


        nameElement.innerHTML =
            `⭐ Featured Product: <strong>${productName}</strong>`;


        heroContent.appendChild(
            nameElement
        );

    }

}


// ======================================================
// DISPLAY ALL PRODUCTS
// ======================================================

function displayProducts(products) {

    const productList =
        document.getElementById("product-list");


    if (!productList) return;


    productList.innerHTML = "";


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
                    data-image="${mainImage}"
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
                    data-id="${product.id}"
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
                    class="order-product-btn"
                >
                    💬 WhatsApp
                </a>

            </div>

        </div>

    `;


    // ==================================================
    // IMAGE CLICK
    // ==================================================

    const productImage =
        card.querySelector(".product-image");


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

            }
        );

    }


    return card;

}


// ======================================================
// SAVE PRODUCT SYSTEM
// ======================================================

function getSavedProducts() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "anjaliSavedProducts"
            )
        ) || [];

    } catch {

        return [];

    }

}


// ======================================================
// CHECK SAVED
// ======================================================

function isProductSaved(id) {

    const saved =
        getSavedProducts();

    return saved.includes(id);

}


// ======================================================
// SAVE / REMOVE PRODUCT
// ======================================================

function toggleSavedProduct(id) {

    let saved =
        getSavedProducts();


    if (saved.includes(id)) {

        saved =
            saved.filter(
                item => item !== id
            );

    } else {

        saved.push(id);

    }


    localStorage.setItem(
        "anjaliSavedProducts",
        JSON.stringify(saved)
    );


    console.log(
        "Saved Products:",
        saved
    );

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
            (doc) => {

                const data =
                    doc.data();


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


        if (
            banners.length === 0
        ) {

            console.log(
                "No banner found."
            );

            return;

        }


        // Banner में से एक image
        const randomBanner =
            banners[
                Math.floor(
                    Math.random() *
                    banners.length
                )
            ];


        bannerImage.src =
            randomBanner;


    } catch (error) {

        console.error(
            "Banner Error:",
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
// OPEN IMAGE
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
    ) return;


    modalImage.src =
        image;


    modal.style.display =
        "flex";

}
