import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Get data from URL or LocalStorage
  const listingId = searchParams.get("listing");
  const receiverId = searchParams.get("seller");
  const currentUserId = parseInt(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!listingId || !receiverId || !currentUserId) return;
      
      try {
        // Matches the backend router.get('/') with query params
        const response = await fetch(
          `http://localhost:3000/api/messages?listingId=${listingId}&user1=${currentUserId}&user2=${receiverId}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [listingId, receiverId, currentUserId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const payload = {
      listing_id: parseInt(listingId),
      sender_id: currentUserId,
      receiver_id: parseInt(receiverId),
      content: newMessage.trim()
    };

    try {
      const response = await fetch("http://localhost:3000/api/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const savedMessage = await response.json();
        setMessages((prev) => [...prev, savedMessage]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading) return <div className="loading">Loading chat...</div>;

  return (
    <div className="messages-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div className="messages-window" style={{ height: '70vh', overflowY: 'auto', background: '#1a1d27', padding: '15px', borderRadius: '12px' }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.5 }}>No messages yet. Send an offer!</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.messageId} // FIXED: Using camelCase from Factory
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.senderId === currentUserId ? 'flex-end' : 'flex-start',
                marginBottom: '10px'
              }}
            >
              <div style={{
                background: msg.senderId === currentUserId ? '#F5A623' : '#2a2d3a',
                color: msg.senderId === currentUserId ? '#000' : '#fff',
                padding: '10px 15px',
                borderRadius: '12px',
                maxWidth: '80%'
              }}>
                {msg.content}
              </div>
              <small style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '4px' }}>
                {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </small>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter your offer..."
          style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#1a1d27', border: '1px solid #2a2d3a', color: '#fff' }}
        />
        <button type="submit" style={{ padding: '0 20px', background: '#F5A623', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Messages;