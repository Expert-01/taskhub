import { query } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

export async function signup(req, res, next) {
	try {
		const { email, password, name } = req.body;
		if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

		const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
		if (existing.rowCount > 0) return res.status(409).json({ error: 'User already exists' });

		const hashed = await bcrypt.hash(password, SALT_ROUNDS);
		const result = await query(
			`INSERT INTO users (email, password_hash, name, created_at)
			 VALUES ($1, $2, $3, now()) RETURNING id, email, name`,
			[email.toLowerCase(), hashed, name || null]
		);

		const user = result.rows[0];
		const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

		res.status(201).json({ user, token });
	} catch (err) {
		next(err);
	}
}

export async function login(req, res, next) {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

		const result = await query('SELECT id, email, password_hash, name FROM users WHERE email = $1', [email.toLowerCase()]);
		if (result.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' });

		const user = result.rows[0];
		const ok = await bcrypt.compare(password, user.password_hash);
		if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

		const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
		res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
	} catch (err) {
		next(err);
	}
}

export default { signup, login };
