const express = require('express');
const app = express();
app.use(express.json());
const dotenv = require('dotenv').config()
const port = 5000;
const { connectDB } = require('./dbConnect');

connectDB();

const auth = require('./routes/reg-routes')
const adminAuth = require('./routes/adminreg-route')

app.use('/reg', auth);
app.use('/admin', adminAuth)

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})