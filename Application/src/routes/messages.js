const router = require('express').Router()

const messageRepo = require('../Repositories/messageRepo')

const { requireAuth } = require('../Middleware/authMiddleware')

// Send message (must be logged in)
router.post('/', requireAuth, async (req, res) => {

    try {

        const message = await messageRepo.sendMessage(req.body)

        res.json(message)

    } catch (err) {

        res.status(500).json({ error: err.message })

    }

})

// Get conversation
router.get('/', requireAuth, async (req, res) => {

    const { listingId, user1, user2 } = req.query

    try {

        const messages = await messageRepo.getConversation(
            listingId,
            user1,
            user2
        )

        res.json(messages)

    } catch (err) {

        res.status(500).json({ error: err.message })

    }

})

// get all conversations for the logged in user
router.get('/my-conversations', requireAuth, async (req, res) => {
    try {
        const conversations = await messageRepo.getUserConversations(req.user.user_id)
        res.json(conversations)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// mark messages as read in a conversation
router.put('/read', requireAuth, async (req, res) => {
    const { listingId } = req.body
    try {
        const updated = await messageRepo.markAsRead(listingId, req.user.user_id)
        res.json({ message: 'Messages marked as read', updated })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router