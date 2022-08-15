(async function () {
  function fillHtml(productData) {
    function fillHtmlImage(src, alt) {
      const imgContainer = document.getElementsByClassName('item__img');
      const img = document.createElement('img');

      img.setAttribute('src', src);
      img.setAttribute('alt', alt);

      imgContainer[0].appendChild(img);
    }

    function fillHtmlTitle(title) {
      const titleContainer = document.getElementById('title');
      titleContainer.textContent = title;
    }

    function fillHtmlPrice(price) {
      const priceContainer = document.getElementById('price');
      priceContainer.textContent = price;
    }
    
    function fillHtmlDescription(desc) {
      const descriptionContainer = document.getElementById('description');
      descriptionContainer.textContent = desc;
    }

    function fillHtmlColors(colors) {
      const colorsContainer = document.getElementById('colors');

      colors.forEach((color) => {
        const option = document.createElement('option');
        option.setAttribute('value', color);
        option.textContent = color;

        colorsContainer.appendChild(option);
      });
    }


    fillHtmlImage(productData.imageUrl, productData.altTxt);
    fillHtmlTitle(productData.name);
    fillHtmlPrice(productData.price);
    fillHtmlDescription(productData.description);
    fillHtmlColors(productData.colors);
  }

  function addToCart() {
    const items = JSON.parse(localStorage.getItem('items'));
    const productId = new URLSearchParams(window.location.search).get('id');
    const colorsContainer = document.getElementById('colors').value;
    const quantityContainer = parseInt(document.getElementById('quantity').value);
    const objForStorage = {
      id: productId,
      quantity: quantityContainer,
      color: colorsContainer,
    }

    if (!colorsContainer.length || !quantityContainer) return false;

    if (items) {
      const newItemsArray = [...items];
      const itemIndex = newItemsArray.findIndex((item) => item.id === productId && item.color === colorsContainer);

      if (itemIndex >= 0) {
        newItemsArray[itemIndex].quantity = quantityContainer;
        localStorage.setItem('items', JSON.stringify(newItemsArray));
        alert('Item mis à jour');
        return true;
      }

      newItemsArray.push(objForStorage);
      localStorage.setItem('items', JSON.stringify(newItemsArray));
      alert('Item ajoutée dans le panier');
      return true;
    }

    localStorage.setItem(
      'items',
      JSON.stringify([objForStorage])
    );
    alert('item ajouté au panier');
  }

  try {
    const productId = new URLSearchParams(window.location.search).get('id');
    const producData = await fetchProduct(productId);

    fillHtml(producData);
    document.getElementById('addToCart').addEventListener('click', addToCart);
  } catch (error) {
    alert(error.message);
  }
})()