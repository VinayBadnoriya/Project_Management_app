const mongoose = require('mongoose');
require('dotenv').config();
const Project = require('./server/models/Project');
const User = require('./server/models/User');

async function checkDB() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    const projects = await Project.find();
    console.log(`Found ${projects.length} projects`);
    for (const p of projects) {
        const owner = await User.findById(p.owner);
        if (!owner) {
            console.error(`Project ${p._id} has missing owner ${p.owner}`);
        } else {
            console.log(`Project ${p._id} owner: ${owner.email}`);
        }
    }
    process.exit(0);
}

checkDB().catch(err => {
    console.error(err);
    process.exit(1);
});
