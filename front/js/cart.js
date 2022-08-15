(async function () {
  async function formatLocalStorage() {
    const items = JSON.parse(localStorage.getItem('items'));
    if (!items) return false;

    return Promise.all(
      items.map(async (item) => {
        const productData = await fetchProduct(item.id);

        return {
          ...item,
          image: productData.imageUrl,
          name: productData.name,
          description: productData.description,
          alt: productData.altTxt,
          price: productData.price,
        }
      }),
    );
  }

  function renderItems(itemsData) {
    if (!itemsData) return false;

    const itemsContainer = document.getElementById('cart__items');
    itemsContainer.innerHTML = '';

    itemsData.forEach((item) => {
      const article = document.createElement('article');

      article.setAttribute('class', 'cart__item');
      article.setAttribute('data-id', item.id);
      article.setAttribute('data-color', item.color);

      article.innerHTML = `
      <div class="cart__item__img">
        <img src="${item.image}" alt="${item.alt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${item.name}</h2>
          <p>${item.color}</p>
          <p>${item.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : ${item.quantity}</p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>`;

      itemsContainer.appendChild(article);
    });

    detectQuantityChange(itemsData);
    detectItemDelete(itemsData);
    renderPrice(itemsData);
    renderItemsQuantity(itemsData);
  }

  function detectQuantityChange(oldLocalStorage) {
    document.querySelectorAll('.itemQuantity').forEach((element) => {
      element.addEventListener('change', (e) => {
        const items = [...JSON.parse(localStorage.getItem('items'))];
        const article = element.closest('article');
        const elementColor = article.getAttribute('data-color');
        const elementId = article.getAttribute('data-id');
        const itemIndex = items.findIndex((item) => item.id === elementId && item.color === elementColor);

        items[itemIndex].quantity = parseInt(e.target.value);
        oldLocalStorage[itemIndex].quantity = parseInt(e.target.value);
        localStorage.setItem('items', JSON.stringify(items));
        renderItems(oldLocalStorage);
      });
    });
  }

  function detectItemDelete(oldLocalStorage) {
    document.querySelectorAll('.deleteItem').forEach((element) => {
      element.addEventListener('click', () => {
        const localStorageItems = [...JSON.parse(localStorage.getItem('items'))];
        const article = element.closest('article');
        const elementColor = article.getAttribute('data-color');
        const elementId = article.getAttribute('data-id');
        const findElementInStorage = oldLocalStorage.findIndex((item) => item.id === elementId && item.color === elementColor);

        localStorageItems.splice(findElementInStorage, 1);
        oldLocalStorage.splice(findElementInStorage, 1);

        localStorage.setItem('items', JSON.stringify(localStorageItems));
        renderItems(oldLocalStorage);
      });
    });
  }

  function renderPrice(items) {
    const priceContainer = document.getElementById('totalPrice');
    const price = items.reduce(
      (prev, next) => {
        return prev + (next.quantity * next.price)
      },
      0
    );

    priceContainer.textContent = price;
  }

  function renderItemsQuantity(oldLocalStorage) {
    const quantityContainer = document.getElementById('totalQuantity');
    const quantity = oldLocalStorage.reduce(
      (prev, next) => {
        return prev + next.quantity;
      },
      0,
    );
    quantityContainer.textContent = quantity;
  }

  function isInputEmpty(value) {
    return value.length;
  }

  function isNameAndLastNameCorrect(value) {
    return /[A-Z]/.test(value);
  }

  function isInputMailCorrect(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  try {
    const lsFormated = await formatLocalStorage();
    renderItems(lsFormated);
    document
      .querySelector('.cart__order__form')
      .addEventListener('submit', async (e) => {
        try {
          e.preventDefault();
          
          const messageErrorFieldEmpty = 'Veuillez remplir le champ';
          const messageErrorFieldBad = 'Ce champ doit avoir au moins une majuscule';
          const messageErrorFieldMail = 'Le champ mail n\'est pas correct';
          const idErrors = [
            {
              id: 'firstName',
              idError: 'firstNameErrorMsg',
              validator: isNameAndLastNameCorrect,
              errorMessage: messageErrorFieldBad,
            },
            {
              id: 'lastName',
              idError: 'lastNameErrorMsg',
              validator: isNameAndLastNameCorrect,
              errorMessage: messageErrorFieldBad,
            },
            {
              id: 'address',
              idError: 'addressErrorMsg',
              validator: isInputEmpty,
              errorMessage: messageErrorFieldEmpty,
            },
            {
              id: 'city',
              idError: 'cityErrorMsg',
              validator: isInputEmpty,
              errorMessage: messageErrorFieldEmpty,
            },
            {
              id: 'email',
              idError: 'emailErrorMsg',
              validator: isInputMailCorrect,
              errorMessage: messageErrorFieldMail
            },
          ];

          const formHasError = idErrors.every((inputData) => {
            const inputValue = document.getElementById(inputData.id).value;
            
            if (!inputData.validator(inputValue)) {
              document.getElementById(inputData.idError).textContent = inputData.errorMessage;
              return false;
            }

            return true;
          });

          if (!formHasError) return false;

          const resPromise = await fetch(
            `${window.baseApiUrl}/order`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify({
                contact: {
                  firstName,
                  lastName,
                  address,
                  city,
                  email,
                },
                products: [...JSON.parse(localStorage.getItem('items'))].map((i) => i.id)
              })
            },
          );
          const res = await resPromise.json();
          document.location.href = `confirmation.html?orderId=${res.orderId}`;
        } catch (error) {
          alert(error.message);
        }
      })
  } catch (error) {
    alert(error.message);
  }
})()