const loadProducts = () => {
  if (localStorage.getItem('products')) {
    showProducts(JSON.parse(localStorage.getItem('products')))
    return;
  }else{
    const url = `https://fakestoreapi.com/products`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('products',JSON.stringify(data))
        showProducts(data)
        return;
      });
  }
};

// show all product in UI 
const showProducts = (products) => {
  const allProducts = products.map((pd) => pd);
  for (const product of allProducts) {
    const image = product.images;
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `<div class="single-product">
      <div>
    <img class="product-image" src=${product.image}></img>
      </div>
      <h3>${product.title}</h3>
      <p>Category: ${product.category}</p>
      <p>Rated By: ${product.rating.count} users</p>
      <p>Ratings: ${product.rating.rate}/5</p>
      <h2>Price: $ ${product.price}</h2>
      <button onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="buy-now btn btn-success">add to cart</button>
      <button id="details-btn" class="btn btn-danger" onclick="productDetails(${product.id})">Details</button></div>
      `;
    document.getElementById("all-products").appendChild(div);
  }
};

loadProducts();

const showProductDetails = data => {
  const productDetail = document.getElementById('product-details');
  let html = `<img src="${data.image}" alt="">
  <div>
    <h2>${data.title}</h2>
    <p>Category: ${data.category}, Rating: ${data.rating.rate}/5, ${data.rating.count} users rated.</p>
    <h4>Price: ${data.price}</h4>
    <p>${data.description}</p>
  </div>
  <button class="btn btn-light" onclick="clearProductDetail()"><i class="glyphicon glyphicon-remove"></i></button>
  `;
  productDetail.innerHTML = html;
  productDetail.style.display = 'flex'
  location.assign('./#product-details')
}

const clearProductDetail = () => {
  const prodDet = document.getElementById('product-details')
  prodDet.innerHtml=''
  prodDet.style.display = 'none'
}

const productDetails = id => {
  fetch(`https://fakestoreapi.com/products/${id}`)
  .then(r => r.json())
  .then(data =>  showProductDetails(data))
}

let count = 0;
const addToCart = (id, price) => {
  count = count + 1;
  updatePrice("price", price);
  updateTaxAndCharge();
  document.getElementById("total-Products").innerText = count;
  updateTotal()
};

const getInputValue = (id) => {
  const element = document.getElementById(id).innerText;
  const converted = parseFloat(element);
  return converted;
};

// main price update function
const updatePrice = (id, value) => {
  const convertedOldPrice = getInputValue(id);
  const total = convertedOldPrice + value;
  document.getElementById(id).innerText = total.toFixed(2);
};

// set innerText function
const setInnerText = (id, value) => {
  document.getElementById(id).innerText = Math.round(value);
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
  const priceConverted = getInputValue("price");
  if (priceConverted > 200) {
    setInnerText("delivery-charge", 30);
    setInnerText("total-tax", priceConverted * 0.2);
  }
  if (priceConverted > 400) {
    setInnerText("delivery-charge", 50);
    setInnerText("total-tax", priceConverted * 0.3);
  }
  if (priceConverted > 500) {
    setInnerText("delivery-charge", 60);
    setInnerText("total-tax", priceConverted * 0.4);
  }
};

//grandTotal update function
const updateTotal = () => {
  const grandTotal =
    getInputValue("price") + getInputValue("delivery-charge") +
    getInputValue("total-tax");
  document.getElementById("total").innerText = grandTotal.toFixed(2);
};
