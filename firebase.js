import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


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
const auth = getAuth(app);


const CLOUD_NAME = "ayr3jtsa";
const UPLOAD_PRESET = "anjali_traders_2026";


// ==============================
// ADMIN LOGIN
// ==============================

onAuthStateChanged(auth, (user) => {

  if (!user) {

    const email = prompt("Enter Admin Email");
    const password = prompt("Enter Password");

    signInWithEmailAndPassword(auth, email, password)

      .then(() => {
        alert("✅ Login Successful");
      })

      .catch(() => {
        alert("❌ Wrong Email or Password");
        window.location.href = "index.html";
      });

  }

});


// ==============================
// CLOUDINARY IMAGE UPLOAD
// ==============================

async function uploadToCloudinary(file) {

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await res.json();

  if (!data.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return data.secure_url;
}


// ==============================
// UPLOAD PRODUCT - 4 IMAGES
// ==============================

window.uploadProduct = async function () {

  try {

    const name =
      document.getElementById("productName").value;

    const price =
      document.getElementById("productPrice").value;

    const brand =
      document.getElementById("productBrand").value;

    const description =
      document.getElementById("productDescription").value;

    const offer =
      document.getElementById("productOffer").value;


    // Get 4 images

    const file1 =
      document.getElementById("image1").files[0];

    const file2 =
      document.getElementById("image2").files[0];

    const file3 =
      document.getElementById("image3").files[0];

    const file4 =
      document.getElementById("image4").files[0];


    // Check all fields

    if (
      !name ||
      !price ||
      !brand ||
      !description ||
      !offer ||
      !file1 ||
      !file2 ||
      !file3 ||
      !file4
    ) {

      alert("⚠️ Please select all 4 images and fill all fields.");

      return;
    }


    alert("⏳ 4 images uploading... Please wait.");


    // Upload all 4 images

    const image1 = await uploadToCloudinary(file1);

    const image2 = await uploadToCloudinary(file2);

    const image3 = await uploadToCloudinary(file3);

    const image4 = await uploadToCloudinary(file4);


    // Save product to Firestore

    await addDoc(collection(db, "products"), {

      name,
      price,
      brand,
      description,
      offer,

      // 4 images
      images: [
        image1,
        image2,
        image3,
        image4
      ],

      // Main image for old website compatibility
      image: image1,

      createdAt: new Date()

    });


    alert("✅ Product Uploaded Successfully with 4 Images!");

    location.reload();

  }

  catch (error) {

    console.error("Upload Error:", error);

    alert("❌ Upload failed. Check Console.");

  }

};


// ==============================
// LOAD ALL PRODUCTS IN ADMIN
// ==============================

async function loadAdminProducts() {

  const container =
    document.getElementById("adminProducts");

  if (!container) return;

  container.innerHTML = "";

  const snapshot =
    await getDocs(collection(db, "products"));


  snapshot.forEach((docSnap) => {

    const product = docSnap.data();


    // Support old products also

    const images =
      product.images ||
      (product.image ? [product.image] : []);


    const imageGallery = images.map((img) => {

      return `
        <img
          src="${img}"
          width="80"
          height="80"
          style="object-fit:cover;margin:5px;border-radius:8px;"
        >
      `;

    }).join("");


    container.innerHTML += `

      <div
        class="product-card"
        style="margin:20px 0;padding:15px;"
      >

        <div>
          ${imageGallery}
        </div>

        <h3>${product.name}</h3>

        <p>₹${product.price}</p>

        <p>${product.offer}</p>

        <button onclick="editProduct('${docSnap.id}')">
          ✏️ Edit
        </button>

        <button onclick="deleteProduct('${docSnap.id}')">
          🗑️ Delete
        </button>

      </div>

    `;

  });

}


loadAdminProducts();


// ==============================
// DELETE PRODUCT
// ==============================

window.deleteProduct = async function(id) {

  const ok =
    confirm("Are you sure you want to delete this product?");

  if (!ok) return;


  await deleteDoc(
    doc(db, "products", id)
  );


  alert("✅ Product Deleted");

  loadAdminProducts();

};


// ==============================
// EDIT PRODUCT
// ==============================

window.editProduct = async function(id) {

  const newName =
    prompt("Enter New Scooter Name");

  if (newName === null) return;


  const newPrice =
    prompt("Enter New Price");

  if (newPrice === null) return;


  const newBrand =
    prompt("Enter New Brand");

  if (newBrand === null) return;


  const newOffer =
    prompt("Enter New Offer");

  if (newOffer === null) return;


  const newDescription =
    prompt("Enter New Description");

  if (newDescription === null) return;


  await updateDoc(
    doc(db, "products", id),
    {

      name: newName,
      price: newPrice,
      brand: newBrand,
      offer: newOffer,
      description: newDescription

    }
  );


  alert("✅ Product Updated");

  loadAdminProducts();

};
