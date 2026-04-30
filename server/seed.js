const mongoose = require('mongoose');
const Project = require('./models/Project');
const User = require('./models/User');
const Task = require('./models/Task');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
    try {
        console.log('🔄 Connecting to MongoDB for seeding...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas.');

        // Clear existing data
        await Project.deleteMany({});
        await Task.deleteMany({});
        await User.deleteMany({ email: 'admin@example.com' });
        console.log('🧹 Cleaned existing records.');

        // 1. Create Default Admin User
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminUser = await User.create({
            name: 'Executive Director',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'ADMIN'
        });
        console.log('👤 Admin User Created (admin@example.com / admin123)');

        // 2. Create High-End Enterprise Projects
        const projects = await Project.insertMany([
            {
                title: 'Quantum Ledger v2.0',
                description: 'Re-architecting the core transaction engine with distributed ledger technology and sub-10ms latency.',
                status: 'active',
                owner: adminUser._id
            },
            {
                title: 'Neural Ops Dashboard',
                description: 'A predictive monitoring system using advanced neural networks to forecast infrastructure bottlenecks.',
                status: 'active',
                owner: adminUser._id
            },
            {
                title: 'Sentinel Security Protocol',
                description: 'End-to-end encryption layer for cross-border data synchronization across 14 global nodes.',
                status: 'completed',
                owner: adminUser._id
            }
        ]);
        console.log('🚀 Projects Seeded.');

        console.log('✨ Data seeding complete. System ready for executive review.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
