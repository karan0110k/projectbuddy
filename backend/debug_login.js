const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(async () => {
    console.log('Connected to MongoDB Atlas');
    const email = 'admin@projectbuddy.com';
    const password = 'adminpassword123';
    
    const user = await User.findOne({ email });
    if (!user) {
        console.log('User not found in Atlas');
        process.exit(1);
    }
    
    console.log('User found:', user.email);
    console.log('User role:', user.role);
    console.log('Hashed Password in DB:', user.password);
    
    const isMatch = await user.matchPassword(password);
    console.log('Password match result (user.matchPassword):', isMatch);
    
    const manualMatch = await bcrypt.compare(password, user.password);
    console.log('Manual compare result (bcrypt.compare):', manualMatch);
    
    process.exit(0);
}).catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
});
