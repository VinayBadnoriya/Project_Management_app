# Antigravity. | Project Management SaaS

A high-fidelity, editorial-style Project Management platform designed for modern enterprise teams. This application focuses on visual excellence, performance, and strict data isolation for a premium SaaS experience.

## 🚀 Key Features

### 1. **Multi-Tenant Data Isolation**
- **Strict Filtering**: Users only see projects, tasks, and dashboard stats for teams they are explicitly members of.
- **Privacy First**: Admin data is never leaked across different organizations or project owners.

### 2. **Editorial Dashboard**
- **Real-time Analytics**: Dynamic cards for Total Projects, Active Tasks, Team Velocity, and Active Users.
- **System Health**: Monitoring metrics for Uptime, Cloud Sync, and Performance.
- **Recent Activity**: A live feed of system updates and notifications.

### 3. **Kanban & Workspace**
- **High-Density UI**: Optimized spacing and typography for maximum information density.
- **Task Management**: Create, assign, and track tasks across various status columns (Todo, In-Progress, Done).

### 4. **Admin Broadcast System**
- **Targeted Updates**: Admins can broadcast system-wide updates to their specific project team members instantly.
- **Notification Feed**: A centralized hub for all user activities and alerts.

---

## 🛠️ Tech Stack

### **Frontend**
- **Core**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (High-fidelity editorial approach)
- **State Management**: React Context API

### **Backend**
- **Server**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Architecture**: Service-Controller-Route (Clean Architecture)

---

## ⚙️ Setup & Installation

### **Prerequisites**
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- `.env` file with `MONGO_URI` and `JWT_SECRET`

### **Installation**
1. Clone the repository
2. Install dependencies for both client and server:
```bash
# In the root directory
npm install
```

### **Running the Application**
The project uses `concurrently` to run both the frontend and backend with a single command:

```bash
npm run dev
```
- **Backend**: Runs on `http://localhost:5000`
- **Frontend**: Runs on `http://localhost:3000` (via Vite)

---

## 📂 Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI elements
│   │   ├── pages/          # Full page views
│   │   ├── services/       # API integration
│   │   └── context/        # Auth and global state
├── server/                 # Node.js backend
│   ├── controllers/        # Request handling logic
│   ├── services/           # Business logic layer
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   └── middleware/         # Auth and validation
```

## 🛡️ Security & Performance
- **RBAC**: Role-Based Access Control (Admin vs Member).
- **Graceful Fallbacks**: Error resilience in API calls.
- **Memoization**: Optimized React rendering to prevent unnecessary updates.

---
Built with ❤️ by the **Antigravity Team**.
