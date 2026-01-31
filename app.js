// API Configuration
const API_URL = 'https://super-mall-web-application.onrender.com/api';

// State Management
let state = {
    isAdmin: false,
    isUserLoggedIn: false,
    currentUser: null,
    currentPage: 'home',
    currentAdminPage: 'shops',
    shops: [],
    offers: [],
    categories: [],
    floors: [],
    selectedProducts: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadData();
    checkAdminSession();
    checkUserSession();
});

// Event Listeners
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            navigateToPage(page);
        });
    });

    // Admin Navigation
    document.querySelectorAll('.admin-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.adminPage;
            navigateToAdminPage(page);
        });
    });

    // Admin Login
    document.getElementById('adminLoginBtn').addEventListener('click', () => {
        openModal('adminLoginModal');
    });

    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // User Login & Registration
    document.getElementById('userLoginBtn').addEventListener('click', () => {
        openModal('userLoginModal');
    });

    document.getElementById('userRegisterBtn').addEventListener('click', () => {
        openModal('userRegisterModal');
    });

    document.getElementById('userLoginForm').addEventListener('submit', handleUserLogin);
    document.getElementById('userRegisterForm').addEventListener('submit', handleUserRegister);
    document.getElementById('userLogoutBtn').addEventListener('click', handleUserLogout);

    // Switch between login and register
    document.getElementById('switchToRegister').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('userLoginModal');
        openModal('userRegisterModal');
    });

    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('userRegisterModal');
        openModal('userLoginModal');
    });

    // Modal Close Buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Admin CRUD Buttons
    document.getElementById('addShopBtn').addEventListener('click', () => openShopForm());
    document.getElementById('addOfferBtn').addEventListener('click', () => openOfferForm());
    document.getElementById('addCategoryBtn').addEventListener('click', () => openCategoryForm());
    document.getElementById('addFloorBtn').addEventListener('click', () => openFloorForm());

    // Forms
    document.getElementById('shopForm').addEventListener('submit', handleShopSubmit);
    document.getElementById('offerForm').addEventListener('submit', handleOfferSubmit);
    document.getElementById('categoryForm').addEventListener('submit', handleCategorySubmit);
    document.getElementById('floorForm').addEventListener('submit', handleFloorSubmit);

    // Filters
    document.getElementById('categoryFilter').addEventListener('change', applyShopFilters);
    document.getElementById('floorFilter').addEventListener('change', applyShopFilters);
    document.getElementById('searchShops').addEventListener('input', applyShopFilters);
    document.getElementById('shopFilterOffers').addEventListener('change', filterOffers);
}

// Navigation
function navigateToPage(page) {
    state.currentPage = page;
    
    // Update nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(page + 'Page').classList.add('active');
    
    // Load page-specific data
    switch(page) {
        case 'home':
            renderHomePage();
            break;
        case 'shops':
            renderShops();
            break;
        case 'offers':
            renderOffers();
            break;
        case 'categories':
            renderCategories();
            break;
        case 'floors':
            renderFloors();
            break;
        case 'compare':
            renderComparePage();
            break;
    }
}

function navigateToAdminPage(page) {
    state.currentAdminPage = page;
    
    document.querySelectorAll('.admin-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.adminPage === page) {
            link.classList.add('active');
        }
    });
    
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('admin' + capitalizeFirst(page)).classList.add('active');
    
    // Render admin content
    switch(page) {
        case 'shops':
            renderAdminShops();
            break;
        case 'offers':
            renderAdminOffers();
            break;
        case 'categories':
            renderAdminCategories();
            break;
        case 'floors':
            renderAdminFloors();
            break;
    }
}

// Data Loading
async function loadData() {
    try {
        await Promise.all([
            fetchShops(),
            fetchOffers(),
            fetchCategories(),
            fetchFloors()
        ]);
        renderHomePage();
    } catch (error) {
        console.error('Error loading data:', error);
        // Use sample data if API is not available
        loadSampleData();
    }
}

async function fetchShops() {
    try {
        const response = await fetch(`${API_URL}/shops`);
        if (response.ok) {
            state.shops = await response.json();
        } else {
            throw new Error('Failed to fetch shops');
        }
    } catch (error) {
        console.log('Using sample data for shops');
    }
}

async function fetchOffers() {
    try {
        const response = await fetch(`${API_URL}/offers`);
        if (response.ok) {
            state.offers = await response.json();
        } else {
            throw new Error('Failed to fetch offers');
        }
    } catch (error) {
        console.log('Using sample data for offers');
    }
}

async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (response.ok) {
            state.categories = await response.json();
        } else {
            throw new Error('Failed to fetch categories');
        }
    } catch (error) {
        console.log('Using sample data for categories');
    }
}

