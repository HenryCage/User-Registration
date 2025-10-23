const Admin = require('../models/user-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user-model')

const createAdmin = async (req, res) => {
  const { firstname, lastname, email, password, address, phone} = req.body
  
  if (!firstname || !email || !password) {
    return res.status(401).json({msg: 'Missing fields'})
  }

  try {
    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return res.status(401).json({msg: 'This Admin already exists'})
    }

    if (password.length < 8) {
      return res.status(401).json({msg: 'Password must be at least 8 characters'})
    }

    const encryptedPassword = await bcrypt.hash(password, 8)
    const admin = new Admin({
      firstname,
      lastname,
      phone,
      address,
      email,
      password: encryptedPassword,
      role: 'admin'
    })
    await admin.save()
  }
  catch (error) {
    return res.status(500).json({msg: `Error creating admin: ${error}`})
  }
}

const adminLogin = async (req, res) => {
  try {
    const { email, password} = req.body

    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(401).json({msg: 'Admin does not create. Create account first'})
    }

    const validPassword = await bcrypt.compare(password, admin.password)
    if (!validPassword) {
      return res.status(401).msg({msg: 'Invalid login credentials'})
    }

    if (admin.role !== 'admin') {
      return res.status(403).json({ msg: 'Access Denied. Admin only'})
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT)
    res.cookie('json-token', token, {
      httpOnly: true,
      path: '/'
    })
    return res.status(200).json({msg: 'Welcome Admin'})

  } catch (error) {
    return res.status(500).json({msg: `Error Signing in: ${error}`})
  }

}
module.exports = { createAdmin, adminLogin }