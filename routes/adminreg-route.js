const express = require('express')
const router = express.Router()
const { createAdmin, adminLogin } = require('../controllers/admin-reg')

router.post('/create', createAdmin)
router.post('/login', adminLogin)

module.exports = router