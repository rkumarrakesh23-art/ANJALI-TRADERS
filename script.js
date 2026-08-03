import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================
   FIREBASE
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
   PRODUCT GALLERY DATA
========================= */

const galleryData = {};

let fullScreenImages = [];
let fullScreenIndex = 0;


/* =========================
   CREATE FULL SCREEN MODAL
========================= */

function createGalleryModal() {

    if (document.getElementById("galleryModal")) return;

    const modal = document.createElement("div");

    modal.id = "galleryModal";

    modal.innerHTML = `

        <div id="galleryOverlay">

            <button id="galleryClose">
                ✕
            </button>

            <button id="galleryPrev">
                ◀️
            </button>

            <img
                id="galleryFullImage"
                src=""
                alt="Product Image"
            >

            <button id="galleryNext">
                ▶️
            </button>

            <div id="galleryCounter">
                1 / 4
            </div>

        </div>

    `;

    document.body.appendChild(modal);


    /* CLOSE */

    document
        .getElementById("galleryClose")
        .onclick = closeGallery;


    /* PREVIOUS */

    document
        .getElementById("galleryPrev")
        .onclick = function () {

            if (fullScreenImages.length === 0) return;

            fullScreenIndex--;

            if (fullScreenIndex < 0) {

                fullScreenIndex =
                    fullScreenImages.length - 1;

            }

            updateFullScreenImage();

        };


    /* NEXT */

    document
        .getElementById("galleryNext")
        .onclick = function () {

            if (fullScreenImages.length === 0) return;

            fullScreenIndex++;

            if (
                fullScreenIndex >=
                fullScreenImages.length
            ) {

                fullScreenIndex = 0;

            }

            updateFullScreenImage();

        };


    /* CLICK OUTSIDE */

    document
        .getElementById("galleryOverlay")
        .onclick = function (event) {

            if (
                event.target.id ===
                "galleryOverlay"
            ) {

                closeGallery();

            }

        };


    /* KEYBOARD */

    document.addEventListener(
        "keydown",
        function (event) {

            const modal =
                document.getElementById(
                    "galleryModal"
                );

            if (!modal) return;

            if (
                modal.style.display !==
                "block"
            ) return;


            if (event.key === "ArrowLeft") {

                document
                    .getElementById("galleryPrev")
                    .click();

            }


            if (event.key === "ArrowRight") {

                document
                    .getElementById("galleryNext")
                    .click();

            }


            if (event.key === "Escape") {

                closeGallery();

            }

        }
    );

}


/* =========================
   OPEN FULL SCREEN
========================= */

function openGallery(images, index) {

    fullScreenImages = images;

    fullScreenIndex = index || 0;

    createGalleryModal();

    updateFullScreenImage();

    document
        .getElementById("galleryModal")
        .style.display = "block";

}


/* =========================
   UPDATE FULL IMAGE
========================= */

function updateFullScreenImage() {

    const image =
        document.getElementById(
            "galleryFullImage"
        );

    const counter =
        document.getElementById(
            "galleryCounter"
        );


    if (!image) return;


    image.src =
        fullScreenImages[
            fullScreenIndex
        ];


    if (counter) {

        counter.textContent =
            `${fullScreenIndex + 1} / ${fullScreenImages.length}`;

    }

}


/* =========================
   CLOSE
========================= */

