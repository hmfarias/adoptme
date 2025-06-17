import UserDTO from '../dto/user.dto.js';
import { usersService } from '../services/index.js';
import { createHash } from '../utils/index.js';

const getAllUsers = async (req, res) => {
	try {
		const users = await usersService.getAll();

		if (!users || users.length === 0) {
			req.logger.warning('User list is empty');
			return res
				.status(404)
				.send({ error: true, message: 'Users not found', payload: null });
		}
		const usersDto = users.map((user) => UserDTO.getUserResponseFrom(user));
		res.send({ error: false, message: 'Success', payload: usersDto });
	} catch (error) {
		req.logger.error(`Error in getAllUsers: ${error.message}`, { stack: error.stack });
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};

const getUser = async (req, res) => {
	try {
		const userId = req.params.uid;
		const user = await usersService.getUserById(userId);
		if (!user) {
			req.logger.warning(`User not found - ID: ${userId}`);
			return res
				.status(404)
				.send({ error: true, message: 'User not found', payload: null });
		}
		const userDto = UserDTO.getUserResponseFrom(user);
		res.send({ error: false, message: 'User retrieved', payload: userDto });
	} catch (error) {
		req.logger.error(`Error in getUser: ${error.message}`, { stack: error.stack });
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};

const updateUser = async (req, res) => {
	try {
		const updateBody = req.body;
		const userId = req.params.uid;

		const user = await usersService.getUserById(userId);
		if (!user) {
			req.logger.warning(`User not found - ID: ${userId}`);
			return res
				.status(404)
				.send({ error: true, message: 'User not found', payload: null });
		}

		// If a new password is sent, must be hashed
		if (updateBody.password) {
			updateBody.password = await createHash(updateBody.password);
		}

		const result = await usersService.update(userId, updateBody);
		if (!result) {
			req.logger.warning(`User could not be updated - ID: ${userId}`);
			return res
				.status(422)
				.send({ status: 'error', error: 'User could not be updated' });
		}
		const userDto = UserDTO.getUserResponseFrom(result);
		res.send({ error: false, message: 'User updated', payload: userDto });
	} catch (error) {
		req.logger.error(`Error in updateUser: ${error.message}`, { stack: error.stack });
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};

// const deleteUser = async (req, res) => {
// 	const userId = req.params.uid;
// 	const result = await usersService.getUserById(userId);
// 	res.send({ status: 'success', message: 'User deleted' });
// };
const deleteUser = async (req, res) => {
	try {
		const userId = req.params.uid;
		const user = await usersService.getUserById(userId);
		if (!user) {
			req.logger.warning(`User not found - ID: ${userId}`);
			return res
				.status(404)
				.send({ error: true, message: 'User not found', payload: null });
		}

		const result = await usersService.delete(userId);
		if (!result) {
			req.logger.warning('User could not be deleted');
			return res
				.status(422)
				.send({ error: true, message: 'User could not be deleted', payload: null });
		}
		res.send({ error: false, message: 'User deleted', payload: result });
	} catch (error) {
		req.logger.error(`Error in deleteUser: ${error.message}`, { stack: error.stack });
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};

export default {
	deleteUser,
	getAllUsers,
	getUser,
	updateUser,
};
