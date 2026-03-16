/* =========================================
   ECOPET — SCRIPT.JS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     MENU MOBILE
  ========================= */
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("show");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu = menu.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        menu.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    const menuLinks = menu.querySelectorAll("a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* =========================
     CARRINHO
  ========================= */
  const cartItemsContainer = document.getElementById("cartItems");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const reserveWhatsAppButton = document.getElementById("reserveWhatsApp");
  const reserveInstagramButton = document.getElementById("reserveInstagram");

  let cart = JSON.parse(localStorage.getItem("ecopetCart")) || [];

  function saveCart() {
    localStorage.setItem("ecopetCart", JSON.stringify(cart));
  }

  function renderCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="empty-cart">Nenhum item adicionado ainda.</p>';
      return;
    }

    const groupedItems = {};

    cart.forEach((item) => {
      groupedItems[item] = (groupedItems[item] || 0) + 1;
    });

    Object.keys(groupedItems).forEach((itemName) => {
      const quantity = groupedItems[itemName];

      const itemElement = document.createElement("div");
      itemElement.classList.add("cart-item");

      itemElement.innerHTML = `
        <div>
          <p class="cart-item-name">${itemName}</p>
          <p class="cart-item-quantity">Quantidade: ${quantity}</p>
        </div>
        <button class="remove-item" data-name="${itemName}" aria-label="Remover item">
          Remover
        </button>
      `;

      cartItemsContainer.appendChild(itemElement);
    });

    const removeButtons = document.querySelectorAll(".remove-item");
    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        removeFromCart(button.dataset.name);
      });
    });
  }

  function addToCart(productName) {
    cart.push(productName);
    saveCart();
    renderCart();
  }

  function removeFromCart(productName) {
    const itemIndex = cart.indexOf(productName);

    if (itemIndex !== -1) {
      cart.splice(itemIndex, 1);
      saveCart();
      renderCart();
    }
  }

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productName = button.dataset.name;
      addToCart(productName);
    });
  });

  /* =========================
     MENSAGEM DE RESERVA
  ========================= */
  function createOrderMessage() {
    if (cart.length === 0) {
      return "Olá! Tenho interesse nos produtos da Ecopet, mas meu carrinho ainda está vazio.";
    }

    const groupedItems = {};

    cart.forEach((item) => {
      groupedItems[item] = (groupedItems[item] || 0) + 1;
    });

    let message = "Olá! Gostaria de fazer uma reserva/orçamento na Ecopet.%0A%0A";
    message += "Itens do carrinho:%0A";

    Object.keys(groupedItems).forEach((itemName) => {
      message += `- ${itemName} | Quantidade: ${groupedItems[itemName]}%0A`;
    });

    message += "%0AEstou aguardando atendimento. Obrigado!";
    return message;
  }

  /* =========================
     WHATSAPP
  ========================= */
  if (reserveWhatsAppButton) {
    reserveWhatsAppButton.addEventListener("click", () => {
      const message = createOrderMessage();

      /* Troque pelo número real no formato:
         5561999999999
      */
      const phoneNumber = "5500000000000";

      const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappURL, "_blank");
    });
  }

  /* =========================
     INSTAGRAM
  ========================= */
  if (reserveInstagramButton) {
    reserveInstagramButton.addEventListener("click", () => {
      const message = createOrderMessage().replace(/%0A/g, "\n");
      const instagramUser = "ecopet333";

      alert(
        `Você será direcionado para o Instagram @${instagramUser}.\n\n` +
        `Copie a mensagem abaixo e envie por direct:\n\n${decodeURIComponent(message)}`
      );

      window.open(`https://www.instagram.com/${instagramUser}/`, "_blank");
    });
  }

  renderCart();
});