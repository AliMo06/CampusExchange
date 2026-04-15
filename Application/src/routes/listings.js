const router = require('express').Router()

const listingRepository = require('../Repositories/listingRepo')

const { requireAuth, requireRole } = require('../Middleware/authMiddleware')

//create a listing
router.post('/', requireAuth, async (req,res)=>{

    try {
        // Force seller_id to be the authenticated user's ID
        req.body.seller_id = req.user.user_id; 

        const listing = await listingRepository.createListing(req.body)

        res.json(listing)

    } catch(err){
        res.status(500).json({error: err.message})
    }

})

// get all listings with optional filters
router.get('/', async (req, res) => {
    try {
        const { category_id, condition, min_price, max_price } = req.query

        if (category_id || condition || min_price || max_price) {
            const listings = await listingRepository.filterListings(req.query)
            return res.json(listings)
        }

        const listings = await listingRepository.getAllListings()
        res.json(listings)
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
})

// search listings by keyword
router.get('/search', async (req, res) => {
    const { q } = req.query
    try {
        const results = await listingRepository.searchListings(q)
        res.json(results)
    } catch (err) {
        res.status(500).json({ error: err.message })
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

// Get a single listing by ID
router.get('/:id', async (req, res) => {
    try {
        const listing = await listingRepository.getListingById(req.params.id)
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' })
        }
        res.json(listing)
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
})

// delete a listing - only the seller or an admin can do this
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