async function fetchFloors() {
    try {
        const response = await fetch(`${API_URL}/floors`);
        if (response.ok) {
            state.floors = await response.json();
        } else {
            throw new Error('Failed to fetch floors');
        }
    } catch (error) {
        console.log('Using sample data for floors');
    }
}

// Sample Data
function loadSampleData() {
    state.categories = [
        { id: 1, name: 'Fashion & Apparel', description: 'Clothing, accessories, and footwear', icon: '👗' },
        { id: 2, name: 'Electronics', description: 'Latest gadgets and technology', icon: '📱' },
        { id: 3, name: 'Food & Beverages', description: 'Restaurants and food courts', icon: '🍽️' },
        { id: 4, name: 'Home & Lifestyle', description: 'Furniture and home decor', icon: '🏠' },
        { id: 5, name: 'Beauty & Cosmetics', description: 'Skincare and makeup products', icon: '💄' },
        { id: 6, name: 'Sports & Fitness', description: 'Sportswear and equipment', icon: '⚽' }
    ];
    
    state.floors = [
        { id: 1, number: 1, name: 'Ground Floor', description: 'Fashion & Accessories' },
        { id: 2, number: 2, name: 'First Floor', description: 'Electronics & Technology' },
        { id: 3, number: 3, name: 'Second Floor', description: 'Food Court & Restaurants' },
        { id: 4, number: 4, name: 'Third Floor', description: 'Home & Lifestyle' },
        { id: 5, number: 5, name: 'Fourth Floor', description: 'Entertainment & Cinema' }
    ];
    
    state.shops = [
        { id: 1, name: 'Zara', category: 1, floor: 1, shopNumber: 'G-101', description: 'International fashion retailer', contact: '+91 98765 43210', email: 'zara@luxeplaza.com', hours: '10:00 AM - 9:00 PM' },
        { id: 2, name: 'H&M', category: 1, floor: 1, shopNumber: 'G-105', description: 'Swedish fashion brand', contact: '+91 98765 43211', email: 'hm@luxeplaza.com', hours: '10:00 AM - 9:00 PM' },
        { id: 3, name: 'Apple Store', category: 2, floor: 2, shopNumber: 'F1-201', description: 'Official Apple retailer', contact: '+91 98765 43212', email: 'apple@luxeplaza.com', hours: '10:00 AM - 9:00 PM' },
        { id: 4, name: 'Samsung Experience', category: 2, floor: 2, shopNumber: 'F1-205', description: 'Samsung products showcase', contact: '+91 98765 43213', email: 'samsung@luxeplaza.com', hours: '10:00 AM - 9:00 PM' },
        { id: 5, name: 'Starbucks', category: 3, floor: 3, shopNumber: 'F2-301', description: 'Coffee and snacks', contact: '+91 98765 43214', email: 'starbucks@luxeplaza.com', hours: '8:00 AM - 10:00 PM' },
        { id: 6, name: 'McDonald\'s', category: 3, floor: 3, shopNumber: 'F2-310', description: 'Fast food restaurant', contact: '+91 98765 43215', email: 'mcdonalds@luxeplaza.com', hours: '10:00 AM - 11:00 PM' },
        { id: 7, name: 'IKEA', category: 4, floor: 4, shopNumber: 'F3-401', description: 'Furniture and home accessories', contact: '+91 98765 43216', email: 'ikea@luxeplaza.com', hours: '10:00 AM - 9:00 PM' },
        { id: 8, name: 'Sephora', category: 5, floor: 1, shopNumber: 'G-120', description: 'Beauty and cosmetics', contact: '+91 98765 43217', email: 'sephora@luxeplaza.com', hours: '10:00 AM - 9:00 PM' },
        { id: 9, name: 'Nike', category: 6, floor: 1, shopNumber: 'G-115', description: 'Sportswear and equipment', contact: '+91 98765 43218', email: 'nike@luxeplaza.com', hours: '10:00 AM - 9:00 PM' },
        { id: 10, name: 'Adidas', category: 6, floor: 1, shopNumber: 'G-118', description: 'Sports apparel and footwear', contact: '+91 98765 43219', email: 'adidas@luxeplaza.com', hours: '10:00 AM - 9:00 PM' }
    ];
    
    state.offers = [
        { id: 1, title: 'Summer Sale', shopId: 1, discount: 50, description: 'Up to 50% off on all summer collections', validFrom: '2026-01-20', validUntil: '2026-02-28' },
        { id: 2, title: 'New Year Offer', shopId: 2, discount: 40, description: '40% discount on selected items', validFrom: '2026-01-15', validUntil: '2026-02-15' },
        { id: 3, title: 'Tech Bonanza', shopId: 3, discount: 15, description: 'Special discounts on latest Apple products', validFrom: '2026-01-25', validUntil: '2026-02-10' },
        { id: 4, title: 'Galaxy Days', shopId: 4, discount: 25, description: '25% off on Samsung Galaxy series', validFrom: '2026-01-20', validUntil: '2026-03-01' },
        { id: 5, title: 'Coffee Club', shopId: 5, discount: 10, description: 'Buy 2 get 1 free on all beverages', validFrom: '2026-01-01', validUntil: '2026-12-31' },
        { id: 6, title: 'Happy Meal Deal', shopId: 6, discount: 20, description: '20% off on combo meals', validFrom: '2026-01-15', validUntil: '2026-02-28' },
        { id: 7, title: 'Home Makeover', shopId: 7, discount: 30, description: '30% off on furniture collection', validFrom: '2026-01-20', validUntil: '2026-03-15' },
        { id: 8, title: 'Beauty Festival', shopId: 8, discount: 35, description: 'Flat 35% off on makeup products', validFrom: '2026-01-25', validUntil: '2026-02-25' }
    ];
}

