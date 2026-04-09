const db = require('../../../Data/db')
const MessageFactory = require('../Services/messageFactory')

class MessageRepository {

    //insert a new message into the database
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

    //get all messages between two users for a specific listing
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

     // mark all messages in a conversation as read for the receiver
    async markAsRead(listingId, receiverId) {
        const query = `
            UPDATE messages
            SET is_read = true
            WHERE listing_id = $1
            AND receiver_id = $2
            AND is_read = false
            RETURNING *
        `

        const result = await db.query(query, [listingId, receiverId])
        return result.rows.map(row => MessageFactory.createMessage(row))
    }

    // get all unique conversations for a user
    async getUserConversations(userId) {
        const query = `
            SELECT DISTINCT ON (listing_id, 
                LEAST(sender_id, receiver_id), 
                GREATEST(sender_id, receiver_id))
                *
            FROM messages
            WHERE sender_id = $1 OR receiver_id = $1
            ORDER BY listing_id, 
                LEAST(sender_id, receiver_id), 
                GREATEST(sender_id, receiver_id),
                sent_at DESC
        `

        const result = await db.query(query, [userId])
        return result.rows.map(row => MessageFactory.createMessage(row))
    }
}


module.exports = new MessageRepository()