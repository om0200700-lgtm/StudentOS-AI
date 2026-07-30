# StudentOS AI

StudentOS AI is a premium, all-in-one productivity platform designed specifically for students. It combines academic tracking, placement preparation, task management, and AI-driven insights into a single, beautifully designed SaaS interface.

## 🌟 Key Features

- **Smart Dashboard:** Comprehensive overview with AI-generated recommendations, daily goals, and upcoming events.
- **Academic Tracking:** Monitor class attendance, calculate current CGPA, and predict future grades.
- **Study Planner & Pomodoro:** Integrated task board and focus timer to maximize productivity.
- **Coding & Placement Tracker:** Monitor LeetCode/HackerRank progress and track placement preparation milestones (DSA, Aptitude, Core Subjects).
- **AI Academic Assistant:** Get personalized study plans and insights based on your academic data.
- **Enterprise College ERP:** Full institutional management including Fee Management, Exam Scheduling, Subject Allocation, Result Marksheet Generation, and Data Export.
- **Role-Based Access Control:** Secure portals for Students, Faculty, and Administrators with custom dashboards.
- **Smart Analytics:** Visualize your study hours, attendance trends, and placement readiness with interactive charts.
- **Premium UI/UX:** Built with Tailwind CSS and Framer Motion for a sleek, responsive, and animated user experience including comprehensive Dark Mode support.

## 🛠️ Technology Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Framer Motion, Chart.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd studentos-ai
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/studentos
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```
   Start the backend:
   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

4. **Access the App**
   Open `http://localhost:5173` in your browser.

## 🧑‍💻 About the Developer
**Developed by Om Sundarrao Khandare**

"StudentOS AI is designed and developed by Om Sundarrao Khandare to help students manage academics, attendance, CGPA, coding practice, placement preparation, AI-powered study assistance, and smart analytics through one modern platform."

## 📝 License & Copyright
© 2026 StudentOS AI. All Rights Reserved.
This project is licensed under the MIT License.
