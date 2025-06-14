import { usersService } from '../services/index.js';
import { createHash, passwordValidation } from '../utils/index.js';
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/user.dto.js';

const register = async (req, res) => {
	try {
		const { first_name, last_name, email, password } = req.body;
		if (!first_name || !last_name || !email || !password) {
			req.logger.warning('Incomplete values for registering a user');
			return res.status(400).send({ status: 'error', error: 'Incomplete values' });
		}

		const exists = await usersService.getUserByEmail(email);
		if (exists) {
			req.logger.warning('User already exists');
			return res.status(400).send({ status: 'error', error: 'User already exists' });
		}

		const hashedPassword = await createHash(password);
		const user = {
			first_name,
			last_name,
			email,
			password: hashedPassword,
		};
		let result = await usersService.create(user);
		if (!result) {
			req.logger.warning('User not created');
			return res.status(404).send({ status: 'error', error: 'User not created' });
		}
		req.logger.info(`User created: ${result}`);
		res.send({ status: 'success', payload: result._id });
	} catch (error) {
		req.logger.error(`Error in register: ${error.message}`, { stack: error.stack });
		res.status(500).send({ status: 'error', error: 'Internal server error' });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			req.logger.warning('Incomplete values for login');
			return res.status(400).send({ status: 'error', error: 'Incomplete values' });
		}

		const user = await usersService.getUserByEmail(email);
		if (!user) {
			req.logger.warning('User not found');
			return res.status(404).send({ status: 'error', error: "User doesn't exist" });
		}

		const isValidPassword = await passwordValidation(user, password);
		if (!isValidPassword) {
			req.logger.warning('Incorrect password');
			return res.status(400).send({ status: 'error', error: 'Incorrect password' });
		}

		const userDto = UserDTO.getUserTokenFrom(user);
		const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: '1h' });
		res
			.cookie('coderCookie', token, { maxAge: 3600000 })
			.send({ status: 'success', message: 'Logged in' });
	} catch (error) {
		req.logger.error(`Error in login: ${error.message}`, { stack: error.stack });
		res.status(500).send({ status: 'error', error: 'Internal server error' });
	}
};

const current = async (req, res) => {
	try {
		const cookie = req.cookies['coderCookie'];
		const user = jwt.verify(cookie, 'tokenSecretJWT');
		if (user) {
			req.logger.info(`User logged in: ${user}`);
			return res.send({ status: 'success', payload: user });
		}
	} catch (error) {
		req.logger.error(`Error in current: ${error.message}`, { stack: error.stack });
		res.status(401).send({ status: 'error', error: 'Invalid or expired token' });
	}
};

const unprotectedLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			req.logger.warning('Incomplete values for unprotected login');
			return res.status(400).send({ status: 'error', error: 'Incomplete values' });
		}

		const user = await usersService.getUserByEmail(email);
		if (!user) {
			req.logger.warning('User not found');
			return res.status(404).send({ status: 'error', error: "User doesn't exist" });
		}

		const isValidPassword = await passwordValidation(user, password);
		if (!isValidPassword) {
			req.logger.warning('Incorrect password');
			return res.status(400).send({ status: 'error', error: 'Incorrect password' });
		}

		const token = jwt.sign(user, 'tokenSecretJWT', { expiresIn: '1h' });
		res
			.cookie('unprotectedCookie', token, { maxAge: 3600000 })
			.send({ status: 'success', message: 'Unprotected Logged in' });
	} catch (error) {
		req.logger.error(`Error in unprotectedLogin: ${error.message}`, {
			stack: error.stack,
		});
		res.status(500).send({ status: 'error', error: 'Internal server error' });
	}
};

const unprotectedCurrent = async (req, res) => {
	try {
		const cookie = req.cookies['unprotectedCookie'];
		const user = jwt.verify(cookie, 'tokenSecretJWT');
		if (user) {
			req.logger.info(`User logged in: ${user}`);
			return res.send({ status: 'success', payload: user });
		}
	} catch (error) {
		req.loggger.error(`Error in unprotectedCurrent: ${error.message}`, {
			stack: error.stack,
		});
		res.status(401).send({ status: 'error', error: 'Invalid or expired token' });
	}
};
export default {
	current,
	login,
	register,
	unprotectedLogin,
	unprotectedCurrent,
};
