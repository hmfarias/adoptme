import { usersService } from '../services/index.js';

const getAllUsers = async (req, res) => {
	try {
		const users = await usersService.getAll();

		if (!users || users.length === 0) {
			req.logger.warning('User list is empty');
			return res.send({ status: 'success', payload: users });
		}
		res.send({ status: 'success', payload: users });
	} catch (error) {
		req.logger.error(`Error in getAllUsers: ${error.message}`, { stack: error.stack });
		res.status(500).send({ status: 'error', error: 'Internal server error' });
	}
};

const getUser = async (req, res) => {
	try {
		const userId = req.params.uid;
		const user = await usersService.getUserById(userId);
		if (!user) {
			req.logger.warning(`User not found - ID: ${userId}`);
			return res.status(404).send({ status: 'error', error: 'User not found' });
		}
		res.send({ status: 'success', payload: user });
	} catch (error) {
		req.logger.error(`Error in getUser: ${error.message}`, { stack: error.stack });
		res.status(500).send({ status: 'error', error: 'Internal server error' });
	}
};

const updateUser = async (req, res) => {
	try {
		const updateBody = req.body;
		const userId = req.params.uid;

		const user = await usersService.getUserById(userId);
		if (!user) {
			req.logger.warning(`User not found - ID: ${userId}`);
			return res.status(404).send({ status: 'error', error: 'User not found' });
		}

		const result = await usersService.update(userId, updateBody);
		if (!result) {
			req.logger.warning(`User not updated - ID: ${userId}`);
			return res.status(400).send({ status: 'error', error: 'User not updated' });
		}
		res.send({ status: 'success', message: 'User updated' });
	} catch (error) {
		req.logger.error(`Error in updateUser: ${error.message}`, { stack: error.stack });
		res.status(500).send({ status: 'error', error: 'Internal server error' });
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
			return res.status(404).send({ status: 'error', error: 'User not found' });
		}

		await usersService.delete(userId);
		res.send({ status: 'success', message: 'User deleted' });
	} catch (error) {
		req.logger.error(`Error in deleteUser: ${error.message}`, { stack: error.stack });
		res.status(500).send({ status: 'error', error: 'Internal server error' });
	}
};

export default {
	deleteUser,
	getAllUsers,
	getUser,
	updateUser,
};
