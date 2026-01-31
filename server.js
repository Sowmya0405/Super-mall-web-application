const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data storage file
const DATA_FILE = path.join(__dirname, 'database.json');

// Initialize database
let database = {
    shops: [],
    offers: [],
    categories: [],
    floors: [],
    users: [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin' }
    ],
    customers: []
};

// Load database from file
async function loadDatabase() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        database = JSON.parse(data);
        console.log('Database loaded successfully');
    } catch (error) {
        console.log('No existing database found, using default data');
        await initializeDefaultData();
        await saveDatabase();
    }
}

// Save database to file
async function saveDatabase() {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(database, null, 2));
        console.log('Database saved successfully');
    } catch (error) {
        console.error('Error saving database:', error);
    }
}

// Initialize default data
async function initializeDefaultData() {
    database.categories = [
        { id: 1, name: 'Fashion & Apparel', description: 'Clothing, accessories, and footwear', icon: '👗' },
        { id: 2, name: 'Electronics', description: 'Latest gadgets and technology', icon: '📱' },
        { id: 3, name: 'Food & Beverages', description: 'Restaurants and food courts', icon: '🍽️' },
        { id: 4, name: 'Home & Lifestyle', description: 'Furniture and home decor', icon: '🏠' },
        { id: 5, name: 'Beauty & Cosmetics', description: 'Skincare and makeup products', icon: '💄' },
        { id: 6, name: 'Sports & Fitness', description: 'Sportswear and equipment', icon: '⚽' }
    ];
    
    database.floors = [
        { id: 1, number: 1, name: 'Ground Floor', description: 'Fashion & Accessories' },
        { id: 2, number: 2, name: 'First Floor', description: 'Electronics & Technology' },
        { id: 3, number: 3, name: 'Second Floor', description: 'Food Court & Restaurants' },
        { id: 4, number: 4, name: 'Third Floor', description: 'Home & Lifestyle' },
        { id: 5, number: 5, name: 'Fourth Floor', description: 'Entertainment & Cinema' }
    ];
    
    database.shops = [
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
    
    database.offers = [
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

// Helper function to get next ID
function getNextId(collection) {
    if (database[collection].length === 0) return 1;
    return Math.max(...database[collection].map(item => item.id)) + 1;
}

// Authentication middleware
function authenticateAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
    }
    
    const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = database.users.find(u => u.username === username && u.password === password);
    
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    req.user = user;
    next();
}

// ============== AUTHENTICATION ROUTES ==============

// Admin login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = database.users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({
        success: true,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});

// User registration
app.post('/api/auth/user-register', async (req, res) => {
    const { name, email, phone, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    // Check if email already exists
    const existingCustomer = database.customers.find(c => c.email === email);
    if (existingCustomer) {
        return res.status(400).json({ error: 'Email already registered' });
    }
    
    const newCustomer = {
        id: getNextId('customers'),
        name,
        email,
        phone: phone || '',
        password, // In production, use bcrypt to hash this
        createdAt: new Date().toISOString()
    };
    
    database.customers.push(newCustomer);
    await saveDatabase();
    
    res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
            id: newCustomer.id,
            name: newCustomer.name,
            email: newCustomer.email
        }
    });
});

// User login
app.post('/api/auth/user-login', (req, res) => {
    const { email, password } = req.body;
    
    const customer = database.customers.find(c => c.email === email && c.password === password);
    
    if (!customer) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    res.json({
        success: true,
        user: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone
        }
    });
});

// Get user profile
app.get('/api/user/profile/:id', (req, res) => {
    const customer = database.customers.find(c => c.id === parseInt(req.params.id));
    
    if (!customer) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        createdAt: customer.createdAt
    });
});

// ============== SHOP ROUTES ==============

// Get all shops
app.get('/api/shops', (req, res) => {
    const { category, floor, search } = req.query;
    let shops = [...database.shops];
    
    if (category) {
        shops = shops.filter(s => s.category === parseInt(category));
    }
    
    if (floor) {
        shops = shops.filter(s => s.floor === parseInt(floor));
    }
    
    if (search) {
        const searchLower = search.toLowerCase();
        shops = shops.filter(s => 
            s.name.toLowerCase().includes(searchLower) ||
            (s.description && s.description.toLowerCase().includes(searchLower))
        );
    }
    
    res.json(shops);
});

// Get shop by ID
app.get('/api/shops/:id', (req, res) => {
    const shop = database.shops.find(s => s.id === parseInt(req.params.id));
    
    if (!shop) {
        return res.status(404).json({ error: 'Shop not found' });
    }
    
    res.json(shop);
});

// Create new shop (Admin only)
app.post('/api/shops', authenticateAdmin, async (req, res) => {
    const { name, category, floor, shopNumber, description, contact, email, hours } = req.body;
    
    if (!name || !category || !floor) {
        return res.status(400).json({ error: 'Name, category, and floor are required' });
    }
    
    const newShop = {
        id: getNextId('shops'),
        name,
        category: parseInt(category),
        floor: parseInt(floor),
        shopNumber,
        description,
        contact,
        email,
        hours
    };
    
    database.shops.push(newShop);
    await saveDatabase();
    
    res.status(201).json(newShop);
});

