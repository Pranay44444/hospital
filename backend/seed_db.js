require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const dummyUser = {
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123'
        };

        // Check if user already exists
        const existingUser = await User.findOne({ email: dummyUser.email });
        if (existingUser) {
            console.log('User already exists');
        } else {
            const user = new User(dummyUser);
            await user.save();
            console.log('User created successfully');
        }

        mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
