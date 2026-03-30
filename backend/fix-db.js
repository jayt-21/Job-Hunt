const mongoose = require('mongoose');

async function fixDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interview_db');
    console.log('✓ Connected to MongoDB');

    const usersCollection = mongoose.connection.db.collection('users');
    
    // Get all indexes
    const indexes = await usersCollection.getIndexes();
    console.log('Current indexes:', Object.keys(indexes));

    // Drop the problematic clerkId index
    try {
      await usersCollection.dropIndex('clerkId_1');
      console.log('✓ Dropped clerkId_1 index');
    } catch (err) {
      if (err.message.includes('index not found')) {
        console.log('ℹ clerkId_1 index not found (already removed)');
      } else {
        throw err;
      }
    }

    // Verify cleanup
    const newIndexes = await usersCollection.getIndexes();
    console.log('Indexes after cleanup:', Object.keys(newIndexes));

    await mongoose.connection.close();
    console.log('✓ Database fix complete');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

fixDatabase();
