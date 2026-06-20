# GigVera - Freelance Marketplace

A full-stack freelance marketplace built with the MERN stack (MongoDB, Express, React, Node.js). Connect freelancers and clients for seamless project collaboration.

## Features

- **Dual Mode (Buyer/Seller Toggle)** — Switch between browsing services as a buyer or managing gigs as a seller
- **Gig Management** — Create, edit, publish, and manage service listings with multi-step forms
- **Order Pipeline** — Place orders with structured requirements, track delivery progress with real-time countdown timers
- **Role-Based Access** — Separate dashboards and views for Customers and Service Providers
- **Search & Filtering** — Browse and search services by category, keyword, and more
- **Reviews & Ratings** — Leave feedback on completed orders
- **Notifications** — Real-time notifications for order updates
- **Responsive Design** — Fully responsive UI with Tailwind CSS

## Tech Stack

### Frontend
- **React 18** with Vite
- **React Router v6** for routing
- **Tailwind CSS v4** for styling
- **Axios** for API calls
- **React Hot Toast** for notifications
- **React Icons** for iconography
- **Recharts** for analytics charts

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cloudinary** for image uploads
- **Multer** for file handling
- **Helmet** for security headers

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/MuhammadOkasha004/Gigvera.git
   cd Gigvera
   ```

2. Install dependencies
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. Create environment files

   **server/.env**
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   **client/.env**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Seed the database (optional)
   ```bash
   cd server && npm run seed
   ```

5. Start development servers
   ```bash
   # From root directory
   npm run dev
   ```

   Or individually:
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

The app will be available at `http://localhost:3000`.

## Project Structure

```
gigvera/
├── client/                # React frontend
│   ├── src/
│   │   ├── api/          # Axios config & interceptors
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Route pages
│   │   └── utils/        # Utility functions
│   └── ...
├── server/                # Express backend
│   ├── config/           # DB & Cloudinary config
│   ├── controllers/      # Route handlers
│   ├── middleware/        # Auth & error middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── seed/             # Database seed data
│   └── utils/            # Helper functions
├── vercel.json           # Vercel deployment config
└── package.json          # Root workspace config
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user
- `GET /api/auth/me` — Get current user
- `POST /api/auth/logout` — Logout user

### Gigs (Service Listings)
- `GET /api/gigs/my` — Get seller's gigs
- `POST /api/gigs` — Create gig
- `PUT /api/gigs/:id/publish` — Publish gig
- `PUT /api/gigs/:id/toggle` — Toggle gig status
- `DELETE /api/gigs/:id` — Delete gig

### Services (Public)
- `GET /api/services` — Browse services (with search/filter)
- `GET /api/services/:id` — Get service details

### Orders
- `POST /api/orders` — Place an order
- `GET /api/orders/my` — Get user's orders (filtered by role)
- `GET /api/orders/:id` — Get order details
- `PUT /api/orders/:id/status` — Update order status (seller only)

### Requests
- `POST /api/requests` — Submit service request
- `GET /api/requests/my` — Get user's requests
- `GET /api/requests/:id` — Get request details
- `PUT /api/requests/:id/status` — Update request status

## Deployment

### Frontend (Vercel)
The project includes a `vercel.json` for easy Vercel deployment:
```bash
vercel --prod
```
Set `VITE_API_URL` environment variable in Vercel dashboard to point to your deployed backend.

### Backend (Render / Railway)
Deploy the `server/` directory to any Node.js hosting platform with:
- Build command: `npm install`
- Start command: `node server.js`
- Set all environment variables from `server/.env`

## License

[MIT](LICENSE)

## Author

**Muhammad Okasha**
- LinkedIn: [Muhammad Okasha](https://www.linkedin.com/in/muhammad-okasha-0386103aa)
- GitHub: [MuhammadOkasha004](https://github.com/MuhammadOkasha004)
