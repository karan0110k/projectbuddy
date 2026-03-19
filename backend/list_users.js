const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(async () => {
    console.log('Connected to MongoDB Atlas');
    const users = await User.find({}, 'name email role');
    console.log('--- All Users in Atlas ---');
    users.forEach(u => {
        console.log(`- ${u.name} (${u.email}) [${u.role}]`);
    });
    console.log('--------------------------');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
