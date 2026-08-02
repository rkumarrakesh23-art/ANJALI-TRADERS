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

            container.innerHTML =
                "<h2>No Products Available</h2>";

            return;
        }

        container.innerHTML = "";

        snapshot.forEach((doc) => {

            const product = doc.data();

            const images =
                Array.isArray(product.images) && product.images.length > 0
                    ? product.images
                    : product.image
                        ? [product.image]
                        : [];


            container.innerHTML += `

                <div class="product-card">-card">

                    <div class="product-card">-slider">

                        ${
                            images.length > 0
                            ? images.map((img, index) => `
                                <img
                                    src="${img}"
                                    class="slide-img ${index === 0 ? "active" : ""}"
                                    alt="${product.name || "Electric Scooter"}"
                                >
                            `).join("")
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
                        ? `<p class="offer">
                                🔥 Offer: ${product.offer}
                           </p>`
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
           PRODUCT IMAGE POPUP
        ========================= */

        document
            .querySelectorAll(".product-card img")
            .forEach(img => {

                img.style.cursor = "pointer";

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
           PRODUCT IMAGE SLIDER
        ========================= */

        document
            .querySelectorAll(".product-slider")
            .forEach(slider => {

                const imgs =
                    slider.querySelectorAll("img");

                if (imgs.length <= 1) return;

                let current = 0;

                setInterval(() => {

                    imgs[current].classList.remove("active");

                    current =
                        (current + 1) % imgs.length;

                    imgs[current].classList.add("active");

                }, 2500);

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
            document.getElementById("bannerImage");

        if (!bannerImage) {

            console.error("bannerImage not found in HTML");

            return;

        }

        if (snapshot.empty) {

            bannerImage.style.display = "none";

            return;

        }

        const banners = [];

        snapshot.forEach(docSnap => {

            const data = docSnap.data();

            if (data.image) {

                banners.push(data.image);

            }

        });


        if (banners.length === 0) {

            bannerImage.style.display = "none";

            return;

        }


        /* First Banner */

        let currentBanner = 0;

        bannerImage.src =
            banners[currentBanner];

        bannerImage.style.display = "block";


        /* Multiple Banner Slider */

        if (banners.length > 1) {

            setInterval(() => {

                currentBanner =
                    (currentBanner + 1) % banners.length;

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
    document.getElementById("imageModal");

const closeButton =
    document.querySelector(".close");


if (closeButton && modal) {

    closeButton.addEventListener(
        "click",
        () => {

            modal.style.display = "none";

        }
    );

}


if (modal) {

    modal.addEventListener(
        "click",
        (event) => {

            if (event.target === modal) {

                modal.style.display = "none";

            }

        }
    );

}


/* =========================
   START WEBSITE
========================= */

loadProducts();

loadBanner();