// Update shop (Admin only)
app.put('/api/shops/:id', authenticateAdmin, async (req, res) => {
    const shopId = parseInt(req.params.id);
    const index = database.shops.findIndex(s => s.id === shopId);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Shop not found' });
    }
    
    const { name, category, floor, shopNumber, description, contact, email, hours } = req.body;
    
    database.shops[index] = {
        ...database.shops[index],
        name: name || database.shops[index].name,
        category: category ? parseInt(category) : database.shops[index].category,
        floor: floor ? parseInt(floor) : database.shops[index].floor,
        shopNumber: shopNumber !== undefined ? shopNumber : database.shops[index].shopNumber,
        description: description !== undefined ? description : database.shops[index].description,
        contact: contact !== undefined ? contact : database.shops[index].contact,
        email: email !== undefined ? email : database.shops[index].email,
        hours: hours !== undefined ? hours : database.shops[index].hours
    };
    
    await saveDatabase();
    res.json(database.shops[index]);
});

// Delete shop (Admin only)
app.delete('/api/shops/:id', authenticateAdmin, async (req, res) => {
    const shopId = parseInt(req.params.id);
    const index = database.shops.findIndex(s => s.id === shopId);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Shop not found' });
    }
    
    // Delete associated offers
    database.offers = database.offers.filter(o => o.shopId !== shopId);
    
    database.shops.splice(index, 1);
    await saveDatabase();
    
    res.json({ success: true, message: 'Shop deleted successfully' });
});

// ============== OFFER ROUTES ==============

// Get all offers
app.get('/api/offers', (req, res) => {
    const { shopId, active } = req.query;
    let offers = [...database.offers];
    
    if (shopId) {
        offers = offers.filter(o => o.shopId === parseInt(shopId));
    }
    
    if (active === 'true') {
        const today = new Date().toISOString().split('T')[0];
        offers = offers.filter(o => o.validFrom <= today && o.validUntil >= today);
    }
    
    res.json(offers);
});

// Get offer by ID
app.get('/api/offers/:id', (req, res) => {
    const offer = database.offers.find(o => o.id === parseInt(req.params.id));
    
    if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
    }
    
    res.json(offer);
});

// Create new offer (Admin only)
app.post('/api/offers', authenticateAdmin, async (req, res) => {
    const { title, shopId, discount, description, validFrom, validUntil } = req.body;
    
    if (!title || !shopId || !validFrom || !validUntil) {
        return res.status(400).json({ error: 'Title, shopId, validFrom, and validUntil are required' });
    }
    
    const newOffer = {
        id: getNextId('offers'),
        title,
        shopId: parseInt(shopId),
        discount: discount ? parseInt(discount) : 0,
        description,
        validFrom,
        validUntil
    };
    
    database.offers.push(newOffer);
    await saveDatabase();
    
    res.status(201).json(newOffer);
});

// Update offer (Admin only)
app.put('/api/offers/:id', authenticateAdmin, async (req, res) => {
    const offerId = parseInt(req.params.id);
    const index = database.offers.findIndex(o => o.id === offerId);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Offer not found' });
    }
    
    const { title, shopId, discount, description, validFrom, validUntil } = req.body;
    
    database.offers[index] = {
        ...database.offers[index],
        title: title || database.offers[index].title,
        shopId: shopId ? parseInt(shopId) : database.offers[index].shopId,
        discount: discount !== undefined ? parseInt(discount) : database.offers[index].discount,
        description: description !== undefined ? description : database.offers[index].description,
        validFrom: validFrom || database.offers[index].validFrom,
        validUntil: validUntil || database.offers[index].validUntil
    };
    
    await saveDatabase();
    res.json(database.offers[index]);
});

// Delete offer (Admin only)
app.delete('/api/offers/:id', authenticateAdmin, async (req, res) => {
    const offerId = parseInt(req.params.id);
    const index = database.offers.findIndex(o => o.id === offerId);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Offer not found' });
    }
    
    database.offers.splice(index, 1);
    await saveDatabase();
    
    res.json({ success: true, message: 'Offer deleted successfully' });
});

// ============== CATEGORY ROUTES ==============

// Get all categories
app.get('/api/categories', (req, res) => {
    res.json(database.categories);
});

