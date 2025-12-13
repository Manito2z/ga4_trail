// Cart Logic for Urban Threads

// Initialize cart from localStorage
function getCart() {
    const cart = localStorage.getItem('urbanThreadsCart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('urbanThreadsCart', JSON.stringify(cart));
    updateCartIcon();
}

// Add item to cart
function addToCart(name, price, image) {
    const cart = getCart();
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    saveCart(cart);
    alert(`${name} added to cart!`);
}

// Remove item from cart
function removeFromCart(name) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== name);
    saveCart(cart);
    renderCartPage(); // Re-render if on cart page
}

// Update quantity
function updateQuantity(name, change) {
    const cart = getCart();
    const item = cart.find(item => item.name === name);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
            return;
        }
    }

    saveCart(cart);
    renderCartPage();
}

// Update Cart Icon Count
function updateCartIcon() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartIcons = document.querySelectorAll('.cart-icon');

    cartIcons.forEach(icon => {
        // preserve the icon text but update number
        if (icon.tagName === 'A') {
            icon.innerHTML = `🛒 (${totalItems})`;
        } else {
            // For the existing div structure in some pages
            icon.innerHTML = `🛒 (${totalItems})`;
            // Make it clickable if it wasn't already wrapped (handling the existing legacy markup)
            icon.onclick = () => window.location.href = 'cart.html';
        }
    });
}

// Render Cart Page
function renderCartPage() {
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartContainer) return; // Not on cart page

    const cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center; padding: 2rem;">Your cart is empty. <a href="products.html" style="color:var(--primary-color)">Go Shop</a></p>';
        cartTotalElement.innerText = '$0.00';
        return;
    }

    let total = 0;
    cartContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
                <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
                <div style="flex-grow: 1;">
                    <h4 style="margin-bottom: 0.25rem;">${item.name}</h4>
                    <p style="color: #666;">$${item.price.toFixed(2)}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button onclick="updateQuantity('${item.name}', -1)" style="padding: 0.2rem 0.6rem; border: 1px solid #ccc; background: none; cursor: pointer;">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)" style="padding: 0.2rem 0.6rem; border: 1px solid #ccc; background: none; cursor: pointer;">+</button>
                </div>
                <div style="font-weight: 600; min-width: 80px; text-align: right;">
                    $${itemTotal.toFixed(2)}
                </div>
                <button onclick="removeFromCart('${item.name}')" style="margin-left: 1rem; color: red; background: none; border: none; cursor: pointer; font-size: 1.2rem;">&times;</button>
            </div>
        `;
    }).join('');

    cartTotalElement.innerText = '$' + total.toFixed(2);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
    renderCartPage();
});
