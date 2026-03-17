const router = require('express').Router()

router.get('/', (req, res) => {
  res.json({ message: 'get all listings' })
})

router.post('/', (req, res) => {
  res.json({ message: 'create listing' })
})

module.exports = router