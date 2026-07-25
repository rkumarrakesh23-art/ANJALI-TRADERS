const products = [
{
    name: "THUKRAL REVO",
    image: "THUKRAL REVO.jpeg",
    description: "Premium Electric Scooter"
},
{
    name: "RED EV2",
    image: "RED EV2.png",
    description: "Comfort Ride"
},
{
    name: "THUKRAL GRAND",
    image: "THUKRAL GRAND.png",
    description: "Stylish Design"
},
{
    name: "BLUE ELECTRIC",
    image: "BLUE ELECTRIC.png",
    description: "Powerful EV Scooter"
}
];

const container = document.getElementById("product-list");

products.forEach(product => {

const card = document.createElement("div");

card.className = "product-card";

card.innerHTML = `
<img src="${product.image}" alt="${product.name}">

<h3>${product.name}</h3>

<p>${product.description}</p>

<a href="tel:8235093177" class="btn">📞 Call Now</a>

<a href="https://wa.me/918235093177" class="btn">💬 WhatsApp</a>
`;

container.appendChild(card);

});
