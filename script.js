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
  storageBucket: "anjali-traders-bc0e6.appspot.com",
  messagingSenderId: "17008156965",
  appId: "1:17008156965:web:51e29057d8da3a46f73acc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const container = document.getElementById("product-list");

async function loadProducts() {
  try {
    container.innerHTML = "";

    const snapshot = await getDocs(collection(db, "products"));

    console.log("Products found:", snapshot.size);

    if (snapshot.empty) {
      container.innerHTML = "<h2>No Products Available</h2>";
      return;
    }

snapshot.forEach((doc) => {
  const product = doc.data();

  container.innerHTML += `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      ${product.offer ? `<p class="offer">🔥 Offer: ${product.offer}</p>` : ""}

      <a href="tel:8235093177" class="btn">📞 Call Now</a>

      <a href="https://wa.me/918235093177" class="btn">💬 WhatsApp</a>
    </div>
  `;
});

document.querySelectorAll(".product-card img").forEach(img => {
  img.style.cursor = "pointer";

  img.onclick = function () {
    document.getElementById("modalImage").src = this.src;
    document.getElementById("imageModal").style.display = "block";
  };
});  

  } catch (err) {
    console.error(err);
    container.innerHTML = `<h3>${err.message}</h3>`;
  }
}
loadProducts().then(() => {
  
  document.querySelectorAll(".product-card img").forEach(img => {
    img.style.cursor = "pointer";

    img.addEventListener("click", function () {
      document.getElementById("modalImage").src = this.src;
      document.getElementById("imageModal").style.display = "block";
    });
  });
});

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("imageModal").style.display = "none";
});

document.getElementById("imageModal").addEventListener("click", () => {
  document.getElementById("imageModal").style.display = "none";
});
// ===============================
// Auto Banner Slider
// ===============================

const slides = document.querySelectorAll(".slide");

if (slides.length > 0) {
  let current = 0;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[index].classList.add("active");
  }

  showSlide(0);

  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 4000);
}
async function loadBanner() {
  try {
    const snapshot = await getDocs(collection(db, "banners"));

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      document.getElementById("bannerImage").src = data.image;
    });

  } catch (e) {
    console.log(e);
  }
}

loadBanner();
