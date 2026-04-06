const router = require('express').Router()

const reportRepo = require('../Repositories/reportRepo')

router.post('/', async (req, res) => {

    try {

        const report = await reportRepo.createReport(req.body)

        res.json(report)

    } catch (err) {

        res.status(500).json({ error: err.message })

    }

})

module.exports = router