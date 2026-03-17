//listing class model for easy factory implementation
class Listing {

    constructor(listingId, sellerId, categoryId, title, description, price, condition, status) {

        this.listingId = listingId
        this.sellerId = sellerId
        this.categoryId = categoryId
        this.title = title
        this.description = description
        this.price = price
        this.condition = condition
        this.status = status

    }

}

module.exports = Listing