export const pdp = {
  linkLabel: 'Product Details Page',
  content: `
  <a href="/" class="button">⬅ Back</a>
  <div id="pdp">
    <div id="productImage">
      <img src="${product.image}" />
    </div>
    <h2 id="productName">${product.name}</h2>
    <p id="productDescription">${product.description}</p>
    <h1 id="price">\$${product.price}</h1>
    <a class="button" id="cart">Add to cart</a>
  </div>`,
};
