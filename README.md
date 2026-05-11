<div align="center">

<img src="https://img.shields.io/badge/Hados-Campus%20Social%20Platform-8B0000?style=for-the-badge&logo=react" alt="Hados Banner" />

<h1>Hados 🎓</h1>
<p><strong>A modern, full-featured social platform built exclusively for college students.</strong></p>

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Express.js-Backend-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" />
</p>

<p>
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-folder-structure">Folder Structure</a> •
  <a href="#-future-scope">Future Scope</a>
</p>

</div>

---

## 📌 Overview

**Hados** is a campus-exclusive social and utility platform designed to connect students within a college ecosystem. It combines social networking, academic tools, placement resources, and campus utilities into a single, beautifully crafted web application.

Built with a modern glassmorphism design system, dark/light theme support, and full mobile responsiveness, Hados delivers a premium experience that rivals commercial social platforms — purpose-built for the college community.

> Built as part of the Software Engineering coursework at **Amrita School of Engineering**.

---

## ✨ Features

### 🏠 Social Feed
- Create posts with text and image attachments
- Hashtag system with real-time trending widget
- Bookmark/save posts for later reading
- Filter feed by trending tags

### 👤 User Profiles
- Register with college details (name, course, year, batch, club)
- ID card verification workflow
- View and edit profile information

### 📋 Lost & Found
- Report lost or found campus items with photo evidence
- Filter by category (Electronics, Clothing, ID Cards, etc.)
- Contact item reporters via email

### 🏛️ Clubs & Activities
- Browse all official college clubs
- Join clubs and track member count
- Automatic duplicate deduplication

### 💼 Placement Corner
- View active placement drives and company listings
- Deadline tracking with CTC details
- Expandable job descriptions

### 📅 Academic Calendar
- View college events pulled from Firestore
- Color-coded event categories
- Date-sorted display

### 🗺️ Campus Map
- Interactive point-of-interest map
- View building hours and locations
- Auto-seeded default campus landmarks

### 🔔 Notifications
- Real-time notification panel in the header
- Unread badge indicators

### 🎨 UI/UX
- Glassmorphism design system with CSS variables
- Dark / Light theme toggle (persistent via localStorage)
- Animated skeleton loading states (no blank screens)
- Interactive background particle system
- Custom cursor
- React Error Boundaries (graceful crash handling)
- Toast notifications (react-hot-toast)
- Full mobile responsiveness (320px → 1440px)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + Vite |
| **Routing** | React Router v6 |
| **Styling** | Vanilla CSS (custom design system) |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Notifications** | react-hot-toast |
| **Authentication** | Firebase Authentication |
| **Database** | Firebase Firestore |
| **Backend Foundation** | Node.js + Express.js |
| **Environment Config** | dotenv |
| **Linting** | ESLint (flat config) |
| **Build Tool** | Vite v7 |

---

## 🏗️ Architecture

Hados uses a **modular, layered architecture** designed for long-term scalability.

```
User → React Frontend → Firebase Services (Auth + Firestore)
                     ↘
                      Express.js Backend API (foundation — expandable)
```

### Frontend Architecture
The React frontend is organized by **feature domain**, not by file type. Business logic is fully separated from UI through a **service layer**:

- **`/services/firebase/`** — Firebase initialization, auth helpers, Firestore CRUD wrappers
- **`/services/api/`** — Domain-specific API modules (`feed.api.js`, `clubs.api.js`, etc.) all exported through a single `index.js`
- **`/context/`** — Global state (Auth, Theme) via React Context
- **`/components/`** — Split into `common/`, `layout/`, and `ui/` for clear reuse boundaries
- **`/routes/`** — Centralized routing with protected route wrappers
- **`/constants/`** — Route name constants to avoid magic strings

### Backend Architecture
A lightweight **Express.js** backend (`/server`) is initialized and ready for future API expansion:

- **`/routes/`** — Route definitions (`GET /api/health`)
- **`/controllers/`** — Business logic decoupled from route handlers
- **`/middleware/`** — Auth, error handling, request validation (ready to populate)
- **`/config/`** — Firebase Admin SDK config (ready to populate)
- **`/utils/`** — Shared utility helpers (ready to populate)

---

## 📸 Screenshots

> _Screenshots will be added here._

