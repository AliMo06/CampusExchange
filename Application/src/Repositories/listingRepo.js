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

    //Function to delete a listing
    async deleteListing(id) {
        const result = await db.query( //Delete and return deleted row to confirm deletion
            `DELETE FROM listings WHERE id = $1 RETURNING *`,
            [id]
        )

        if (!result.rows.length) return null //If there wasnt anything, return null

        return ListingFactory.createListing(result.rows[0]) //Return
    }

    //Function to update a listing via id
    async updateListing(listingData, id) {
        const fields = Object.keys(listingData)
        const values = Object.values(listingData)

        //Map the fields to a string so that we can use it to acess the database and update proper values
        const setClause = fields
            .map((field, index) => `${field} = $${index + 1}`)
            .join(', ')

        //SQL to update database, return updated info
        const result = await db.query(
            `UPDATE listings SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
            [...values, id]
        )

        if (!result.rows.length) return null //If there wasnt anything, return null

        return ListingFactory.createListing(result.rows[0]) //Return
    }
}

module.exports = new ListingRepository()