import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const registerUser = async (req, res) => {
    const { user_name, password, email } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute(
            'INSERT INTO users (user_name, password, email) VALUES (?, ?, ?)',
            [user_name, hashedPassword, email]
        );
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        const userData = {
            "user_id": String(user.user_id),
            "user_name": user.user_name,
            "email": user.email
        }
        res.status(200).json({ message: "login successful", token, user: userData});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserProfile = async (req, res) => {
    const userId = req.user.user_id;

    try {
        const [rows] = await db.execute(
            'SELECT user_id, username FROM users WHERE user_id = ?',
            [userId]
        );

        const user = rows[0];

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};