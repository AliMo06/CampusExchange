const router = require('express').Router()
const { login } = require('../Controllers/authController')

router.post('/login', login)

// register route is a stub for other teammate to fill in
router.post('/register', (req, res) => {
  res.json({ message: 'register - your partners part' })
})

module.exports = router