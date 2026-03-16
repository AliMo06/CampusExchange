const router = require('express').Router()

const userRepository = require('../Repositories/userRepo')

router.post('/register', async (req,res) => {

    try {

        const user = await userRepository.createUser(req.body)

        res.json(user)

    } catch(err) {

        res.status(500).json({error: err.message})

    }

})

module.exports = router