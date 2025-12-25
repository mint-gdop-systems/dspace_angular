# Ministry of Innovation & Technology - Resource Management System

A comprehensive resource discovery and management system that integrates with Koha, DSpace, and VuFind to provide unified access to library resources.

## Features

### Authentication & User Management
- User registration and login
- Role-based access (User/Admin)
- Profile management with download history
- Session-based authentication

### Resource Discovery
- Unified search across Koha, DSpace, and Ministry archives
- Advanced filtering (source, type, year, publisher)
- Real-time search with pagination
- Resource categorization (Books, Research, Reports, Images, Documents)

### Resource Management
- Detailed resource views with metadata
- Download tracking and statistics
- Favorites system
- View count tracking

### Analytics Dashboard (Admin Only)
- Downloads per month (Line Chart)
- Top searched keywords (Bar Chart)
- Resource source distribution (Pie Chart)
- Most accessed materials
- User activity timeline
- Real-time statistics

### UI Components
- Responsive design with Tailwind CSS
- Reusable components (Cards, Buttons, Badges)
- Interactive charts using Recharts
- Modern React with hooks

## Technology Stack

### Backend
- Django 5.2.8
- Django REST Framework
- SQLite database
- CORS headers for frontend integration

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Recharts for data visualization
- Lucide React for icons
- Axios for API calls

### External Integrations
- Koha Library System (http://127.0.0.1:8085)
- DSpace Repository (http://localhost:8080/server)
- VuFind Discovery Layer

## Installation & Setup

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install django djangorestframework django-cors-headers requests
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin

## API Endpoints

### Authentication
- POST `/api/auth/register/` - User registration
- POST `/api/auth/login/` - User login
- POST `/api/auth/logout/` - User logout
- GET `/api/auth/profile/` - Get user profile

### Resources
- GET `/api/resources/search/?q=query` - Search resources
- GET `/api/resources/recent/` - Get recent resources
- GET `/api/resources/{id}/` - Get resource details
- POST `/api/resources/{id}/download/` - Download resource
- GET `/api/resources/downloads/` - User download history

### Analytics (Admin Only)
- GET `/api/analytics/dashboard/?days=30` - Analytics data

## Project Structure

```
resource_project/
├── backend/
│   ├── authentication/          # User management
│   ├── resources/              # Resource management
│   ├── analytics/              # Analytics and reporting
│   └── backend/                # Django settings
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout/         # Navbar, Footer
│   │   │   ├── UI/             # Buttons, Cards, Badges
│   │   │   └── Charts/         # Chart components
│   │   ├── contexts/           # React contexts
│   │   ├── pages/              # Page components
│   │   └── utils/              # Utility functions
│   └── public/
└── README.md
```

## Key Features Implementation

### 1. Unified Search
The system searches across multiple sources (Koha, DSpace) and combines results in a single interface.

### 2. Real-time Analytics
Admin dashboard provides insights into:
- Resource usage patterns
- Popular search terms
- Download statistics
- User engagement metrics

### 3. Responsive Design
- Mobile-first approach
- Consistent color scheme (#4A70A9, #8FABD4, #EFECE3)
- Accessible UI components

### 4. Integration Ready
- API endpoints designed for external system integration
- Modular architecture for easy extension
- Service layer for external API calls

## Color Palette
- Primary: #4A70A9 (Ministry Blue)
- Secondary: #8FABD4 (Light Blue)
- Background: #EFECE3 (Light Cream)
- Text: Black/White based on background

## Development Notes

### External API Integration
The system is designed to integrate with:
- Koha OPAC API for library catalog
- DSpace REST API for institutional repository
- VuFind API for discovery services

### Security Features
- CSRF protection
- CORS configuration
- Session-based authentication
- Role-based access control

### Performance Considerations
- Pagination for large result sets
- Caching for frequently accessed data
- Optimized database queries
- Lazy loading for components

## Future Enhancements
- Single Sign-On (SSO) integration
- Advanced search filters
- Bulk download capabilities
- Resource recommendation system
- Mobile application
- Multi-language support