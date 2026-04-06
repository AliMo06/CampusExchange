const router = require('express').Router()

const messageRepo = require('../Repositories/messageRepo')

// Send message
router.post('/', async (req, res) => {

    try {

        const message = await messageRepo.sendMessage(req.body)

        res.json(message)

    } catch (err) {

        res.status(500).json({ error: err.message })

    }

})

// Get conversation
router.get('/', async (req, res) => {

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

module.exports = router