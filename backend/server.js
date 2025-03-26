
const express = require('express'); //Node.js web framework
const dotenv = require('dotenv'); //import environment variables
const cors = require('cors'); // allow different hosts' request
const connectDB = require('./config/db');

dotenv.config(); //read .env



const app = express(); // instance of Express, deal with HTTP request

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));

// Export the app object for testing
if (require.main === module) {
  connectDB();
  // If the file is run directly, start the server
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// allow other file to load app (like test.js), won't launch the server
module.exports = app
