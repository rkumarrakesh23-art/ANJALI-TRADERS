import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {
    apiKey: "AIzaSyDRYU05VxRB3BPIp2OPGOcoIkS6BH8Usc",
    authDomain: "anjali-traders-bc0e6.firebaseapp.com",
    projectId: "anjali-traders-bc0e6",
    storageBucket: "anjali-traders-bc0e6.appspot.com",
    messagingSenderId: "17008156965",
    appId: "1:17008156965:web:51e29057d8da3a46f73acc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* =========================
   PRODUCT LOAD
========================= */

const container = document.getElementById("product-list");

async function loadProducts() {

    try {

        if (!container) {
            console.error("product-list not found in HTML");
            return;
        }

        container.innerHTML = "<h3>Loading Products...</h3>";

        const snapshot = await getDocs(
            collection(db, "products")
        );

        console.log("Products found:", snapshot.size);

        if (snapshot.empty) {
            container.innerHTML = "<h2>No Products Available</h2>";
            return;
        }

        container.innerHTML = "";

        snapshot.forEach((docSnap, productIndex) => {

            const product = docSnap.data();

            /* 4 images from Firebase */
            const images =
                Array.isArray(product.images) &&
                product.images.length > 0
                    ? product.images
                    : product.image
                        ? [product.image]
                        : [];

            const sliderId = `slider-${productIndex}`;

            container.innerHTML += `

                <div class="product-card">

                    <div
                        class="product-slider"
                        id="${sliderId}"
                        style="
                            position:relative;
                            width:100%;
                            text-align:center;
                        "
                    >

                        ${
                            images.length > 0

                            ? `

                                <img
                                    src="${images[0]}"
                                    class="main-product-image"
                                    id="${sliderId}-image"
                                    alt="${product.name || "Electric Scooter"}"
                                    style="
                                        width:100%;
                                        max-height:350px;
                                        object-fit:contain;
                                        cursor:pointer;
                                        border-radius:10px;
                                    "
                                >

                                ${
                                    images.length > 1

                                    ? `

                                        <button
                                            class="prev-btn"
                                            data-slider="${sliderId}"
                                            style="
                                                position:absolute;
                                                left:10px;
                                                top:50%;
                                                transform:translateY(-50%);
                                                z-index:5;
                                                font-size:24px;
                                                padding:8px 14px;
                                                border:none;
                                                border-radius:50%;
                                                cursor:pointer;
                                                background:rgba(0,0,0,0.6);
                                                color:white;
                                            "
                                        >
                                            ◀️
                                        </button>

                                        <button
                                            class="next-btn"
                                            data-slider="${sliderId}"
                                            style="
                                                position:absolute;
                                                right:10px;
                                                top:50%;
                                                transform:translateY(-50%);
                                                z-index:5;
                                                font-size:24px;
                                                padding:8px 14px;
                                                border:none;
                                                border-radius:50%;
                                                cursor:pointer;
                                                background:rgba(0,0,0,0.6);
                                                color:white;
                                            "
                                        >
                                            ▶️
                                        </button>

                                        <div
                                            style="
                                                margin-top:8px;
                                                font-size:14px;
                                            "
                                        >
                                            Photo
                                            <span id="${sliderId}-number">
                                                1
                                            </span>
                                            /
                                            ${images.length}
                                        </div>

                                    `

                                    : ""

                                }

                            `

                            : `

                                <p style="padding:20px;">
                                    No Image Available
                                </p>

                            `
                        }

                    </div>


                    <h3>
                        ${product.name || "Electric Scooter"}
                    </h3>


                    <p>
                        <strong>💰 Price:</strong>
                        ₹${product.price || "Contact Us"}
                    </p>


                    ${
                        product.offer

                        ? `

                            <p class="offer">
                                🔥 Offer: ${product.offer}
                            </p>

                          `

                        : ""
                    }


                    <a
                        href="tel:8235093177"
                        class="btn"
                    >
                        📞 Call Now
                    </a>


                    <a
                        href="https://wa.me/918235093177"
                        class="btn"
                        target="_blank"
                    >
                        💬 WhatsApp
                    </a>

                </div>

            `;

        });


        /* =========================
           PREVIOUS BUTTON
        ========================= */

        document
            .querySelectorAll(".prev-btn")
            .forEach(button => {

                button.addEventListener("click", function () {

                    const sliderId =
                        this.dataset.slider;

                    changeProductImage(
                        sliderId,
                        -1
                    );

                });

            });


        /* =========================
           NEXT BUTTON
        ========================= */

        document
            .querySelectorAll(".next-btn")
            .forEach(button => {

                button.addEventListener("click", function () {

                    const sliderId =
                        this.dataset.slider;

                    changeProductImage(
                        sliderId,
                        1
                    );

                });

            });


        /* =========================
           IMAGE CLICK → FULL IMAGE
        ========================= */

        document
            .querySelectorAll(".main-product-image")
            .forEach(img => {

                img.addEventListener("click", function () {

                    const modal =
                        document.getElementById("imageModal");

                    const modalImage =
                        document.getElementById("modalImage");

                    if (modal && modalImage) {

                        modalImage.src = this.src;

                        modal.style.display = "block";

                    }

                });

            });


        /* =========================
           AUTO SLIDER
        ========================= */

        document
            .querySelectorAll(".product-slider")
            .forEach(slider => {

                const sliderId = slider.id;

                const imageElement =
                    document.getElementById(
                        `${sliderId}-image`
                    );

                if (!imageElement) return;

                const productCard =
                    slider.closest(".product-card");

                if (!productCard) return;

                const productIndex =
                    [...document.querySelectorAll(".product-card")]
                    .indexOf(productCard);

                const product =
                    snapshot.docs[productIndex].data();

                const images =
                    Array.isArray(product.images)
                        ? product.images
                        : product.image
                            ? [product.image]
                            : [];

                if (images.length <= 1) return;

                setInterval(() => {

                    changeProductImage(
                        sliderId,
                        1
                    );

                }, 5000);

            });


    } catch (err) {

        console.error("Product Error:", err);

        if (container) {

            container.innerHTML =
                `<h3>Error: ${err.message}</h3>`;

        }

    }

}


/* =========================
   CHANGE PRODUCT IMAGE
========================= */

const currentImages = {};


/* =========================
   GET PRODUCT IMAGES
========================= */

async function changeProductImage(
    sliderId,
    direction
) {

    const slider =
        document.getElementById(sliderId);

    if (!slider) return;

    const imageElement =
        document.getElementById(
            `${sliderId}-image`
        );

    if (!imageElement) return;


    const productCards =
        document.querySelectorAll(
            ".product-card"
        );

    let cardIndex = -1;

    productCards.forEach((card, index) => {

        const sliderInside =
            card.querySelector(
                ".product-slider"
            );

        if (
            sliderInside &&
            sliderInside.id === sliderId
        ) {
            cardIndex = index;
        }

    });


    if (cardIndex < 0) return;


    try {

        const snapshot =
            await getDocs(
                collection(db, "products")
            );

        if (!snapshot.docs[cardIndex]) return;


        const product =
            snapshot.docs[cardIndex].data();


        const images =
            Array.isArray(product.images)
                ? product.images
                : product.image
                    ? [product.image]
                    : [];


        if (images.length <= 1) return;


        if (
            currentImages[sliderId] === undefined
        ) {

            currentImages[sliderId] = 0;

        }


        currentImages[sliderId] += direction;


        if (
            currentImages[sliderId] < 0
        ) {

            currentImages[sliderId] =
                images.length - 1;

        }


        if (
            currentImages[sliderId] >= images.length
        ) {

            currentImages[sliderId] = 0;

        }


        imageElement.src =
            images[currentImages[sliderId]];


        const numberElement =
            document.getElementById(
                `${sliderId}-number`
            );

        if (numberElement) {

            numberElement.textContent =
                currentImages[sliderId] + 1;

        }

    } catch (error) {

        console.error(
            "Image change error:",
            error
        );

    }

}


/* =========================
   BANNER LOAD
========================= */

async function loadBanner() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "banners")
            );

        console.log(
            "Banners found:",
            snapshot.size
        );


        const bannerImage =
            document.getElementById(
                "bannerImage"
            );


        if (!bannerImage) {

            console.error(
                "bannerImage not found in HTML"
            );

            return;

        }


        if (snapshot.empty) {

            bannerImage.style.display =
                "none";

            return;

        }


        const banners = [];


        snapshot.forEach(docSnap => {

            const data =
                docSnap.data();

            if (data.image) {

                banners.push(
                    data.image
                );

            }

        });


        if (banners.length === 0) {

            bannerImage.style.display =
                "none";

            return;

        }


        let currentBanner = 0;


        bannerImage.src =
            banners[currentBanner];

        bannerImage.style.display =
            "block";


        if (banners.length > 1) {

            setInterval(() => {

                currentBanner =
                    (currentBanner + 1) %
                    banners.length;

                bannerImage.src =
                    banners[currentBanner];

            }, 4000);

        }


    } catch (error) {

        console.error(
            "Banner Error:",
            error
        );

    }

}


/* =========================
   IMAGE MODAL CLOSE
========================= */

const modal =
    document.getElementById(
        "imageModal"
    );

const closeButton =
    document.querySelector(
        ".close"
    );


if (closeButton && modal) {

    closeButton.addEventListener(
        "click",
        () => {

            modal.style.display =
                "none";

        }
    );

}


if (modal) {

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

}


/* =========================
   START WEBSITE
========================= */

loadProducts();

loadBanner();
