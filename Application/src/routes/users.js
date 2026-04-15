const router = require('express').Router()
const userRepository = require('../Repositories/userRepo')
const { requireAuth, requireRole } = require('../Middleware/authMiddleware')
const bcrypt = require('bcrypt')

// register a new user - public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body

        // hash the password before saving
        const salt = await bcrypt.genSalt(10)
        const password_hash = await bcrypt.hash(password, salt)

        const user = await userRepository.createUser({
            ...req.body,
            password_hash
        })

        res.json(user)
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
})

// get all users - admin only
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const users = await userRepository.getAllUsers()
        res.json(users)
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
})

// suspend a user - admin only
router.put('/:id/suspend', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const user = await userRepository.suspendUser(req.params.id)
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.json({ message: 'User suspended successfully', user })
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
})

// unsuspend a user - admin only
router.put('/:id/unsuspend', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const user = await userRepository.unsuspendUser(req.params.id)
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.json({ message: 'User unsuspended successfully', user })
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
})

// delete a user - admin only
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const user = await userRepository.deleteUser(req.params.id)
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.json({ message: 'User deleted successfully' })
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router