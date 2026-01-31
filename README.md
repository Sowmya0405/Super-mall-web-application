# Super Mall Web Application

A comprehensive, full-stack super mall management system with an intuitive user interface and powerful admin panel.

## Features

### User Features
- **Home Page**: Overview dashboard with statistics and featured offers
- **Shop Directory**: Browse all shops with advanced filtering
- **Offers Page**: View current promotions and deals
- **Categories**: Shop by category
- **Floor Directory**: Navigate shops by floor
- **Product Comparison**: Compare features and offers between shops
- **Shop Details**: Detailed information about each shop
- **Advanced Filtering**: Filter by category, floor, and search functionality

### Admin Features
- **Secure Admin Login**: Protected admin dashboard
- **Shop Management**: Create, read, update, and delete shop details
- **Offer Management**: Manage promotional offers and deals
- **Category Management**: Organize shops into categories
- **Floor Management**: Manage floor information
- **Data Persistence**: All changes are saved to database

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom styling with CSS variables, animations, and responsive design
- **JavaScript (ES6+)**: Modern JavaScript with async/await, fetch API
- **Fonts**: Playfair Display (display) & Work Sans (body)

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **File-based Database**: JSON storage for simplicity (easily upgradeable to MongoDB/PostgreSQL)
- **CORS**: Cross-origin resource sharing
- **Body Parser**: Request parsing middleware

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- A modern web browser

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- express
- cors
- body-parser
- nodemon (dev dependency)

### Step 2: Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Step 3: Open the Frontend

Open `index.html` in your web browser. You can:
- Double-click the file
- Use a local server (recommended): `python -m http.server 8000` or `npx http-server`
- Use VS Code Live Server extension

## Default Admin Credentials

```
Username: admin
Password: admin123
```

## Project Structure

```
super-mall-application/
├── index.html          # Main HTML file
├── styles.css          # Styling and animations
├── app.js             # Frontend JavaScript
├── server.js          # Backend API server
├── package.json       # Node.js dependencies
├── database.json      # Data storage (auto-generated)
└── README.md         # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Shops
- `GET /api/shops` - Get all shops (supports filtering)
- `GET /api/shops/:id` - Get shop by ID
- `POST /api/shops` - Create new shop (Admin)
- `PUT /api/shops/:id` - Update shop (Admin)
- `DELETE /api/shops/:id` - Delete shop (Admin)

### Offers
- `GET /api/offers` - Get all offers
- `GET /api/offers/:id` - Get offer by ID
- `POST /api/offers` - Create new offer (Admin)
- `PUT /api/offers/:id` - Update offer (Admin)
- `DELETE /api/offers/:id` - Delete offer (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Floors
- `GET /api/floors` - Get all floors
- `GET /api/floors/:id` - Get floor by ID
- `POST /api/floors` - Create new floor (Admin)
- `PUT /api/floors/:id` - Update floor (Admin)
- `DELETE /api/floors/:id` - Delete floor (Admin)

### Statistics
- `GET /api/stats` - Get dashboard statistics

## Usage Guide

### For Users

1. **Browse Shops**: Navigate to the Shops page to see all available shops
2. **Filter Results**: Use category, floor, or search filters to find specific shops
3. **View Offers**: Check the Offers page for current promotions
4. **Shop by Category**: Browse shops organized by category
5. **Floor Navigation**: Find shops by floor location
6. **Compare Products**: Select shops to compare their features and offers
7. **View Details**: Click any shop card to see detailed information

### For Administrators

1. **Login**: Click "Admin Login" button and use admin credentials
2. **Manage Shops**: 
   - Add new shops with complete details
   - Edit existing shop information
   - Delete shops (removes associated offers)
3. **Manage Offers**:
   - Create promotional offers
   - Set discount percentages and validity periods
   - Update or remove offers
4. **Manage Categories**:
   - Create product categories
   - Edit category details
   - Delete unused categories
5. **Manage Floors**:
   - Add floor information
   - Update floor details
   - Remove empty floors
6. **Logout**: Click logout to return to user view

## Key Features Explanation

### Advanced Filtering
- **Category Filter**: Show only shops in specific categories
- **Floor Filter**: Display shops on selected floors
- **Search**: Real-time search across shop names and descriptions
- **Combined Filters**: All filters work together

### Product Comparison
- Select up to 4 shops to compare
- Compare features including category, floor, location, hours, contact, and current offers
- Side-by-side comparison table

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for all screen sizes
- Touch-friendly navigation

### Animations & Transitions
- Smooth page transitions
- Card hover effects
- Animated statistics counters
- Modal animations

## Customization

### Changing the Theme

Edit the CSS variables in `styles.css`:

```css
:root {
    --color-primary: #1a1a2e;    /* Main dark color */
    --color-secondary: #c49b63;  /* Gold accent */
    --color-accent: #e8d5b5;     /* Light accent */
    /* ... other variables ... */
}
```

### Adding Sample Data

The application automatically initializes with sample data. To modify:
- Edit the `initializeDefaultData()` function in `server.js`
- Or use the admin panel to add/edit data

### Upgrading to Production Database

Replace the file-based storage with MongoDB or PostgreSQL:

1. Install database driver: `npm install mongoose` or `npm install pg`
2. Create database models
3. Replace file operations in `server.js` with database queries
4. Update connection string in environment variables

## Security Considerations

⚠️ **For Production Use:**

1. **Implement proper authentication**: Use JWT tokens or session management
2. **Hash passwords**: Use bcrypt for password hashing
3. **Environment variables**: Store sensitive data in .env files
4. **Input validation**: Add comprehensive input validation
5. **HTTPS**: Use SSL certificates for secure connections
6. **Rate limiting**: Prevent abuse with rate limiting middleware
7. **SQL injection protection**: Use parameterized queries if using SQL database

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Backend won't start
- Ensure Node.js is installed: `node --version`
- Check if port 3000 is available
- Install dependencies: `npm install`

### Frontend can't connect to backend
- Verify backend is running on port 3000
- Check CORS settings in `server.js`
- Update `API_URL` in `app.js` if needed

### Data not persisting
- Check write permissions for `database.json`
- Ensure server has access to the file system

## Future Enhancements

Potential improvements:
- User authentication and profiles
- Shopping cart functionality
- Online booking/reservation system
- Real-time notifications
- Analytics dashboard
- Image uploads for shops
- Map/3D floor visualization
- Mobile app (React Native)
- Payment integration
- Review and rating system

## License

MIT License - Feel free to use and modify for your projects.

## Support

For issues or questions, please refer to the code documentation or create an issue in the repository.


