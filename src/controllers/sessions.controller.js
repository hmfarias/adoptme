import { usersService } from '../services/index.js';
import { createHash, passwordValidation } from '../utils/index.js';
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/user.dto.js';

const register = async (req, res) => {
	try {
		const { first_name, last_name, email, password } = req.body;

		if (!first_name || !last_name || !email || !password) {
			req.logger.warning('Incomplete values for registering a user');
			return res
				.status(400)
				.send({ error: true, message: 'Incomplete values', payload: null });
		}

		const exists = await usersService.getUserByEmail(email);
		if (exists) {
			req.logger.warning('User already exists');
			return res
				.status(400)
				.send({ error: true, message: 'User already exists', payload: null });
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
			req.logger.warning('User could not be created');
			return res
				.status(422)
				.send({ error: true, message: 'User could not be created', payload: null });
		}
		const resultDto = UserDTO.getUserResponseFrom(result);
		req.logger.info('User created', { resultDto });
		res.send({
			error: false,
			message: 'User registered successfully',
			payload: resultDto,
		});
	} catch (error) {
		req.logger.error(`Error in register: ${error.message}`, { stack: error.stack });
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			req.logger.warning('Incomplete values for login');
			return res
				.status(400)
				.send({ error: true, message: 'Incomplete values', payload: null });
		}

		const user = await usersService.getUserByEmail(email);
		if (!user) {
			req.logger.warning('User not found');
			return res
				.status(404)
				.send({ error: true, message: 'User not found', payload: null });
		}

		const isValidPassword = await passwordValidation(user, password);
		if (!isValidPassword) {
			req.logger.warning('Invalid credentials');
			return res
				.status(401)
				.send({ error: true, message: 'Invalid credentials', payload: null });
		}

		const userDto = UserDTO.getUserResponseFrom(user);
		const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: '1h' });
		res
			.cookie('coderCookie', token, { maxAge: 3600000 })
			.send({ error: false, message: 'Logged in', payload: userDto });
	} catch (error) {
		req.logger.error(`Error in login: ${error.message}`, { stack: error.stack });
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};

const current = async (req, res) => {
	try {
		const cookie = req.cookies['coderCookie'];
		if (!cookie) {
			req.logger.warning('No token provided');
			return res
				.status(401)
				.send({ error: true, message: 'Authentication required', payload: null });
		}
		const user = jwt.verify(cookie, 'tokenSecretJWT');

		req.logger.info(`User logged in: ${user}`);
		return res.send({ error: false, message: 'User logged in', payload: user });
	} catch (error) {
		req.logger.error(`Error in current: ${error.message}`, { stack: error.stack });
		res
			.status(401)
			.send({ error: true, message: 'Invalid or expired token', payload: null });
	}
};

const unprotectedLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			req.logger.warning('Incomplete values for unprotected login');
			return res
				.status(400)
				.send({ error: true, message: 'Incomplete values', payload: null });
		}

		const user = await usersService.getUserByEmail(email);
		if (!user) {
			req.logger.warning('User not found');
			return res
				.status(404)
				.send({ error: true, message: 'User not found', payload: null });
		}

		const isValidPassword = await passwordValidation(user, password);
		if (!isValidPassword) {
			req.logger.warning('Invalid credentials');
			return res
				.status(401)
				.send({ error: true, message: 'Invalid credentials', payload: null });
		}

		const token = jwt.sign(user.toObject(), 'tokenSecretJWT', { expiresIn: '1h' });
		res
			.cookie('unprotectedCookie', token, { maxAge: 3600000 })
			.send({ error: false, message: 'Unprotected Logged in', payload: user });
	} catch (error) {
		req.logger.error(`Error in unprotectedLogin: ${error.message}`, {
			stack: error.stack,
		});
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};

const unprotectedCurrent = async (req, res) => {
	try {
		const cookie = req.cookies['unprotectedCookie'];
		if (!cookie) {
			req.logger.warning('No token provided in unprotectedCurrent');
			return res.status(401).send({
				error: true,
				message: 'Autentication required',
				payload: null,
			});
		}

		const user = jwt.verify(cookie, 'tokenSecretJWT');

		if (!user) {
			req.logger.warning('Token verification failed in unprotectedCurrent');
			return res.status(401).send({
				error: true,
				message: 'Invalid or expired token',
				payload: null,
			});
		}

		req.logger.info('User logged in', { user });
		res.send({
			error: false,
			message: 'User logged in',
			payload: user,
		});
	} catch (error) {
		req.logger.error(`Error in unprotectedCurrent: ${error.message}`, {
			stack: error.stack,
		});
		res
			.status(401)
			.send({ error: true, message: 'Invalid or expired token', payload: null });
	}
};
export default {
	current,
	login,
	register,
	unprotectedLogin,
	unprotectedCurrent,
};
