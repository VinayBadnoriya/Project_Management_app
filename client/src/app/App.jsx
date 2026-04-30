import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import Projects from '../pages/Projects';
import ProjectDetail from '../pages/ProjectDetail';
import CreateProject from '../pages/CreateProject';
import Tasks from '../pages/Tasks';
import Team from '../pages/Team';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import Search from '../pages/Search';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="h-screen flex items-center justify-center font-bold text-indigo-600">Loading App...</div>;
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" />;
    
    return <Layout>{children}</Layout>;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected Private Routes with Layout */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/projects" element={
                        <ProtectedRoute>
                            <Projects />
                        </ProtectedRoute>
                    } />
                    <Route path="/projects/new" element={
                        <ProtectedRoute adminOnly={true}>
                            <CreateProject />
                        </ProtectedRoute>
                    } />
                    <Route path="/projects/:id" element={
                        <ProtectedRoute>
                            <ProjectDetail />
                        </ProtectedRoute>
                    } />
                    <Route path="/tasks" element={
                        <ProtectedRoute>
                            <Tasks />
                        </ProtectedRoute>
                    } />
                    <Route path="/team" element={
                        <ProtectedRoute>
                            <Team />
                        </ProtectedRoute>
                    } />
                    <Route path="/notifications" element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="/search" element={
                        <ProtectedRoute>
                            <Search />
                        </ProtectedRoute>
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
