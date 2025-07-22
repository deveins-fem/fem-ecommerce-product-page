import { debounce } from "./utils.js";

let cart = [];

function addToCart() {
    const addToCartButtons = document.querySelectorAll('.product__add-to-cart');

    addToCartButtons.forEach(button => {
        const productEl = button.closest('.product');
        const increaseBtn = productEl.querySelector('.product__qty-btn--increase');
        const decreaseBtn = productEl.querySelector('.product__qty-btn--decrease');
        const qtyValue = productEl.querySelector('.product__qty-value');
        let quantity = parseInt(qtyValue.textContent) || 1;

        increaseBtn.addEventListener('click', () => {
            quantity++;
            qtyValue.textContent = quantity;
        });

        decreaseBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                qtyValue.textContent = quantity;
            }
        });

        button.addEventListener('click',debounce(() => {
            const product = {
                id: productEl.dataset.id,
                title: productEl.dataset.title,
                price: productEl.dataset.price,
                image: productEl.dataset.image,
                quantity: quantity
            };

            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push(product);
            }

            qtyValue.textContent = 1;
            quantity = 1;

            saveCart();
            showCartToast();
            updateCartUI();
        }, 1000));
    });
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function updateCartCount() {
    const cartCountEl = document.querySelector('.header__cart-count');
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

    if(totalQty > 0) {
        cartCountEl.textContent = totalQty;
        cartCountEl.classList.add('show-count');
    }
    else {
        cartCountEl.classList.remove('show-count');
    }
}

function showCartToast(message = 'Item added to cart') {
    const toast = document.querySelector('.cart-toast');
    toast.querySelector('.cart-toast__message').textContent = message;

    toast.classList.add('show-toast');

    setTimeout(() => {
        toast.classList.remove('show-toast');
    }, 2000);
}

function clearCart() {
    const clearBtn = document.querySelector('.cart__clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            cart = [];
            saveCart();
            updateCartUI();
            updateCartCount();
        });
    }
}

function updateCartUI() {
    const cartContent = document.querySelector('.cart__content');
    const emptyMsg = cartContent.querySelector('.cart__empty');
    const checkoutBtn = cartContent.querySelector('.cart__checkout');
    const clearBtn = cartContent.querySelector('.cart__clear');
    const cartTotalEl = document.querySelector('.cart__total');
    const cartTotalValue = document.querySelector('.cart__total-value');

    cartContent.querySelectorAll('.cart__item').forEach(item => item.remove());

    if (cart.length === 0) {
        emptyMsg.style.display = 'block';
        cartContent.querySelector('.cart__checkout')?.classList.remove('cart-checkout');
        cartTotalEl.classList.remove('show-total');
        if (checkoutBtn) checkoutBtn.classList.remove('cart-checkout-display');
        if (clearBtn) clearBtn.classList.remove('cart-clear-display');
        return;
    }
    
    emptyMsg.style.display = 'none';

    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('cart__item');

        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart__item-image" />
            <div class="cart__item-details">
                <p class="cart__item-name">${item.title}</p>
                <p class="cart__item-price">$${item.price} × ${item.quantity} <strong>$${(item.price * item.quantity).toFixed(2)}</strong></p>
            </div>
            <button class="cart__item-delete" data-id="${item.id}" aria-label="Delete item">
                <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 16">
                    <path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z"/>
                </svg>
            </button>
        `;
        cartContent.insertBefore(itemEl, cartTotalEl);
    })

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cartTotalValue.textContent = total.toFixed(2);
    cartTotalEl.classList.add('show-total');
    checkoutBtn.classList.add('cart-checkout-display');
    clearBtn.classList.add('cart-clear-display');

    document.querySelectorAll('.cart__item-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(btn.dataset.id);
            updateCartCount();
        });
    });

    updateCartCount();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const stored = localStorage.getItem('cart');
    cart = stored ? JSON.parse(stored) : [];
}

export function initCart() {

    function setupCartEventListeners() {
        const cart = document.querySelector('.cart');
        const cartToggleBtn = document.querySelector('.header__cart');
        const clostBtn = document.querySelector('.cart__close');

        cartToggleBtn.addEventListener('click', () => {
            cart.classList.toggle('open-cart');
        });

        clostBtn.addEventListener('click', () => {
            cart.classList.remove('open-cart');
        });

        document.addEventListener('click', (e) => {
            const isClickInsideCart = e.composedPath().some(el => el.classList?.contains('cart'));
            const isCartToggle = cartToggleBtn.contains(e.target);
            const isAddToCart = e.target.closest('.product__add-to-cart');
            const isQtyBtn = e.target.closest('.product__qty-btn--increase') || e.target.closest('.product__qty-btn--decrease');
          
            if (!isClickInsideCart && !isCartToggle && !isAddToCart && !isQtyBtn) {
              cart.classList.remove('open-cart');
            }
        });
    }

    addToCart();
    clearCart();
    loadCartFromStorage();
    updateCartUI();
    setupCartEventListeners();
}