// Get category by ID
app.get('/api/categories/:id', (req, res) => {
    const category = database.categories.find(c => c.id === parseInt(req.params.id));
    
    if (!category) {
        return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
});

// Create new category (Admin only)
app.post('/api/categories', authenticateAdmin, async (req, res) => {
    const { name, description, icon } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    
    const newCategory = {
        id: getNextId('categories'),
        name,
        description,
        icon
    };
    
    database.categories.push(newCategory);
    await saveDatabase();
    
    res.status(201).json(newCategory);
});

// Update category (Admin only)
app.put('/api/categories/:id', authenticateAdmin, async (req, res) => {
    const categoryId = parseInt(req.params.id);
    const index = database.categories.findIndex(c => c.id === categoryId);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Category not found' });
    }
    
    const { name, description, icon } = req.body;
    
    database.categories[index] = {
        ...database.categories[index],
        name: name || database.categories[index].name,
        description: description !== undefined ? description : database.categories[index].description,
        icon: icon !== undefined ? icon : database.categories[index].icon
    };
    
    await saveDatabase();
    res.json(database.categories[index]);
});

// Delete category (Admin only)
app.delete('/api/categories/:id', authenticateAdmin, async (req, res) => {
    const categoryId = parseInt(req.params.id);
    const index = database.categories.findIndex(c => c.id === categoryId);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Category not found' });
    }
    
    // Check if category has shops
    const hasShops = database.shops.some(s => s.category === categoryId);
    if (hasShops) {
        return res.status(400).json({ error: 'Cannot delete category with existing shops' });
    }
    
    database.categories.splice(index, 1);
    await saveDatabase();
    
    res.json({ success: true, message: 'Category deleted successfully' });
});

// ============== FLOOR ROUTES ==============

// Get all floors
app.get('/api/floors', (req, res) => {
    res.json(database.floors);
});

// Get floor by ID
app.get('/api/floors/:id', (req, res) => {
    const floor = database.floors.find(f => f.id === parseInt(req.params.id));
    
    if (!floor) {
        return res.status(404).json({ error: 'Floor not found' });
    }
    
    res.json(floor);
});

// Create new floor (Admin only)
app.post('/api/floors', authenticateAdmin, async (req, res) => {
    const { number, name, description } = req.body;
    
    if (!number || !name) {
        return res.status(400).json({ error: 'Number and name are required' });
    }
    
    const newFloor = {
        id: getNextId('floors'),
        number: parseInt(number),
        name,
        description
    };
    
    database.floors.push(newFloor);
    await saveDatabase();
    
    res.status(201).json(newFloor);
});

// Update floor (Admin only)
app.put('/api/floors/:id', authenticateAdmin, async (req, res) => {
    const floorId = parseInt(req.params.id);
    const index = database.floors.findIndex(f => f.id === floorId);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Floor not found' });
    }
    
    const { number, name, description } = req.body;
    
    database.floors[index] = {
        ...database.floors[index],
        number: number ? parseInt(number) : database.floors[index].number,
        name: name || database.floors[index].name,
        description: description !== undefined ? description : database.floors[index].description
    };
    
    await saveDatabase();
    res.json(database.floors[index]);
});

// Delete floor (Admin only)
app.delete('/api/floors/:id', authenticateAdmin, async (req, res) => {
    const floorId = parseInt(req.params.id);
    const index = database.floors.findIndex(f => f.id === floorId);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Floor not found' });
    }
    
    // Check if floor has shops
    const hasShops = database.shops.some(s => s.floor === floorId);
    if (hasShops) {
        return res.status(400).json({ error: 'Cannot delete floor with existing shops' });
    }
    
    database.floors.splice(index, 1);
    await saveDatabase();
    
    res.json({ success: true, message: 'Floor deleted successfully' });
});

// ============== STATISTICS ROUTES ==============

// Get dashboard statistics
app.get('/api/stats', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const activeOffers = database.offers.filter(o => o.validFrom <= today && o.validUntil >= today);
    
    res.json({
        totalShops: database.shops.length,
        totalOffers: database.offers.length,
        activeOffers: activeOffers.length,
        totalCategories: database.categories.length,
        totalFloors: database.floors.length
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
async function startServer() {
    await loadDatabase();
    app.listen(PORT, () => {
        console.log(`Super Mall API Server running on http://localhost:${PORT}`);
        console.log(`\nDefault Admin Credentials:`);
        console.log(`Username: admin`);
        console.log(`Password: admin123`);
        console.log(`\nAPI Endpoints:`);
        console.log(`- GET    /api/shops`);
        console.log(`- POST   /api/shops`);
        console.log(`- GET    /api/offers`);
        console.log(`- POST   /api/offers`);
        console.log(`- GET    /api/categories`);
        console.log(`- POST   /api/categories`);
        console.log(`- GET    /api/floors`);
        console.log(`- POST   /api/floors`);
        console.log(`- GET    /api/stats`);
    });
}
 // Keep-alive logic
const https = require('https');
setInterval(() => {
    https.get('https://super-mall-web-application.onrender.com/api/shops', (res) => {
        console.log('Self-ping successful: Keeping server awake');
    }).on('error', (err) => {
        console.error('Self-ping failed:', err.message);
    });
}, 600000); // Pings every 10 minutes (600,000 ms)
startServer();
