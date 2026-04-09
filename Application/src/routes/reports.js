const router = require('express').Router()

const reportRepo = require('../Repositories/reportRepo')

const { requireAuth, requireRole } = require('../Middleware/authMiddleware')

//create a report (must be logged in)
router.post('/', requireAuth, async (req, res) => {

    try {

        const report = await reportRepo.createReport(req.body)

        res.json(report)

    } catch (err) {

        res.status(500).json({ error: err.message })

    }

})

module.exports = router