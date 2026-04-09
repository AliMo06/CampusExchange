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

router.put('/:id', requireAuth, async (req, res) => {
    try {
        // fetch first, check ownership, then update
        const existing = await listingRepository.getListingById(req.params.id)
        if (!existing) return res.status(404).json({ error: 'Listing not found' })

        if (existing.sellerId !== req.user.user_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You can only edit your own listings' })
        }

        const updated = await listingRepository.updateListing(req.body, req.params.id)
        res.json(updated)
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
})

router.delete('/:id', requireAuth, async (req, res) => {
    try {
        // fetch first, check ownership, then delete
        const existing = await listingRepository.getListingById(req.params.id)
        if (!existing) return res.status(404).json({ error: 'Listing not found' })

        if (existing.sellerId !== req.user.user_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You can only delete your own listings' })
        }

        await listingRepository.deleteListing(req.params.id)
        res.json({ message: 'Listing deleted successfully' })
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router