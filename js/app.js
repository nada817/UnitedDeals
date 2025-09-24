// United Deals - Main JavaScript Application

// Products array
const products = [
    { id: 1, name: "Adidas Running Shoes", price: 129.99, image: "./assets//products/adidas product.jfif", category: "Shoes", discount: 20 },
    { id: 2, name: "POCO M6 Pro", price: 199.99, image: "./assets//products/poco m6 pro.jfif", category: "Mobile", discount: 15 },
    { id: 3, name: "Smart Watch Z6", price: 89.99, image: "./assets//products/smart watch.jfif", category: "Watches", discount: 30 },
    { id: 4, name: "Laptop Sleeve", price: 15.99, image: "./assets//products/laptopsleeve.jfif", category: "Accessories", discount: 10 },
    { id: 5, name: "Nike Air Max", price: 149.99, image: "./assets//products/nikeairmax.jfif", category: "Shoes", discount: 25 },
    { id: 6, name: "iPhone 15 Pro", price: 999.99, image: "./assets//products/iphone15 pro.jfif", category: "Mobile", discount: 5 },
    { id: 7, name: "Apple Watch Series 9", price: 399.99, image: "./assets//products/applewatch.jfif", category: "Watches", discount: 12 },
    { id: 8, name: "Wireless Headphones", price: 79.99, image: "./assets//products/wireless-headphone.jfif", category: "Accessories", discount: 18 },
    { id: 9, name: "Puma Sneakers", price: 89.99, image: "./assets/products/puma sneakers.jfif", category: "Shoes", discount: 22 },
    { id: 10, name: "Samsung Galaxy S24", price: 799.99, image: "./assets/products/samsungultra.jfif", category: "Mobile", discount: 8 },
    { id: 11, name: "Garmin Fitness Watch", price: 249.99, image: "./assets/products/germainwatch.jfif", category: "Watches", discount: 20 },
    { id: 12, name: "Phone Case Set", price: 24.99, image: "./assets/products/phone case.jfif", category: "Accessories", discount: 15 }
];

// Global variables
let cart = JSON.parse(localStorage.getItem('cf_cart')) || [];
let filteredProducts = [...products];
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
    updateLoginStatus();
    
    // Check current page and initialize accordingly
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initializeHomePage();
            break;
        case 'products.html':
            initializeProductsPage();
            break;
        case 'cart.html':
            checkAuthAndInitializeCart();
            break;
        case 'contact.html':
            initializeContactPage();
            break;
        case 'login.html':
            initializeLoginPage();
            break;
    }
    
    // Initialize search functionality
    initializeSearch();
});

// Initialize Home Page
function initializeHomePage() {
    renderFeaturedProducts();
}

// Initialize Products Page
function initializeProductsPage() {
    renderProducts();
    initializeFilters();
    updateProductCount();
}

// Initialize Cart Page
function initializeCartPage() {
    renderCart();
}

// Initialize Contact Page
function initializeContactPage() {
    initializeContactForm();
}

// Initialize Login Page
function initializeLoginPage() {
    initializeLoginForm();
}

// Check Authentication and Initialize Cart
function checkAuthAndInitializeCart() {
    if (!isLoggedIn) {
        showNotLoggedInMessage();
        return;
    }
    initializeCartPage();
}

// Show Not Logged In Message
function showNotLoggedInMessage() {
    const notLoggedInMessage = document.getElementById('notLoggedInMessage');
    const cartContent = document.getElementById('cartContent');
    
    if (notLoggedInMessage) {
        notLoggedInMessage.style.display = 'block';
    }
    if (cartContent) {
        cartContent.style.display = 'none';
    }
}

// Initialize Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Handle Search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (window.location.pathname.includes('products.html')) {
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        renderProducts();
        updateProductCount();
    }
}

// Initialize Filters
function initializeFilters() {
    const filterCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilter);
    });
}

// Handle Filter
function handleFilter() {
    const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value)
        .filter(value => value !== 'all');
    
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.category.toLowerCase().includes(searchTerm);
        
        if (selectedCategories.length === 0 || selectedCategories.includes('all')) {
            return matchesSearch;
        }
        
        return matchesSearch && selectedCategories.includes(product.category);
    });
    
    renderProducts();
    updateProductCount();
}

// Render Featured Products (Home Page)
function renderFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;
    
    const featuredProducts = products.slice(0, 8); // Show first 8 products as featured
    
    featuredContainer.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
    
    // Add event listeners to add to cart buttons
    addCartEventListeners();
}

// Render Products (Products Page)
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    // Add event listeners to add to cart buttons
    addCartEventListeners();
}

