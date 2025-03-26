
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    console.log('Received data:', req.body);
    console.log('Request Body:', req.body);
    const { name, email, password, dateOfBirth, driverLicenseNumber, phoneNumber, address } = req.body;
    console.log('Received data:', req.body);
    try {
        const userExists = await User.findOne({ email });

        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({
            name, email, password, dateOfBirth, driverLicenseNumber,
            phoneNumber, address
        });
        res.status(201).json({
            id: user.id, name: user.name, email: user.email, password: user.password,
            dateOfBirth: user.dateOfBirth, driverLicenseNumber: user.driverLicenseNumber,
            phoneNumber: user.phoneNumber, address: user.address, token: generateToken(user.id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ id: user.id, name: user.name, email: user.email, token: generateToken(user.id) });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth,
            driverLicenseNumber: user.driverLicenseNumber,
            address: user.address,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    console.log('Received update request:', req.body);
    console.log('User ID:', req.user?.id);

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized: No user found in request' });
    }
    try {
        console.log("Received update request:", req.body);
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, phoneNumber, address } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.address = address || user.address;



        console.log("Updated user object before save:", user);

        const updatedUser = await user.save();

        console.log("User updated successfully:", updatedUser);

        res.json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
            address: updatedUser.address,
            dateOfBirth: user.dateOfBirth,
            driverLicenseNumber: user.driverLicenseNumber,
            token: generateToken(updatedUser.id),
        });
    } catch (error) {
        console.error('Check whether update error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
