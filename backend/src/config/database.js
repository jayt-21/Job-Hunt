const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');

    // Clean up old indexes from previous schema versions
    try {
      const usersCollection = mongoose.connection.db.collection('users');
      await usersCollection.dropIndex('clerkId_1').catch(err => {
        if (!err.message.includes('index not found')) {
          throw err;
        }
      });
      console.log('✓ Cleaned up old database indexes');
    } catch (indexError) {
      if (!indexError.message.includes('index not found')) {
        console.warn('Warning: Could not clean up database indexes:', indexError.message);
      }
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
