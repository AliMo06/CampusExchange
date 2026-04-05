const Message = require('../Middleware/Message')

class MessageFactory {

    static createMessage(data) {

        return new Message(
            data.message_id || null,
            data.listing_id,
            data.sender_id,
            data.receiver_id,
            data.content,
            data.sent_at || new Date(),
            data.is_read || false
        )

    }

}

module.exports = MessageFactory