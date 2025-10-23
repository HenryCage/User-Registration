const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.connect(process.env.URL)
  .then(() => {
    console.log('Connected to MongoDB Successful');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB: ', error)
  })
}

module.exports = { connectDB }