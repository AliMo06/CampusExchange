const router = require('express').Router()
const { requireAuth, requireRole } = require('../Middleware/authMiddleware')

router.get('/', (req, res) => {
  res.json({ message: 'get all listings - public' })
})

// only logged in users can create a listing
router.post('/', requireAuth, (req, res) => {
  res.json({ message: 'create listing - protected' })
})

// only admins can delete
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  res.json({ message: 'delete listing - admin only' })
})

module.exports = router