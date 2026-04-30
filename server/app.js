const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const notificationRoutes = require('./routes/notification.routes');
const searchRoutes = require('./routes/search.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// Enable CORS for all origins (Flexible for Vercel deployment)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files from client build
app.use(express.static('client/dist'));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(require('path').join(__dirname, '../client/dist/index.html'));
    } else {
        next();
    }
});

const globalErrorHandler = require('./middleware/error.middleware');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/users', userRoutes);

// Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
