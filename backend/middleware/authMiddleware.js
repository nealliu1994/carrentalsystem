
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log("🟢 Extracted Token:", token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("✅ Decoded Token:", decoded);
            req.user = await User.findById(decoded.id).select('-password');
            console.log("👤 Authenticated User:", req.user);
            next();
        } catch (error) {
            console.error("❌ Auth Error:", error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.error("❌ No Token Provided");
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