// Create Product Card HTML
function createProductCard(product) {
    const discountedPrice = product.price - (product.price * product.discount / 100);
    
    return `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card product-card h-100">
                <div class="position-relative">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" onerror="this.src='assets/placeholder.jpg'">
                    <span class="discount-badge">-${product.discount}%</span>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.category}</p>
                    <div class="mt-auto">
                        <div class="d-flex align-items-center mb-3">
                            <span class="price text-primary">$${discountedPrice.toFixed(2)}</span>
                            <small class="text-muted text-decoration-line-through ms-2">$${product.price.toFixed(2)}</small>
                        </div>
                        <button class="btn btn-dark btn-sm add-to-cart" data-product-id="${product.id}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add Cart Event Listeners
function addCartEventListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = parseInt(this.getAttribute('data-product-id'));
            addToCart(productId);
        });
    });
}

// Add to Cart
function addToCart(productId) {
    // Check if user is logged in
    if (!isLoggedIn) {
        showToast('Please login to add items to cart!', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price - (product.price * product.discount / 100),
            image: product.image,
            category: product.category,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartBadge();
    showToast('Product added to cart!', 'success');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    renderCart();
    showToast('Product removed from cart!', 'info');
}

// Update Cart Quantity
function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartBadge();
        renderCart();
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('cf_cart', JSON.stringify(cart));
}

// Update Cart Badge
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Render Cart
function renderCart() {
    const cartTableBody = document.getElementById('cartTableBody');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    
    if (!cartTableBody || !emptyCart || !cartContent) return;
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartContent.style.display = 'block';
    
    cartTableBody.innerHTML = cart.map(item => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image me-3" onerror="this.src='assets/placeholder.jpg'">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">${item.category}</small>
                    </div>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartQuantity(${item.id}, parseInt(this.value))">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    updateCartTotals();
}

// Update Cart Totals
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 9.99;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Update Product Count
function updateProductCount() {
    const productCount = document.getElementById('productCount');
    if (productCount) {
        productCount.textContent = `${filteredProducts.length} products found`;
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'warning');
        return;
    }
    
    cart = [];
    saveCart();
    updateCartBadge();
    renderCart();
    showToast('Order placed successfully! Thank you for shopping with us!', 'success');
}

// Initialize Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Handle Contact Form Submit
function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validation
    let isValid = true;
    
    if (!name) {
        showFieldError('name', 'Name is required');
        isValid = false;
    } else {
        clearFieldError('name');
    }
    
    if (!email || !email.includes('@')) {
        showFieldError('email', 'Valid email is required');
        isValid = false;
    } else {
        clearFieldError('email');
    }
    
    if (!message) {
        showFieldError('message', 'Message is required');
        isValid = false;
    } else {
        clearFieldError('message');
    }
    
    if (isValid) {
        // Save message to localStorage
        const messages = JSON.parse(localStorage.getItem('cf_messages')) || [];
        messages.push({
            name,
            email,
            message,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('cf_messages', JSON.stringify(messages));
        
        // Show success message
        showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Clear form
        contactForm.reset();
    }
}

// Show Field Error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field && errorElement) {
        field.classList.add('is-invalid');
        errorElement.textContent = message;
    }
}

// Clear Field Error
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field && errorElement) {
        field.classList.remove('is-invalid');
        errorElement.textContent = '';
    }
}

// Show Toast Notification
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : type === 'error' ? 'danger' : 'primary'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.id = toastId;
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000
    });
    
    bsToast.show();
    
    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// Global functions for cart operations (called from HTML)
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;

// Initialize checkout button event listener
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});

// Authentication Functions

// Update Login Status in Navbar
function updateLoginStatus() {
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        if (isLoggedIn) {
            loginLink.textContent = 'Logout';
            loginLink.href = '#';
            loginLink.onclick = logout;
        } else {
            loginLink.textContent = 'Login';
            loginLink.href = 'login.html';
            loginLink.onclick = null;
        }
    }
}

// Initialize Login Form
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Registration feature coming soon!', 'info');
        });
    }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validation
    let isValid = true;
    
    if (!email || !email.includes('@')) {
        showFieldError('email', 'Valid email is required');
        isValid = false;
    } else {
        clearFieldError('email');
    }
    
    if (!password || password.length < 6) {
        showFieldError('password', 'Password must be at least 6 characters');
        isValid = false;
    } else {
        clearFieldError('password');
    }
    
    if (isValid) {
        // Accept any valid email and password (no backend required)
        isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        showToast('Login successful! Welcome to United Deals!', 'success');
        
        // Redirect to products page after 1 second
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 1000);
    }
}

// Logout Function
function logout(e) {
    e.preventDefault();
    
    isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    // Clear cart on logout (optional)
    cart = [];
    saveCart();
    updateCartBadge();
    
    showToast('Logged out successfully!', 'info');
    
    // Update navbar
    updateLoginStatus();
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Check if user is authenticated (for protected routes)
function requireAuth() {
    if (!isLoggedIn) {
        showToast('Please login to access this feature!', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
    return true;
}