function closeGallery() {

    const modal =
        document.getElementById(
            "galleryModal"
        );

    if (modal) {

        modal.style.display = "none";

    }

}


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

    const container =
        document.getElementById(
            "product-list"
        );


    if (!container) {

        console.error(
            "product-list not found"
        );

        return;

    }


    container.innerHTML =
        "<h3>Loading Products...</h3>";


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "products"
                )
            );


        console.log(
            "Products:",
            snapshot.size
        );


        if (snapshot.empty) {

            container.innerHTML =
                "<h2>No Products Available</h2>";

            return;

        }


        container.innerHTML = "";


        snapshot.forEach(
            (docSnap, index) => {

                const product =
                    docSnap.data();


                /* =========================
                   GET 4 IMAGES
                ========================= */

                let images = [];


                if (
                    Array.isArray(
                        product.images
                    )
                ) {

                    images =
                        product.images.filter(
                            url =>
                                typeof url ===
                                "string" &&
                                url.trim() !== ""
                        );

                }


                /* OLD PRODUCT SUPPORT */

                if (
                    images.length === 0 &&
                    product.image
                ) {

                    images = [
                        product.image
                    ];

                }


                galleryData[index] =
                    images;


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "product-card";


                card.innerHTML = `

                    <div
                        class="product-gallery"
                        style="
                            position:relative;
                            width:100%;
                            height:320px;
                            overflow:hidden;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            background:#f5f5f5;
                            border-radius:12px;
                        "
                    >

                        ${
                            images.length > 0

                            ? `

                                <img
                                    class="product-main-image"
                                    src="${images[0]}"
                                    alt="${product.name || "Electric Scooter"}"
                                    style="
                                        display:block !important;
                                        visibility:visible !important;
                                        opacity:1 !important;
                                        width:100% !important;
                                        height:100% !important;
                                        object-fit:contain !important;
                                        cursor:pointer;
                                    "
                                >

                                ${
                                    images.length > 1

                                    ? `

                                        <button
                                            class="gallery-prev"
                                            style="
                                                position:absolute;
                                                left:10px;
                                                top:50%;
                                                transform:translateY(-50%);
                                                z-index:10;
                                                border:none;
                                                border-radius:50%;
                                                width:48px;
                                                height:48px;
                                                font-size:22px;
                                                cursor:pointer;
                                                background:rgba(0,0,0,0.65);
                                                color:white;
                                            "
                                        >
                                            ◀️
                                        </button>


                                        <button
                                            class="gallery-next"
                                            style="
                                                position:absolute;
                                                right:10px;
                                                top:50%;
                                                transform:translateY(-50%);
                                                z-index:10;
                                                border:none;
                                                border-radius:50%;
                                                width:48px;
                                                height:48px;
                                                font-size:22px;
                                                cursor:pointer;
                                                background:rgba(0,0,0,0.65);
                                                color:white;
                                            "
                                        >
                                            ▶️
                                        </button>


                                        <div
                                            class="gallery-number"
                                            style="
                                                position:absolute;
                                                bottom:10px;
                                                left:50%;
                                                transform:translateX(-50%);
                                                background:rgba(0,0,0,0.65);
                                                color:white;
                                                padding:5px 12px;
                                                border-radius:20px;
                                                font-size:14px;
                                                z-index:10;
                                            "
                                        >
                                            Photo 1 / ${images.length}
                                        </div>

                                    `

                                    : ""

                                }

                            `

                            : `

                                <p>
                                    No Image Available
                                </p>

                            `
                        }

                    </div>


                    <h3>
                        ${product.name || "Electric Scooter"}
                    </h3>


                    <p>
                        💰 Price:
                        ₹${product.price || "Contact Us"}
                    </p>


                    ${
                        product.offer

                        ? `

                            <p class="offer">
                                🔥 Offer:
                                ${product.offer}
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
                        target="_blank"
                        class="btn"
                    >
                        💬 WhatsApp
                    </a>

                `;


                container.appendChild(card);


                /* =========================
                   GALLERY BUTTONS
                ========================= */

                const image =
                    card.querySelector(
                        ".product-main-image"
                    );


                const previous =
                    card.querySelector(
                        ".gallery-prev"
                    );


                const next =
                    card.querySelector(
                        ".gallery-next"
                    );


                const number =
                    card.querySelector(
                        ".gallery-number"
                    );


                let current = 0;


                /* PREVIOUS */

                if (previous) {

                    previous.onclick =
                        function () {

                            current--;

                            if (current < 0) {

                                current =
                                    images.length - 1;

                            }


                            image.src =
                                images[current];


                            number.textContent =
                                `Photo ${current + 1} / ${images.length}`;

                        };

                }


                /* NEXT */

                if (next) {

                    next.onclick =
                        function () {

                            current++;

                            if (
                                current >=
                                images.length
                            ) {

                                current = 0;

                            }


                            image.src =
                                images[current];


                            number.textContent =
                                `Photo ${current + 1} / ${images.length}`;

                        };

                }


                /* =========================
                   CLICK IMAGE → FULL SCREEN
                ========================= */

                if (image) {

                    image.onclick =
                        function () {

                            openGallery(
                                images,
                                current
                            );

                        };

                }

            }
        );


        createGalleryModal();


    } catch (error) {

        console.error(
            "Product Error:",
            error
        );


        container.innerHTML =
            `<h3>Error: ${error.message}</h3>`;

    }

}


/* =========================
   BANNER
========================= */

async function loadBanner() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "banners"
                )
            );


        const bannerImage =
            document.getElementById(
                "bannerImage"
            );


        if (
            !bannerImage ||
            snapshot.empty
        ) {

            return;

        }


        const banners = [];


        snapshot.forEach(
            docSnap => {

                const data =
                    docSnap.data();


                if (data.image) {

                    banners.push(
                        data.image
                    );

                }

            }
        );


        if (banners.length === 0) return;


        let current = 0;


        bannerImage.src =
            banners[0];


        if (banners.length > 1) {

            setInterval(
                () => {

                    current++;

                    if (
                        current >=
                        banners.length
                    ) {

                        current = 0;

                    }


                    bannerImage.src =
                        banners[current];

                },
                4000
            );

        }


    } catch (error) {

        console.error(
            "Banner Error:",
            error
        );

    }

}


/* =========================
   START
========================= */

loadProducts();

loadBanner();
