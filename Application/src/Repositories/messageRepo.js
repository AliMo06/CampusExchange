const db = require('../../../Data/db')
const MessageFactory = require('../Services/messageFactory')

class MessageRepository {

    async sendMessage(data) {

        const message = MessageFactory.createMessage(data)

        const query = `
        INSERT INTO messages
        (listing_id, sender_id, receiver_id, content)
        VALUES ($1,$2,$3,$4)
        RETURNING *
        `

        const result = await db.query(query, [
            message.listingId,
            message.senderId,
            message.receiverId,
            message.content
        ])

        return MessageFactory.createMessage(result.rows[0])
    }

    async getConversation(listingId, user1, user2) {

        const query = `
        SELECT * FROM messages
        WHERE listing_id=$1
        AND (
            (sender_id=$2 AND receiver_id=$3)
            OR
            (sender_id=$3 AND receiver_id=$2)
        )
        ORDER BY sent_at ASC
        `

        const result = await db.query(query, [listingId, user1, user2])

        return result.rows.map(row =>
            MessageFactory.createMessage(row)
        )
    }

}

module.exports = new MessageRepository()