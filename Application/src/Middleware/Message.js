//Message class model for easy factory implementation
class Message {

    constructor(messageId, listingId, senderId, receiverId, content, sentAt, isRead) {

        this.messageId = messageId
        this.listingId = listingId
        this.senderId = senderId
        this.receiverId = receiverId
        this.content = content
        this.sentAt = sentAt
        this.isRead = isRead

    }

}

module.exports = Message