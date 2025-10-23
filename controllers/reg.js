const User = require('../models/user-model');
const PendingUser = require('../models/pendingUsers')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { sendVerificationEmail } = require('../verification/email-receive')
const generateCode = require('../verification/verification')


const requestSignup = async (req, res) => {
  const {firstname, lastname, email, password, phone, address} = req.body;
  
  if (!firstname || !email || !password){
    return res.status(401).json({msg: 'Please fill all fields!'})
  }

  
  try {
    const userExists = await User.findOne({ email });
    if (userExists){
      return res.status(401).json({msg: 'This user already exixts'})
    }

    const pendingExist = await PendingUser.findOne({email})
    if (pendingExist) {
      return res.status(401).json({msg: 'Verification Code already sent!'})
    }

    if (password.length < 8) {
      return res.status(401).json({msg: 'Password must be at least 8 characters'})
    }

    const code = generateCode(6)
    const hashPassword = await bcrypt.hash(password, 8)

    const pendingUser = new PendingUser({
      firstname,
      lastname,
      email,
      phone,
      address,
      password: hashPassword,
      verificationCode: code,
      verificationExp: new Date(Date.now() + 10 * 60 * 1000)
    })

    await pendingUser.save();
    await sendVerificationEmail(email, code)

    return res.status(201).json({msg: 'Verification Code sent to your email'})

  } catch (err) {
    console.error(err);
    return res.status(500).json({msg: `Error requesting signup: ${err}`})
  }
}

const signup = async (req, res) => {
  const {email, code} = req.body;

  try {
    const pending = await PendingUser.findOne({email})
    if (!pending) {
      return res.status(401).json({msg: 'Please request verification code'})
    }
    if (pending.verificationCode !== code) {
      return res.status(401).json({msg: 'Invalid Code'})
    }
    if (pending.verificationExp < new Date()) {
      await PendingUser.deleteOne({email})
      return res.status(400).json({msg: 'Verification Code expired'})
    }

    const newUser = new User({
      firstname : pending.firstname,
      lastname : pending.lastname,
      address : pending.address,
      phone : pending.phone,
      email : pending.email,
      password : pending.password,
      isVerified: true
    })

    await newUser.save()
    await PendingUser.deleteOne({email})

    return res.status(201).json({msg: 'Account created successfully'})
  } catch (err) {
    console.error(err)
    return res.status(500).json({msg: `Error creating User: ${err}`})
  }
}

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({msg: 'User not found'})
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({msg: 'Invalid Credentials'})
    }

    const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT);
    res.cookie('json-token', jwtToken, {
      httpOnly: true,
      path: '/'
    })
    return res.status(200).json({msg: 'Signed in Successfully'})
  } catch (err) {
    console.error(err)
    return res.status(500).json({msg: `Error signing in: ${err}`})
  }
}

module.exports = { requestSignup, signup, signin }