# Project Structure

The StudentOS AI project is organized into a standard full-stack monorepo structure with distinct `client` (frontend) and `server` (backend) directories.

## Directory Tree

```
studentos-ai/
├── client/                     # Frontend React Application (Vite)
│   ├── public/                 # Static public assets
│   ├── src/                    # Main source code
│   │   ├── assets/             # Images, SVGs, and other local assets
│   │   ├── components/         # Reusable UI components
│   │   │   ├── charts/         # Chart.js wrapper components (Bar, Pie, Radar, etc.)
│   │   │   ├── common/         # Buttons, Cards, Inputs, Modals, Loaders
│   │   │   ├── layout/         # Navbar, Sidebar, MobileNav, DashboardLayout
│   │   │   └── planner/        # Planner-specific components (PomodoroTimer)
│   │   ├── context/            # React Context Providers
│   │   │   ├── AuthContext.jsx # Global user authentication state
│   │   │   ├── ThemeContext.jsx# Dark/Light mode state management
│   │   │   └── NotificationContext.jsx # Global notification toast state
│   │   ├── hooks/              # Custom React hooks (useDebounce, useMediaQuery)
│   │   ├── pages/              # Application Routes/Pages
│   │   │   ├── analytics/      # AnalyticsPage.jsx
│   │   │   ├── assistant/      # AssistantPage.jsx
│   │   │   ├── attendance/     # AttendancePage.jsx
│   │   │   ├── auth/           # Login, Register, ForgotPassword
│   │   │   ├── cgpa/           # CgpaPage.jsx
│   │   │   ├── coding/         # CodingPage.jsx
│   │   │   ├── dashboard/      # Dashboard.jsx
│   │   │   ├── placement/      # PlacementPage.jsx
│   │   │   ├── planner/        # PlannerPage.jsx
│   │   │   ├── profile/        # ProfilePage.jsx
│   │   │   ├── roadmap/        # RoadmapPage.jsx
│   │   │   └── settings/       # SettingsPage.jsx
│   │   ├── services/           # External integrations
│   │   │   └── api.js          # Centralized Axios instance and API method definitions
│   │   ├── utils/              # Helper functions (helpers.js)
│   │   ├── App.jsx             # Main Router and layout wrapper
│   │   ├── index.css           # Global Tailwind & Custom CSS definitions
│   │   └── main.jsx            # React mounting entry point
│   ├── index.html              # Vite HTML template
│   ├── tailwind.config.js      # Tailwind CSS configuration and theme extensions
│   └── vite.config.js          # Vite configuration
│
├── server/                     # Backend Node.js Application (Express)
│   ├── config/                 # Configuration files
│   │   └── db.js               # MongoDB connection logic
│   ├── controllers/            # Route business logic handlers
│   │   ├── analyticsController.js
│   │   ├── attendanceController.js
│   │   ├── authController.js
│   │   ├── cgpaController.js
│   │   ├── codingController.js
│   │   ├── placementController.js
│   │   └── plannerController.js
│   ├── middleware/             # Express middleware
│   │   ├── auth.js             # JWT verification middleware
│   │   └── error.js            # Global error handler
│   ├── models/                 # Mongoose database schemas
│   │   ├── Attendance.js
│   │   ├── CodingProfile.js
│   │   ├── PlacementPrep.js
│   │   ├── Semester.js
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/                 # Express API route definitions
│   │   ├── analytics.js
│   │   ├── attendance.js
│   │   ├── auth.js
│   │   ├── cgpa.js
│   │   ├── coding.js
│   │   ├── placement.js
│   │   └── planner.js
│   ├── utils/                  # Backend utilities (error response formatting)
│   ├── .env                    # Environment variables (Ignored in Git)
│   └── server.js               # Express application entry point
│
├── README.md                   # Project overview
├── PROJECT_STRUCTURE.md        # This file
├── API_DOCUMENTATION.md        # API reference
├── DATABASE_SCHEMA.md          # MongoDB schema reference
└── CHANGELOG.md                # Version history
```
