const router = require('express').Router()

router.post('/register', (req, res) => {
  res.json({ message: 'register route' })
})

router.post('/login', (req, res) => {
  res.json({ message: 'login route' })
})

module.exports = router