const { app, connectDB } = require('./app');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URI;

(async () => {
  try {
    await connectDB(MONGODB_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();
