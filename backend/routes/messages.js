const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/messages/conversations — list of people I've chatted with + last message + unread count
router.get('/conversations', auth, async (req, res) => {
    try {
        const myId = new mongoose.Types.ObjectId(req.user._id);

        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [{ senderId: myId }, { recipientId: myId }]
                }
            },
            {
                $addFields: {
                    otherUser: {
                        $cond: [{ $eq: ['$senderId', myId] }, '$recipientId', '$senderId']
                    }
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$otherUser',
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ['$recipientId', myId] }, { $eq: ['$read', false] }] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            {
                $project: {
                    otherUser: { _id: '$user._id', name: '$user.name', email: '$user.email', isDoctor: '$user.isDoctor' },
                    lastMessage: 1,
                    unreadCount: 1
                }
            },
            { $sort: { 'lastMessage.createdAt': -1 } }
        ]);

        res.json({ success: true, data: { conversations } });
    } catch (error) {
        console.error('Conversations error:', error);
        res.status(500).json({ success: false, message: 'Error fetching conversations', error: error.message });
    }
});

// GET /api/messages/with/:userId — messages between me and :userId
router.get('/with/:userId', auth, async (req, res) => {
    try {
        const myId = req.user._id;
        const otherId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { senderId: myId, recipientId: otherId },
                { senderId: otherId, recipientId: myId }
            ]
        }).sort({ createdAt: 1 });

        // Mark messages sent to me as read
        await Message.updateMany(
            { senderId: otherId, recipientId: myId, read: false },
            { $set: { read: true } }
        );

        const otherUser = await User.findById(otherId).select('name email isDoctor');

        res.json({ success: true, data: { messages, otherUser } });
    } catch (error) {
        console.error('Fetch messages error:', error);
        res.status(500).json({ success: false, message: 'Error fetching messages', error: error.message });
    }
});

// POST /api/messages — send a message
router.post('/', auth, async (req, res) => {
    try {
        const { recipientId, content, appointmentId } = req.body;
        if (!recipientId || !content) {
            return res.status(400).json({ success: false, message: 'recipientId and content are required' });
        }
        if (String(recipientId) === String(req.user._id)) {
            return res.status(400).json({ success: false, message: 'Cannot message yourself' });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) return res.status(404).json({ success: false, message: 'Recipient not found' });

        const message = await Message.create({
            senderId: req.user._id,
            recipientId,
            appointmentId: appointmentId || null,
            content: content.trim()
        });

        res.status(201).json({ success: true, data: { message } });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
    }
});

// GET /api/messages/unread-count
router.get('/unread-count', auth, async (req, res) => {
    try {
        const count = await Message.countDocuments({ recipientId: req.user._id, read: false });
        res.json({ success: true, data: { count } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error', error: error.message });
    }
});

module.exports = router;
