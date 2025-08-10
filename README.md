# Division Management Frontend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
The frontend is configured to connect to the backend at `http://localhost:3000`. Make sure your backend server is running on this port.

If you need to change the backend URL, update the `API_BASE_URL` in `src/services/api.js`.

### 3. Start Development Server
```bash
npm run dev
```

The application will start on `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

## Features

- **Division Management**: Create, read, update, and delete divisions
- **Search & Filter**: Search divisions by name, description, or head. Filter by status (active/inactive)
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and custom components

## Component Structure

- `DivisionManagement.jsx` - Main component handling all division operations
- `ui/` - Reusable UI components (Badge, Button, Card, Input, Table)

## API Integration

The frontend communicates with the backend through the `divisionAPI` service in `src/services/api.js`. All CRUD operations are handled through this service.

## Styling

The application uses Tailwind CSS with custom CSS variables for consistent theming. The design system includes:
- Color schemes (light/dark mode support)
- Component variants
- Responsive breakpoints
- Custom border radius and spacing

## Error Handling

The application includes comprehensive error handling:
- API error responses
- Form validation
- User feedback for all operations
- Loading states

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