// Rendering Functions
function renderHomePage() {
    // Update stats
    document.getElementById('totalShops').textContent = state.shops.length;
    document.getElementById('totalOffers').textContent = state.offers.length;
    document.getElementById('totalCategories').textContent = state.categories.length;
    
    // Animate stats
    animateValue('totalShops', 0, state.shops.length, 1000);
    animateValue('totalOffers', 0, state.offers.length, 1000);
    animateValue('totalCategories', 0, state.categories.length, 1000);
    
    // Render featured offers (top 6)
    const featuredOffers = state.offers.slice(0, 6);
    const container = document.getElementById('featuredOffers');
    container.innerHTML = featuredOffers.map(offer => createOfferCard(offer)).join('');
}

function renderShops(filtered = null) {
    const shopsToRender = filtered || state.shops;
    const container = document.getElementById('shopsList');
    
    if (shopsToRender.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--color-text-light);">No shops found</p>';
        return;
    }
    
    container.innerHTML = shopsToRender.map(shop => createShopCard(shop)).join('');
    
    // Add click events
    document.querySelectorAll('.shop-card').forEach(card => {
        card.addEventListener('click', () => {
            const shopId = parseInt(card.dataset.shopId);
            showShopDetails(shopId);
        });
    });
    
    // Populate filters
    populateShopFilters();
}

function renderOffers(filtered = null) {
    const offersToRender = filtered || state.offers;
    const container = document.getElementById('offersList');
    
    if (offersToRender.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--color-text-light);">No offers found</p>';
        return;
    }
    
    container.innerHTML = offersToRender.map(offer => createOfferCard(offer)).join('');
    
    // Populate shop filter
    populateOffersFilter();
}

function renderCategories() {
    const container = document.getElementById('categoriesList');
    container.innerHTML = state.categories.map(category => {
        const shopCount = state.shops.filter(s => s.category === category.id).length;
        return `
            <div class="category-card" data-category-id="${category.id}">
                <div class="category-icon">${category.icon}</div>
                <div class="category-name">${category.name}</div>
                <div class="category-count">${shopCount} shops</div>
            </div>
        `;
    }).join('');
    
    // Add click events
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoryId = parseInt(card.dataset.categoryId);
            showCategoryShops(categoryId);
        });
    });
}

