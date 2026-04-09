const router = require('express').Router()
const { login } = require('../Controllers/authController')

router.post('/login', login)

module.exports = router