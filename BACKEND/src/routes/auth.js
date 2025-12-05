const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// ===============================
// REGISTER
// ===============================
router.post('/register', async (req, res) => {
    const { name, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !username || !password) {
        return res.status(409).json({ msg: 'Required fields cannot be left blank.' });
    }

    if (!emailRegex.test(email)) {
        return res.status(409).json({ msg: 'Invalid email format.' });
    }

    try {
        let existing = await User.findOne({ username });
        if (existing) return res.status(401).json({ msg: 'Username already exists' });

        let foundEmail = await User.findOne({ email });
        if (foundEmail) return res.status(400).json({ msg: 'Email address already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        let user = new User({
            name,
            username,
            email,
            password: hashed,
            followersCount: 0,
            followingCount: 0
        });

        const payload = { user: { id: user.id } };

        const access = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
            expiresIn: '7d'
        });

        const refresh = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refreshsecret', {
            expiresIn: '30d'
        });

        user.refreshTokens = [refresh];  
        await user.save();

        res.status(201).json({
            token: { access, refresh },
            user
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// ===============================
// LOGIN
// ===============================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ msg: 'No account found with this email' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

        const payload = { user: { id: user.id } };

        const access = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
            expiresIn: '7d'
        });

        const refresh = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refreshsecret', {
            expiresIn: '30d'
        });

        // store refresh token
        user.refreshTokens = user.refreshTokens || [];
        user.refreshTokens.push(refresh);
        await user.save();

        res.status(200).json({
            token: { access, refresh },
            user
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// ===============================
// REFRESH TOKEN
// ===============================
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken)
        return res.status(401).json({ msg: 'No refresh token provided' });

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET || 'refreshsecret'
        );

        const user = await User.findById(decoded.user.id);
        if (!user)
            return res.status(401).json({ msg: 'Invalid refresh token' });

        if (!user.refreshTokens.includes(refreshToken)) {
            return res.status(401).json({ msg: 'Refresh token revoked' });
        }

        const payload = { user: { id: user.id } };

        const access = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
            expiresIn: '10s'
        });

        return res.json({ access });

    } catch (err) {
        console.error('Refresh error:', err.message);
        return res.status(401).json({ msg: 'Invalid refresh token' });
    }
});


// ===============================
// LOGOUT
// ===============================
router.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken)
        return res.status(400).json({ msg: 'Refresh token required' });

    try {
        const decoded = jwt.decode(refreshToken);

        if (decoded?.user?.id) {
            const user = await User.findById(decoded.user.id);

            if (user.refreshTokens) {
                user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
                await user.save();
            }
        } else {
            await User.updateOne(
                { refreshTokens: refreshToken },
                { $pull: { refreshTokens: refreshToken } }
            );
        }

        res.status(200).json({ msg: 'Logged out' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