function renderFloors() {
    const container = document.getElementById('floorsList');
    container.innerHTML = state.floors.map(floor => {
        const floorShops = state.shops.filter(s => s.floor === floor.id);
        return `
            <div class="floor-section">
                <div class="floor-header">
                    <div>
                        <div class="floor-title">Floor ${floor.number} - ${floor.name}</div>
                        <p style="color: var(--color-text-light); margin-top: 0.5rem;">${floor.description}</p>
                    </div>
                    <div style="color: var(--color-secondary); font-weight: 600;">${floorShops.length} shops</div>
                </div>
                <div class="floor-shops-grid">
                    ${floorShops.map(shop => {
                        const category = state.categories.find(c => c.id === shop.category);
                        return `
                            <div class="floor-shop-item" onclick="showShopDetails(${shop.id})">
                                <div style="font-weight: 600; color: var(--color-primary);">${shop.name}</div>
                                <div style="font-size: 0.85rem; color: var(--color-text-light); margin-top: 0.25rem;">
                                    ${shop.shopNumber} | ${category ? category.name : 'N/A'}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function renderComparePage() {
    const container = document.getElementById('compareProductSelection');
    
    // Group shops by category for comparison
    const shopsByCategory = {};
    state.shops.forEach(shop => {
        if (!shopsByCategory[shop.category]) {
            shopsByCategory[shop.category] = [];
        }
        shopsByCategory[shop.category].push(shop);
    });
    
    container.innerHTML = state.shops.map(shop => {
        const category = state.categories.find(c => c.id === shop.category);
        const isSelected = state.selectedProducts.includes(shop.id);
        return `
            <div class="product-select-item ${isSelected ? 'selected' : ''}" data-shop-id="${shop.id}">
                <div style="font-weight: 600;">${shop.name}</div>
                <div style="font-size: 0.85rem; color: var(--color-text-light); margin-top: 0.25rem;">
                    ${category ? category.name : 'N/A'}
                </div>
            </div>
        `;
    }).join('');
    
    // Add click events
    document.querySelectorAll('.product-select-item').forEach(item => {
        item.addEventListener('click', () => {
            const shopId = parseInt(item.dataset.shopId);
            toggleProductSelection(shopId);
        });
    });
    
    renderComparison();
}

function renderComparison() {
    const container = document.getElementById('comparisonTable');
    
    if (state.selectedProducts.length < 2) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--color-text-light);">Select at least 2 products to compare</p>';
        return;
    }
    
    const selectedShops = state.shops.filter(s => state.selectedProducts.includes(s.id));
    const offers = state.offers.filter(o => state.selectedProducts.includes(o.shopId));
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Feature</th>
                    ${selectedShops.map(shop => `<th>${shop.name}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Category</strong></td>
                    ${selectedShops.map(shop => {
                        const category = state.categories.find(c => c.id === shop.category);
                        return `<td>${category ? category.name : 'N/A'}</td>`;
                    }).join('')}
                </tr>
                <tr>
                    <td><strong>Floor</strong></td>
                    ${selectedShops.map(shop => {
                        const floor = state.floors.find(f => f.id === shop.floor);
                        return `<td>${floor ? floor.name : 'N/A'}</td>`;
                    }).join('')}
                </tr>
                <tr>
                    <td><strong>Location</strong></td>
                    ${selectedShops.map(shop => `<td>${shop.shopNumber}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>Hours</strong></td>
                    ${selectedShops.map(shop => `<td>${shop.hours || 'N/A'}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>Contact</strong></td>
                    ${selectedShops.map(shop => `<td>${shop.contact || 'N/A'}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>Current Offers</strong></td>
                    ${selectedShops.map(shop => {
                        const shopOffers = offers.filter(o => o.shopId === shop.id);
                        if (shopOffers.length === 0) return '<td>No offers</td>';
                        return `<td>${shopOffers.map(o => `${o.discount}% off`).join(', ')}</td>`;
                    }).join('')}
                </tr>
            </tbody>
        </table>
    `;
}

// Card Creation Functions
function createShopCard(shop) {
    const category = state.categories.find(c => c.id === shop.category);
    const floor = state.floors.find(f => f.id === shop.floor);
    const shopOffers = state.offers.filter(o => o.shopId === shop.id);
    
    return `
        <div class="shop-card" data-shop-id="${shop.id}">
            <div class="shop-card-header">
                <div class="shop-card-title">${shop.name}</div>
                <div class="shop-card-meta">
                    <span>${category ? category.name : 'N/A'}</span>
                    <span>${floor ? floor.name : 'N/A'}</span>
                </div>
            </div>
            <div class="shop-card-body">
                <div class="shop-card-description">${shop.description || 'No description available'}</div>
                <div class="shop-card-info">
                    <span>📍 ${shop.shopNumber}</span>
                    <span>🕐 ${shop.hours || 'N/A'}</span>
                </div>
            </div>
            <div class="shop-card-footer">
                <span>${shopOffers.length} Active Offer${shopOffers.length !== 1 ? 's' : ''}</span>
                <button class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">View Details</button>
            </div>
        </div>
    `;
}

function createOfferCard(offer) {
    const shop = state.shops.find(s => s.id === offer.shopId);
    
    return `
        <div class="offer-card">
            ${offer.discount ? `
                <div class="offer-badge">
                    <div class="offer-discount">${offer.discount}%</div>
                    <div class="offer-off">OFF</div>
                </div>
            ` : ''}
            <div class="offer-card-body">
                <div class="offer-card-title">${offer.title}</div>
                <div class="offer-shop-name">${shop ? shop.name : 'Unknown Shop'}</div>
                <div class="offer-description">${offer.description}</div>
                <div class="offer-validity">
                    Valid: ${formatDate(offer.validFrom)} - ${formatDate(offer.validUntil)}
                </div>
            </div>
        </div>
    `;
}

// Filters
function populateShopFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const floorFilter = document.getElementById('floorFilter');
    
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
        state.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    floorFilter.innerHTML = '<option value="">All Floors</option>' +
        state.floors.map(f => `<option value="${f.id}">Floor ${f.number} - ${f.name}</option>`).join('');
}

function populateOffersFilter() {
    const shopFilter = document.getElementById('shopFilterOffers');
    shopFilter.innerHTML = '<option value="">All Shops</option>' +
        state.shops.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
}

function applyShopFilters() {
    const categoryId = document.getElementById('categoryFilter').value;
    const floorId = document.getElementById('floorFilter').value;
    const searchTerm = document.getElementById('searchShops').value.toLowerCase();
    
    let filtered = state.shops;
    
    if (categoryId) {
        filtered = filtered.filter(s => s.category === parseInt(categoryId));
    }
    
    if (floorId) {
        filtered = filtered.filter(s => s.floor === parseInt(floorId));
    }
    
    if (searchTerm) {
        filtered = filtered.filter(s => 
            s.name.toLowerCase().includes(searchTerm) ||
            (s.description && s.description.toLowerCase().includes(searchTerm))
        );
    }
    
    renderShops(filtered);
}

function filterOffers() {
    const shopId = document.getElementById('shopFilterOffers').value;
    
    if (!shopId) {
        renderOffers();
        return;
    }
    
    const filtered = state.offers.filter(o => o.shopId === parseInt(shopId));
    renderOffers(filtered);
}

// Shop Details
function showShopDetails(shopId) {
    const shop = state.shops.find(s => s.id === shopId);
    if (!shop) return;
    
    const category = state.categories.find(c => c.id === shop.category);
    const floor = state.floors.find(f => f.id === shop.floor);
    const shopOffers = state.offers.filter(o => o.shopId === shop.id);
    
    const content = `
        <div style="padding: 1rem;">
            <h2 style="font-family: var(--font-display); font-size: 2rem; color: var(--color-primary); margin-bottom: 1rem;">${shop.name}</h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div>
                    <strong>Category:</strong><br>
                    ${category ? category.name : 'N/A'}
                </div>
                <div>
                    <strong>Floor:</strong><br>
                    ${floor ? floor.name : 'N/A'}
                </div>
                <div>
                    <strong>Shop Number:</strong><br>
                    ${shop.shopNumber}
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <strong>Description:</strong>
                <p style="color: var(--color-text-light); margin-top: 0.5rem;">${shop.description || 'No description available'}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div>
                    <strong>Contact:</strong><br>
                    ${shop.contact || 'N/A'}
                </div>
                <div>
                    <strong>Email:</strong><br>
                    ${shop.email || 'N/A'}
                </div>
                <div>
                    <strong>Hours:</strong><br>
                    ${shop.hours || 'N/A'}
                </div>
            </div>
            
            ${shopOffers.length > 0 ? `
                <div>
                    <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-primary); margin-bottom: 1rem;">Current Offers</h3>
                    <div style="display: grid; gap: 1rem;">
                        ${shopOffers.map(offer => `
                            <div style="background: var(--color-light); padding: 1rem; border-radius: 4px; border-left: 4px solid var(--color-secondary);">
                                <div style="font-weight: 600; color: var(--color-primary); margin-bottom: 0.5rem;">${offer.title}</div>
                                <div style="color: var(--color-text-light); margin-bottom: 0.5rem;">${offer.description}</div>
                                <div style="font-size: 0.85rem; color: var(--color-secondary);">
                                    ${offer.discount}% OFF | Valid: ${formatDate(offer.validFrom)} - ${formatDate(offer.validUntil)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('shopDetailsContent').innerHTML = content;
    openModal('shopDetailsModal');
}

function showCategoryShops(categoryId) {
    const category = state.categories.find(c => c.id === categoryId);
    navigateToPage('shops');
    document.getElementById('categoryFilter').value = categoryId;
    applyShopFilters();
}

// Compare Products
function toggleProductSelection(shopId) {
    const index = state.selectedProducts.indexOf(shopId);
    if (index > -1) {
        state.selectedProducts.splice(index, 1);
    } else {
        if (state.selectedProducts.length >= 4) {
            alert('You can compare up to 4 products at a time');
            return;
        }
        state.selectedProducts.push(shopId);
    }
    renderComparePage();
}

// Admin Functions
function checkAdminSession() {
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    if (isAdmin) {
        state.isAdmin = true;
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Simple authentication (in production, this should be done on the backend)
    if (username === 'admin' && password === 'admin123') {
        state.isAdmin = true;
        localStorage.setItem('adminLoggedIn', 'true');
        closeModal('adminLoginModal');
        showAdminDashboard();
    } else {
        alert('Invalid credentials. Use admin/admin123');
    }
}

function handleLogout() {
    state.isAdmin = false;
    localStorage.removeItem('adminLoggedIn');
    hideAdminDashboard();
}

function showAdminDashboard() {
    document.getElementById('adminDashboard').classList.add('active');
    document.querySelector('.main-nav').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
    renderAdminShops();
}

function hideAdminDashboard() {
    document.getElementById('adminDashboard').classList.remove('active');
    document.querySelector('.main-nav').style.display = 'block';
    document.getElementById('mainContent').style.display = 'block';
}

// Admin Rendering
function renderAdminShops() {
    const container = document.getElementById('adminShopsList');
    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Floor</th>
                    <th>Shop Number</th>
                    <th>Contact</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${state.shops.map(shop => {
                    const category = state.categories.find(c => c.id === shop.category);
                    const floor = state.floors.find(f => f.id === shop.floor);
                    return `
                        <tr>
                            <td>${shop.id}</td>
                            <td>${shop.name}</td>
                            <td>${category ? category.name : 'N/A'}</td>
                            <td>${floor ? floor.name : 'N/A'}</td>
                            <td>${shop.shopNumber}</td>
                            <td>${shop.contact || 'N/A'}</td>
                            <td class="admin-actions">
                                <button class="btn-icon btn-edit" onclick="editShop(${shop.id})">✏️ Edit</button>
                                <button class="btn-icon btn-delete" onclick="deleteShop(${shop.id})">🗑️ Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function renderAdminOffers() {
    const container = document.getElementById('adminOffersList');
    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Shop</th>
                    <th>Discount</th>
                    <th>Valid From</th>
                    <th>Valid Until</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${state.offers.map(offer => {
                    const shop = state.shops.find(s => s.id === offer.shopId);
                    return `
                        <tr>
                            <td>${offer.id}</td>
                            <td>${offer.title}</td>
                            <td>${shop ? shop.name : 'N/A'}</td>
                            <td>${offer.discount}%</td>
                            <td>${formatDate(offer.validFrom)}</td>
                            <td>${formatDate(offer.validUntil)}</td>
                            <td class="admin-actions">
                                <button class="btn-icon btn-edit" onclick="editOffer(${offer.id})">✏️ Edit</button>
                                <button class="btn-icon btn-delete" onclick="deleteOffer(${offer.id})">🗑️ Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function renderAdminCategories() {
    const container = document.getElementById('adminCategoriesList');
    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Shops Count</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${state.categories.map(category => {
                    const shopCount = state.shops.filter(s => s.category === category.id).length;
                    return `
                        <tr>
                            <td>${category.id}</td>
                            <td style="font-size: 1.5rem;">${category.icon}</td>
                            <td>${category.name}</td>
                            <td>${category.description || 'N/A'}</td>
                            <td>${shopCount}</td>
                            <td class="admin-actions">
                                <button class="btn-icon btn-edit" onclick="editCategory(${category.id})">✏️ Edit</button>
                                <button class="btn-icon btn-delete" onclick="deleteCategory(${category.id})">🗑️ Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function renderAdminFloors() {
    const container = document.getElementById('adminFloorsList');
    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Floor Number</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Shops Count</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${state.floors.map(floor => {
                    const shopCount = state.shops.filter(s => s.floor === floor.id).length;
                    return `
                        <tr>
                            <td>${floor.id}</td>
                            <td>${floor.number}</td>
                            <td>${floor.name}</td>
                            <td>${floor.description || 'N/A'}</td>
                            <td>${shopCount}</td>
                            <td class="admin-actions">
                                <button class="btn-icon btn-edit" onclick="editFloor(${floor.id})">✏️ Edit</button>
                                <button class="btn-icon btn-delete" onclick="deleteFloor(${floor.id})">🗑️ Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Form Functions
function openShopForm(shopId = null) {
    const form = document.getElementById('shopForm');
    const title = document.getElementById('shopFormTitle');
    
    // Populate category and floor dropdowns
    document.getElementById('shopCategory').innerHTML = state.categories.map(c => 
        `<option value="${c.id}">${c.name}</option>`
    ).join('');
    
    document.getElementById('shopFloor').innerHTML = state.floors.map(f => 
        `<option value="${f.id}">Floor ${f.number} - ${f.name}</option>`
    ).join('');
    
    if (shopId) {
        const shop = state.shops.find(s => s.id === shopId);
        if (shop) {
            title.textContent = 'Edit Shop';
            document.getElementById('shopId').value = shop.id;
            document.getElementById('shopName').value = shop.name;
            document.getElementById('shopCategory').value = shop.category;
            document.getElementById('shopFloor').value = shop.floor;
            document.getElementById('shopNumber').value = shop.shopNumber;
            document.getElementById('shopDescription').value = shop.description || '';
            document.getElementById('shopContact').value = shop.contact || '';
            document.getElementById('shopEmail').value = shop.email || '';
            document.getElementById('shopHours').value = shop.hours || '';
        }
    } else {
        title.textContent = 'Add New Shop';
        form.reset();
        document.getElementById('shopId').value = '';
    }
    
    openModal('shopFormModal');
}

function openOfferForm(offerId = null) {
    const form = document.getElementById('offerForm');
    const title = document.getElementById('offerFormTitle');
    
    // Populate shop dropdown
    document.getElementById('offerShop').innerHTML = state.shops.map(s => 
        `<option value="${s.id}">${s.name}</option>`
    ).join('');
    
    if (offerId) {
        const offer = state.offers.find(o => o.id === offerId);
        if (offer) {
            title.textContent = 'Edit Offer';
            document.getElementById('offerId').value = offer.id;
            document.getElementById('offerTitle').value = offer.title;
            document.getElementById('offerShop').value = offer.shopId;
            document.getElementById('offerDiscount').value = offer.discount;
            document.getElementById('offerDescription').value = offer.description || '';
            document.getElementById('offerValidFrom').value = offer.validFrom;
            document.getElementById('offerValidUntil').value = offer.validUntil;
        }
    } else {
        title.textContent = 'Add New Offer';
        form.reset();
        document.getElementById('offerId').value = '';
    }
    
    openModal('offerFormModal');
}

function openCategoryForm(categoryId = null) {
    const form = document.getElementById('categoryForm');
    const title = document.getElementById('categoryFormTitle');
    
    if (categoryId) {
        const category = state.categories.find(c => c.id === categoryId);
        if (category) {
            title.textContent = 'Edit Category';
            document.getElementById('categoryId').value = category.id;
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categoryDescription').value = category.description || '';
            document.getElementById('categoryIcon').value = category.icon || '';
        }
    } else {
        title.textContent = 'Add New Category';
        form.reset();
        document.getElementById('categoryId').value = '';
    }
    
    openModal('categoryFormModal');
}

function openFloorForm(floorId = null) {
    const form = document.getElementById('floorForm');
    const title = document.getElementById('floorFormTitle');
    
    if (floorId) {
        const floor = state.floors.find(f => f.id === floorId);
        if (floor) {
            title.textContent = 'Edit Floor';
            document.getElementById('floorId').value = floor.id;
            document.getElementById('floorNumber').value = floor.number;
            document.getElementById('floorName').value = floor.name;
            document.getElementById('floorDescription').value = floor.description || '';
        }
    } else {
        title.textContent = 'Add New Floor';
        form.reset();
        document.getElementById('floorId').value = '';
    }
    
    openModal('floorFormModal');
}

// Form Handlers
async function handleShopSubmit(e) {
    e.preventDefault();
    
    const shopId = document.getElementById('shopId').value;
    const shopData = {
        name: document.getElementById('shopName').value,
        category: parseInt(document.getElementById('shopCategory').value),
        floor: parseInt(document.getElementById('shopFloor').value),
        shopNumber: document.getElementById('shopNumber').value,
        description: document.getElementById('shopDescription').value,
        contact: document.getElementById('shopContact').value,
        email: document.getElementById('shopEmail').value,
        hours: document.getElementById('shopHours').value
    };
    
    if (shopId) {
        // Update existing shop
        const index = state.shops.findIndex(s => s.id === parseInt(shopId));
        if (index !== -1) {
            state.shops[index] = { ...state.shops[index], ...shopData };
        }
    } else {
        // Add new shop
        const newId = Math.max(...state.shops.map(s => s.id), 0) + 1;
        state.shops.push({ id: newId, ...shopData });
    }
    
    closeModal('shopFormModal');
    renderAdminShops();
    alert('Shop saved successfully!');
}

async function handleOfferSubmit(e) {
    e.preventDefault();
    
    const offerId = document.getElementById('offerId').value;
    const offerData = {
        title: document.getElementById('offerTitle').value,
        shopId: parseInt(document.getElementById('offerShop').value),
        discount: parseInt(document.getElementById('offerDiscount').value),
        description: document.getElementById('offerDescription').value,
        validFrom: document.getElementById('offerValidFrom').value,
        validUntil: document.getElementById('offerValidUntil').value
    };
    
    if (offerId) {
        // Update existing offer
        const index = state.offers.findIndex(o => o.id === parseInt(offerId));
        if (index !== -1) {
            state.offers[index] = { ...state.offers[index], ...offerData };
        }
    } else {
        // Add new offer
        const newId = Math.max(...state.offers.map(o => o.id), 0) + 1;
        state.offers.push({ id: newId, ...offerData });
    }
    
    closeModal('offerFormModal');
    renderAdminOffers();
    alert('Offer saved successfully!');
}

async function handleCategorySubmit(e) {
    e.preventDefault();
    
    const categoryId = document.getElementById('categoryId').value;
    const categoryData = {
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value,
        icon: document.getElementById('categoryIcon').value
    };
    
    if (categoryId) {
        // Update existing category
        const index = state.categories.findIndex(c => c.id === parseInt(categoryId));
        if (index !== -1) {
            state.categories[index] = { ...state.categories[index], ...categoryData };
        }
    } else {
        // Add new category
        const newId = Math.max(...state.categories.map(c => c.id), 0) + 1;
        state.categories.push({ id: newId, ...categoryData });
    }
    
    closeModal('categoryFormModal');
    renderAdminCategories();
    alert('Category saved successfully!');
}

async function handleFloorSubmit(e) {
    e.preventDefault();
    
    const floorId = document.getElementById('floorId').value;
    const floorData = {
        number: parseInt(document.getElementById('floorNumber').value),
        name: document.getElementById('floorName').value,
        description: document.getElementById('floorDescription').value
    };
    
    if (floorId) {
        // Update existing floor
        const index = state.floors.findIndex(f => f.id === parseInt(floorId));
        if (index !== -1) {
            state.floors[index] = { ...state.floors[index], ...floorData };
        }
    } else {
        // Add new floor
        const newId = Math.max(...state.floors.map(f => f.id), 0) + 1;
        state.floors.push({ id: newId, ...floorData });
    }
    
    closeModal('floorFormModal');
    renderAdminFloors();
    alert('Floor saved successfully!');
}

// Delete Functions
function deleteShop(shopId) {
    if (confirm('Are you sure you want to delete this shop?')) {
        state.shops = state.shops.filter(s => s.id !== shopId);
        renderAdminShops();
        alert('Shop deleted successfully!');
    }
}

function deleteOffer(offerId) {
    if (confirm('Are you sure you want to delete this offer?')) {
        state.offers = state.offers.filter(o => o.id !== offerId);
        renderAdminOffers();
        alert('Offer deleted successfully!');
    }
}

function deleteCategory(categoryId) {
    const hasShops = state.shops.some(s => s.category === categoryId);
    if (hasShops) {
        alert('Cannot delete category with existing shops!');
        return;
    }
    
    if (confirm('Are you sure you want to delete this category?')) {
        state.categories = state.categories.filter(c => c.id !== categoryId);
        renderAdminCategories();
        alert('Category deleted successfully!');
    }
}

function deleteFloor(floorId) {
    const hasShops = state.shops.some(s => s.floor === floorId);
    if (hasShops) {
        alert('Cannot delete floor with existing shops!');
        return;
    }
    
    if (confirm('Are you sure you want to delete this floor?')) {
        state.floors = state.floors.filter(f => f.id !== floorId);
        renderAdminFloors();
        alert('Floor deleted successfully!');
    }
}

// Edit Functions
function editShop(shopId) {
    openShopForm(shopId);
}

function editOffer(offerId) {
    openOfferForm(offerId);
}

function editCategory(categoryId) {
    openCategoryForm(categoryId);
}

function editFloor(floorId) {
    openFloorForm(floorId);
}

// Utility Functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ============== USER AUTHENTICATION FUNCTIONS ==============

function checkUserSession() {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
        try {
            const userData = JSON.parse(userSession);
            state.isUserLoggedIn = true;
            state.currentUser = userData;
            updateUserUI();
        } catch (error) {
            localStorage.removeItem('userSession');
        }
    }
}

async function handleUserLogin(e) {
    e.preventDefault();
    const email = document.getElementById('userLoginEmail').value;
    const password = document.getElementById('userLoginPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/user-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            state.isUserLoggedIn = true;
            state.currentUser = data.user;
            localStorage.setItem('userSession', JSON.stringify(data.user));
            closeModal('userLoginModal');
            updateUserUI();
            alert('Login successful! Welcome back, ' + data.user.name + '!');
        } else {
            const error = await response.json();
            alert(error.error || 'Invalid credentials. Please try again.');
        }
    } catch (error) {
        // Fallback to local authentication
        console.log('Using local authentication');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const userData = { id: user.id, name: user.name, email: user.email };
            state.isUserLoggedIn = true;
            state.currentUser = userData;
            localStorage.setItem('userSession', JSON.stringify(userData));
            closeModal('userLoginModal');
            updateUserUI();
            alert('Login successful! Welcome back, ' + user.name + '!');
        } else {
            alert('Invalid credentials. Please try again.');
        }
    }
}

async function handleUserRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/user-register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            alert('Registration successful! Please login.');
            closeModal('userRegisterModal');
            openModal('userLoginModal');
        } else {
            const error = await response.json();
            alert(error.error || 'Registration failed. Please try again.');
        }
    } catch (error) {
        // Fallback to local storage
        console.log('Using local storage for registration');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        if (users.find(u => u.email === email)) {
            alert('Email already registered! Please login.');
            return;
        }
        
        const newUser = {
            id: Date.now(),
            name,
            email,
            phone,
            password,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Registration successful! Please login.');
        closeModal('userRegisterModal');
        openModal('userLoginModal');
    }
}

function handleUserLogout() {
    if (confirm('Are you sure you want to logout?')) {
        state.isUserLoggedIn = false;
        state.currentUser = null;
        localStorage.removeItem('userSession');
        updateUserUI();
        alert('Logged out successfully!');
    }
}

function updateUserUI() {
    const guestActions = document.getElementById('guestActions');
    const userActions = document.getElementById('userActions');
    const userName = document.getElementById('userName');
    
    if (state.isUserLoggedIn && state.currentUser) {
        guestActions.style.display = 'none';
        userActions.style.display = 'flex';
        userName.textContent = state.currentUser.name;
    } else {
        guestActions.style.display = 'flex';
        userActions.style.display = 'none';
    }
}