| Feed Page | Clubs Page |
|-----------|------------|
| *(screenshot)* | *(screenshot)* |

| Lost & Found | Placement Corner |
|-------------|-----------------|
| *(screenshot)* | *(screenshot)* |

---

## 📁 Folder Structure

```
Hados/
├── public/
├── server/                        # Express.js backend foundation
│   ├── config/                    # DB and service configurations
│   ├── controllers/               # Route handler logic
│   │   └── healthController.js
│   ├── middleware/                # Auth, validation, error handling
│   ├── routes/                    # API route definitions
│   │   └── health.js
│   ├── utils/                     # Shared helpers
│   ├── .env.example               # Required env variables
│   └── server.js                  # Express app entry point
│
├── src/
│   ├── components/
│   │   ├── common/                # Shared components (PostCard, ErrorBoundary)
│   │   ├── layout/                # App shell (Header, Sidebar, Layout)
│   │   └── ui/                    # Presentational components (Skeleton, Background)
│   │
│   ├── constants/
│   │   └── routes.js              # Centralized route name constants
│   │
│   ├── context/
│   │   ├── AuthContext.jsx        # Firebase auth state & helpers
│   │   └── ThemeContext.jsx       # Dark/light theme
│   │
│   ├── pages/                     # One file per route/page
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── ClubsPage.jsx
│   │   ├── CalendarPage.jsx
│   │   ├── LostFoundPage.jsx
│   │   ├── MapPage.jsx
│   │   ├── PlacementorPage.jsx
│   │   └── SavedPostsPage.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx          # Centralized routing + protected routes
│   │
│   ├── services/
│   │   ├── api/                   # Domain-specific API modules
│   │   │   ├── index.js           # Consolidated re-export
│   │   │   ├── feed.api.js
│   │   │   ├── clubs.api.js
│   │   │   ├── calendar.api.js
│   │   │   ├── lostFound.api.js
│   │   │   ├── placement.api.js
│   │   │   ├── profile.api.js
│   │   │   ├── map.api.js
│   │   │   ├── hashtags.api.js
│   │   │   ├── notifications.api.js
│   │   │   └── dbAdmin.api.js
│   │   │
│   │   └── firebase/              # Firebase service wrappers
│   │       ├── config.js          # Firebase app initialization
│   │       ├── auth.js            # Auth helpers
│   │       └── firestore.js       # Firestore CRUD utilities
│   │
│   ├── App.jsx                    # Root component with ErrorBoundary
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global design system + responsive utilities
│
├── .env.example                   # Required frontend environment variables
├── .gitignore
├── eslint.config.js
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **Firebase** project with Firestore and Authentication enabled

### 1. Clone the Repository

```bash
git clone https://github.com/AkshayD011/Hados.git
cd Hados
```

### 2. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Open `.env` and fill in your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### 5. (Optional) Start the Backend

```bash
cd server
cp .env.example .env
npm install
node server.js
```

The backend API will run at **http://localhost:5000**  
Health check: `GET http://localhost:5000/api/health`

### 6. Build for Production

```bash
npm run build
```

---

## 🔮 Future Scope

| Feature | Description |
|---------|-------------|
| 🔔 **Real-time Notifications** | Firestore `onSnapshot` listeners for live updates |
| 💬 **Direct Messaging** | In-app chat between students |
| 🖼️ **Firebase Storage** | Actual image/file hosting instead of base64 encoding |
| 🔐 **Backend Auth Middleware** | JWT-based API protection via Express.js + Firebase Admin SDK |
| 🛡️ **Admin Dashboard** | Content moderation tools for campus administrators |
| 📱 **PWA Support** | Installable app with offline caching |
| 📊 **Analytics** | Firebase Analytics integration for usage insights |
| 🔍 **Global Search** | Full-text search across posts, clubs, and lost items |
| 🌐 **Code Splitting** | Dynamic imports for performance optimization (reduce 800KB bundle) |

---

## 🤝 Contributors

| Name | Role |
|------|------|
| [Akshay D](https://github.com/AkshayD011) | Full-Stack Developer, Project Lead |
| *(your team members here)* | *(role)* |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ at Amrita School of Engineering</p>
  <img src="https://img.shields.io/badge/Built%20with-React%20%2B%20Firebase-blue?style=for-the-badge" />
</div>