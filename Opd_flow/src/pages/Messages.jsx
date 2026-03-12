import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, User, ArrowLeft, MessageCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import authAPI, { messageAPI } from '../services/api';
import './Messages.css';

function Messages() {
    const navigate = useNavigate();
    const toast = useToast();
    const [searchParams] = useSearchParams();
    const presetUserId = searchParams.get('to');

    const [me, setMe] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [activeUser, setActiveUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
            navigate('/login', { state: { from: '/messages' } });
            return;
        }
        setMe(currentUser);
        loadConversations();
    }, [navigate]);

    useEffect(() => {
        if (presetUserId) openConversation(presetUserId);
    }, [presetUserId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Poll for new messages every 8 seconds while a conversation is open
    useEffect(() => {
        if (!activeUser) return;
        const interval = setInterval(() => {
            messageAPI.getConversationWith(activeUser._id).then(res => {
                if (res.success) setMessages(res.data.messages);
            }).catch(() => {});
        }, 8000);
        return () => clearInterval(interval);
    }, [activeUser]);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const res = await messageAPI.getConversations();
            if (res.success) setConversations(res.data.conversations);
        } catch (err) {
            toast.error('Failed to load conversations');
        } finally {
            setLoading(false);
        }
    };

    const openConversation = async (userId) => {
        try {
            const res = await messageAPI.getConversationWith(userId);
            if (res.success) {
                setActiveUser(res.data.otherUser);
                setMessages(res.data.messages);
                loadConversations();
            }
        } catch (err) {
            toast.error('Failed to open conversation');
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !activeUser || sending) return;

        const content = input.trim();
        setInput('');
        setSending(true);

        // Optimistic add
        const optimistic = {
            _id: `temp-${Date.now()}`,
            senderId: me._id || me.id,
            recipientId: activeUser._id,
            content,
            createdAt: new Date().toISOString(),
            optimistic: true,
        };
        setMessages(prev => [...prev, optimistic]);

        try {
            const res = await messageAPI.sendMessage(activeUser._id, content);
            if (res.success) {
                setMessages(prev => prev.map(m => m._id === optimistic._id ? res.data.message : m));
                loadConversations();
            }
        } catch (err) {
            setMessages(prev => prev.filter(m => m._id !== optimistic._id));
            toast.error('Failed to send message');
            setInput(content);
        } finally {
            setSending(false);
        }
    };

    if (!me) return null;

    const myId = String(me._id || me.id);

    return (
        <div className="msg-container">
            <aside className={`msg-sidebar ${activeUser ? 'msg-sidebar--hidden-mobile' : ''}`}>
                <div className="msg-sidebar-header">
                    <h2><MessageCircle size={18} /> Messages</h2>
                </div>
                {loading ? (
                    <div className="msg-empty">Loading...</div>
                ) : conversations.length === 0 ? (
                    <div className="msg-empty">
                        <p>No conversations yet</p>
                        <small>Start one by messaging a doctor from your appointments</small>
                    </div>
                ) : (
                    <ul className="msg-conversation-list">
                        {conversations.map(conv => (
                            <li
                                key={conv._id}
                                className={`msg-conv-item ${activeUser?._id === conv.otherUser._id ? 'msg-conv-item--active' : ''}`}
                                onClick={() => openConversation(conv.otherUser._id)}
                            >
                                <div className="msg-conv-avatar"><User size={18} /></div>
                                <div className="msg-conv-body">
                                    <div className="msg-conv-top">
                                        <span className="msg-conv-name">
                                            {conv.otherUser.isDoctor ? `Dr. ${conv.otherUser.name}` : conv.otherUser.name}
                                        </span>
                                        {conv.unreadCount > 0 && <span className="msg-unread-badge">{conv.unreadCount}</span>}
                                    </div>
                                    <p className="msg-conv-preview">{conv.lastMessage.content}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </aside>

            <section className={`msg-chat ${!activeUser ? 'msg-chat--empty-mobile' : ''}`}>
                {!activeUser ? (
                    <div className="msg-chat-empty">
                        <MessageCircle size={48} />
                        <p>Select a conversation to start chatting</p>
                    </div>
                ) : (
                    <>
                        <div className="msg-chat-header">
                            <button className="msg-back-btn" onClick={() => setActiveUser(null)}>
                                <ArrowLeft size={18} />
                            </button>
                            <div className="msg-chat-avatar"><User size={20} /></div>
                            <div>
                                <h3>{activeUser.isDoctor ? `Dr. ${activeUser.name}` : activeUser.name}</h3>
                                <p>{activeUser.email}</p>
                            </div>
                        </div>

                        <div className="msg-chat-body">
                            {messages.length === 0 ? (
                                <div className="msg-chat-empty-state">
                                    <p>No messages yet. Say hi!</p>
                                </div>
                            ) : (
                                messages.map((m) => {
                                    const isMine = String(m.senderId) === myId;
                                    return (
                                        <div key={m._id} className={`msg-bubble-row ${isMine ? 'msg-bubble-row--mine' : ''}`}>
                                            <div className={`msg-bubble ${isMine ? 'msg-bubble--mine' : ''} ${m.optimistic ? 'msg-bubble--pending' : ''}`}>
                                                <p>{m.content}</p>
                                                <span className="msg-time">
                                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="msg-input-row" onSubmit={handleSend}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                disabled={sending}
                            />
                            <button type="submit" disabled={!input.trim() || sending}>
                                <Send size={16} />
                            </button>
                        </form>
                    </>
                )}
            </section>
        </div>
    );
}

export default Messages;
