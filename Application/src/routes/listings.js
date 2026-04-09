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
        const listing = await listingRepository.updateListing(req.body, req.params.id)
        if (!listing) return res.status(404).json({ error: 'Listing not found' })

        // check if the person editing is the seller or an admin
        if (listing.sellerId !== req.user.user_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You can only edit your own listings' })
        }

        res.json(listing)
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
})

router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const listing = await listingRepository.deleteListing(req.params.id)
        if (!listing) return res.status(404).json({ error: 'Listing not found' })

        // check if the person deleting is the seller or an admin
        if (listing.sellerId !== req.user.user_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You can only delete your own listings' })
        }

        res.json({ message: 'Listing deleted successfully' })
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/search', async (req, res) => {

    const { q } = req.query

    try {

        const results = await listingRepository.searchListings(q)

        res.json(results)

    } catch (err) {

        res.status(500).json({ error: err.message })

    }

})

router.get('/', async (req, res) => {
    try {
        const { category_id, condition, min_price, max_price } = req.query

        // if any filters were passed, use filterListings, otherwise get all
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

module.exports = router