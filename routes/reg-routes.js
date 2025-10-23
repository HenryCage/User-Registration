const express = require('express')
const router = express.Router()
const { requestSignup, signup, signin } = require('../controllers/reg')

router.post('/request-signup', requestSignup)
router.post('/signup', signup)
router.post('/login', signin)

module.exports = router