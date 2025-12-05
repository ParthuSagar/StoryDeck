const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { timeAgo } = require('../utils/timeAgo');

// ---------------------------------------------
// GET /api/messages/conversations
// ---------------------------------------------
router.get('/conversations', auth, async (req, res) => {
  const me = req.user.id;

  try {
    const convs = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: new mongoose.Types.ObjectId(me) },
            { to: new mongoose.Types.ObjectId(me) }
          ]
        }
      },
      {
        $addFields: {
          other: {
            $cond: [
              { $eq: ['$from', new mongoose.Types.ObjectId(me)] },
              '$to',
              '$from'
            ]
          }
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$other',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$from', '$other'] }, { $eq: ['$to', new mongoose.Types.ObjectId(me)] }, { $eq: ['$isRead', false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          user: {
            _id: '$user._id',
            name: '$user.name',
            username: '$user.username',
            avatarUrl: '$user.avatarUrl'
          },
          lastMessage: {
            _id: '$lastMessage._id',
            text: '$lastMessage.text',
            isRead: '$lastMessage.isRead',
            readAt: '$lastMessage.readAt',
            createdAt: '$lastMessage.createdAt'
          },
          unreadCount: 1
        }
      },
      { $sort: { 'lastMessage.createdAt': -1 } }
    ]);

    // Add relative timestamps to responses
    const convsWithTime = convs.map(conv => ({
      ...conv,
      lastMessage: {
        ...conv.lastMessage,
        sentAgo: timeAgo(conv.lastMessage.createdAt),
        readAgo: conv.lastMessage.readAt ? timeAgo(conv.lastMessage.readAt) : null
      }
    }));

    res.json(convsWithTime);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ---------------------------------------------
// GET /api/messages/:userId
// ---------------------------------------------
router.get('/:userId', auth, async (req, res) => {
  const otherId = req.params.userId;
  const me = req.user.id;

  try {
    // MARK MESSAGES AS READ
    await Message.updateMany(
      { from: otherId, to: me, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    const messages = await Message.find({
      $or: [
        { from: me, to: otherId },
        { from: otherId, to: me }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('from', 'name username avatarUrl')
      .populate('to', 'name username avatarUrl');

    // Add relative timestamps to each message
    const messagesWithTime = messages.map(msg => ({
      ...msg.toObject(),
      sentAgo: timeAgo(msg.createdAt),
      readAgo: msg.readAt ? timeAgo(msg.readAt) : null
    }));

    res.json(messagesWithTime);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ---------------------------------------------
// POST /api/messages
// ---------------------------------------------
router.post('/', auth, async (req, res) => {
  const { to, text } = req.body;
  const from = req.user?.id;

  console.log("Incoming Message Request:");
  console.log("Logged in user (from JWT):", from);
  console.log("Recipient:", to);

  try {
    // ------------------------
    // 1. Validate IDs
    // ------------------------
    if (!from || !mongoose.Types.ObjectId.isValid(from)) {
      console.log("❌ Invalid or missing sender ID from JWT:", from);
      return res.status(401).json({ msg: 'Invalid or missing authenticated user' });
    }

    if (!to || !mongoose.Types.ObjectId.isValid(to)) {
      console.log("❌ Invalid recipient ID:", to);
      return res.status(400).json({ msg: 'Invalid recipient id' });
    }

    // ------------------------
    // 2. Validate sender exists in DB
    // ------------------------
    const sender = await User.findById(from).select('-password');

    if (!sender) {
      console.log("❌ Auth user ID does NOT exist in database:", from);
      return res.status(400).json({
        msg: 'Authenticated user not found. RE-LOGIN required!',
        fromToken: from
      });
    }

    // ------------------------
    // 3. Validate recipient exists
    // ------------------------
    const recipient = await User.findById(to).select('-password');

    if (!recipient) {
      console.log("❌ Recipient not found:", to);
      return res.status(400).json({ msg: 'Recipient user not found' });
    }

    // ------------------------
    // 4. Create message
    // ------------------------
    const msg = new Message({
      from: new mongoose.Types.ObjectId(from),
      to: new mongoose.Types.ObjectId(to),
      text
    });

    await msg.save();

    await msg.populate('from', 'name username avatarUrl');
    await msg.populate('to', 'name username avatarUrl');

    res.status(201).json(msg);

  } catch (err) {
    console.error('🔥 Error creating message:', err);
    res.status(500).send('Server error');
  }
});

// -----------------------------------------------
// PUT /api/messages/:messageId/read
// Mark a single message as read
// -----------------------------------------------
router.put('/:messageId/read', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ msg: 'Invalid message id' });
    }

    const msg = await Message.findById(messageId);
    if (!msg) {
      return res.status(404).json({ msg: 'Message not found' });
    }
    
    // Only recipient can mark as read
    if (msg.to.toString() !== userId) {
      return res.status(403).json({ msg: 'You can only mark your received messages as read' });
    }

    // Mark as read
    msg.isRead = true;
    msg.readAt = new Date();
    await msg.save();

    res.json({ success: true, msg });
  } catch (err) {
    console.error('Error marking message as read:', err.message);
    res.status(500).send('Server error');
  }
});

// -----------------------------------------------
// GET /api/messages/unread/count
// Get count of unread messages for current user
// -----------------------------------------------
router.get('/unread/count', auth, async (req, res) => {
  try {
    const me = req.user.id;
    const unreadCount = await Message.countDocuments({
      to: me,
      isRead: false
    });
    res.json({ unreadCount });
  } catch (err) {
    console.error('Error getting unread count:', err.message);
    res.status(500).send('Server error');
  }
});

// -----------------------------------------------
// PUT /api/messages/markAsRead/:userId
// Mark all messages from a user as read (conversation)
// -----------------------------------------------
router.put('/markAsRead/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const me = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user id' });
    }

    const result = await Message.updateMany(
      { from: userId, to: me, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    res.json({ success: true, updatedCount: result.modifiedCount });
  } catch (err) {
    console.error('Error marking messages as read:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
