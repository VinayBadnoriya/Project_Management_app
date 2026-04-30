PROJECT MANAGEMENT SAAS - DOCUMENTATION
========================================

A high-fidelity, editorial-style Project Management platform designed for modern enterprise teams. This application focuses on visual excellence, performance, and strict data isolation for a premium SaaS experience.

KEY FEATURES
------------

1. Multi-Tenant Data Isolation
   - Strict Filtering: Users only see projects, tasks, and dashboard stats for teams they are explicitly members of.
   - Privacy First: Admin data is never leaked across different organizations or project owners.

2. Editorial Dashboard
   - Real-time Analytics: Dynamic cards for Total Projects, Active Tasks, Team Velocity, and Active Users.
   - System Health: Monitoring metrics for Uptime, Cloud Sync, and Performance.
   - Recent Activity: A live feed of system updates and notifications.

3. Kanban & Workspace
   - High-Density UI: Optimized spacing and typography for maximum information density.
   - Task Management: Create, assign, and track tasks across various status columns (Todo, In-Progress, Done).

4. Admin Broadcast System
   - Targeted Updates: Admins can broadcast system-wide updates to their specific project team members instantly.
   - Notification Feed: A centralized hub for all user activities and alerts.


TECH STACK
----------

Frontend:
- Core: React + Vite
- Animations: Framer Motion
- Icons: Lucide React
- Styling: Vanilla CSS
- State Management: React Context API

Backend:
- Server: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT (JSON Web Tokens)
- Architecture: Service-Controller-Route (Clean Architecture)


SETUP & INSTALLATION
--------------------

Prerequisites:
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- .env file with MONGO_URI and JWT_SECRET

Installation:
1. Clone the repository
2. Install dependencies:
   npm install

Running the Application:
Use the following command in the root directory:
   npm run dev

- Backend: http://localhost:5000
- Frontend: http://localhost:3000


PROJECT STRUCTURE
-----------------

- client/          : React frontend
- client/src/      : Components, pages, services, context
- server/          : Node.js backend
- server/src/      : Controllers, services, models, routes, middleware


SECURITY & PERFORMANCE
----------------------

- RBAC: Role-Based Access Control (Admin vs Member).
- Graceful Fallbacks: Error resilience in API calls.
- Memoization: Optimized React rendering to prevent unnecessary updates.

----------------------------------------
Built with ❤️ for teams everywhere.
