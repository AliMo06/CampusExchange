//listing class model for easy factory implementation
class Listing {

    constructor(listingId, sellerId, categoryId, title, description, price, condition, status, firstName, lastName, images) {

        this.listingId = listingId
        this.sellerId = sellerId
        this.categoryId = categoryId
        this.title = title
        this.description = description
        this.price = price
        this.condition = condition
        this.status = status
        
        // New properties added for the frontend UI
        this.firstName = firstName
        this.lastName = lastName
        this.images = images || []

    }

}

module.exports = Listing