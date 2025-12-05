const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: null },
    coverUrl: { type: String, default: null },
    postsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    notificationsToken: { type: String, default: null }, // FCM token
    // Store issued refresh tokens so they can be revoked on logout
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
