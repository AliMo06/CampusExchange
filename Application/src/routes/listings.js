const router = require('express').Router()

const listingRepository = require('../Repositories/listingRepo')

const { requireAuth, requireRole } = require('../Middleware/authMiddleware')

router.post('/', requireAuth, async (req,res)=>{

    try {

        const listing = await listingRepository.createListing(req.body)

        res.json(listing)

    } catch(err){

        res.status(500).json({error: err.message})

    }

})

router.get('/', async (req,res)=>{

    try {

        const listings = await listingRepository.getAllListings()

        res.json(listings)

    } catch(err){

        res.status(500).json({error: err.message})

    }

})

module.exports = router