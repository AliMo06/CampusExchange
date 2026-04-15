const db = require('../../../Data/db')
const ListingFactory = require('../Services/listingFactory')

// handles all database operations for listings
class ListingRepository {

    // insert a new listing into the database
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
        
        const newListing = result.rows[0];

        // NEW: If an image_url was provided, insert it into the listing_images table
        if (listingData.image_url && listingData.image_url.trim() !== '') {
            await db.query(
                `INSERT INTO listing_images (listing_id, image_url) VALUES ($1, $2)`,
                [newListing.listing_id, listingData.image_url]
            )
            // Attach it so the frontend has it immediately
            newListing.images = [listingData.image_url];
        }

        return ListingFactory.createListing(newListing)

    }

    // get all active listings, newest first
    async getAllListings() {
        const result = await db.query(`
        SELECT l.*,
            (SELECT json_agg(image_url) FROM listing_images WHERE listing_id = l.listing_id) as images
        FROM listings l
        WHERE l.status='active'
        ORDER BY l.created_at DESC
        `)

        return result.rows.map(row => ListingFactory.createListing(row))
    }

    // get a single listing by its id (UPDATED WITH JOIN)
    async getListingById(id) {
        const query = `
            SELECT 
                l.*,
                u.first_name, 
                u.last_name,
                (SELECT json_agg(image_url) FROM listing_images WHERE listing_id = l.listing_id) as images
            FROM listings l
            JOIN users u ON l.seller_id = u.user_id
            WHERE l.listing_id = $1;
        `;

        const result = await db.query(query, [id])

        if (!result.rows.length) return null
        return ListingFactory.createListing(result.rows[0])
    }

    // delete a listing by its id
    async deleteListing(id) {
        const result = await db.query(
            `DELETE FROM listings WHERE listing_id = $1 RETURNING *`,
            [id]
        )

        if (!result.rows.length) return null
        return ListingFactory.createListing(result.rows[0])
    }

    // update a listing by its id with whatever fields are passed in
    async updateListing(listingData, id) {
        const fields = Object.keys(listingData)
        const values = Object.values(listingData)

        // build the SET clause dynamically based on what fields were passed
        const setClause = fields
            .map((field, index) => `${field} = $${index + 1}`)
            .join(', ')

        const result = await db.query(
            `UPDATE listings SET ${setClause} WHERE listing_id = $${fields.length + 1} RETURNING *`,
            [...values, id]
        )

        if (!result.rows.length) return null
        return ListingFactory.createListing(result.rows[0])
    }

    // search active listings by keyword in title or description
    async searchListings(keyword) {

        const query = `
        SELECT *
        FROM listings
        WHERE status = 'active'
        AND (
            LOWER(title) LIKE LOWER($1)
            OR LOWER(description) LIKE LOWER($1)
        )
        ORDER BY created_at DESC
        `

        const result = await db.query(query, [`%${keyword}%`])

        return result.rows.map(row =>
            ListingFactory.createListing(row)
        )
    }

    // filter active listings by category, price range, and/or condition
    async filterListings(filters) {
        const conditions = [`status = 'active'`]
        const values = []
        let i = 1

        // add each filter only if it was actually passed in
        if (filters.category_id) {
            conditions.push(`category_id = $${i++}`)
            values.push(filters.category_id)
        }

        if (filters.condition) {
            conditions.push(`condition = $${i++}`)
            values.push(filters.condition)
        }

        if (filters.min_price) {
            conditions.push(`price >= $${i++}`)
            values.push(filters.min_price)
        }

        if (filters.max_price) {
            conditions.push(`price <= $${i++}`)
            values.push(filters.max_price)
        }

        // build the full query dynamically based on what filters were passed
        const query = `
            SELECT l.*,
                (SELECT json_agg(image_url) FROM listing_images WHERE listing_id = l.listing_id) as images 
            FROM listings l
            WHERE ${conditions.join(' AND ')}
            ORDER BY l.created_at DESC
        `

        const result = await db.query(query, values)
        return result.rows.map(row => ListingFactory.createListing(row))
    }
    
}

module.exports = new ListingRepository()