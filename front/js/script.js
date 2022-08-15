(async function () {
  try {
    const products = await fetchProducts();
    const container = document.getElementById('items');
    
    products.forEach((product) => {
      const a = document.createElement('a');

      a.setAttribute('href', `./product.html?id=${product._id}`)
      a.innerHTML = `
      <article>
        <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
      </article>`;

      container.appendChild(a);
    });
  } catch (error) {
    alert(error.message);
  }
})()