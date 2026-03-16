const Listing = require('../Middleware/Listing')

//listing factory that creates a listing utilizing the listing model
class ListingFactory {

    static createListing(data) {

        return new Listing(
            data.listing_id || null,
            data.seller_id,
            data.category_id,
            data.title,
            data.description,
            data.price,
            data.condition,
            data.status || "active"
        )

    }

}

module.exports = ListingFactory