const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27018/projectbuddy';

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    let adminUser = await User.findOne({ email: 'admin@projectbuddy.com' });
    
    if (adminUser) {
      adminUser.role = 'admin';
      adminUser.password = 'adminpassword123';
      await adminUser.save();
      console.log('Updated existing user admin@projectbuddy.com: role to admin and password reset to "adminpassword123".');
    } else {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@projectbuddy.com',
        password: 'adminpassword123',
        college: 'ProjectBuddy',
        course: 'Admin',
        phone: '0000000000',
        role: 'admin'
      });
      console.log('Successfully created new Admin user:');
      console.log('Email: admin@projectbuddy.com');
      console.log('Password: adminpassword123');
    }
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });
