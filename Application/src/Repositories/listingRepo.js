const db = require('../../../Data/db')
const ListingFactory = require('../Services/listingFactory')

//listing repo that can create listings and manage them
class ListingRepository {

    async createListing(listingData) {

        const listing = ListingFactory.createListing(listingData)

        const query = `
        INSERT INTO listings
        (seller_id, category_id, title, description, price, condition, status)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *
        `

        const result = await db.query(query, [
            listing.sellerId,
            listing.categoryId,
            listing.title,
            listing.description,
            listing.price,
            listing.condition,
            listing.status
        ])

        return ListingFactory.createListing(result.rows[0])

    }

    async getAllListings() {

        const result = await db.query(`
        SELECT * FROM listings
        WHERE status='active'
        ORDER BY created_at DESC
        `)

        return result.rows.map(row =>
            ListingFactory.createListing(row)
        )

    }

}

module.exports = new ListingRepository()