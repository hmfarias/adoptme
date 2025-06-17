// controllers/mocks.controller.js
import { generateFakeUser, generateFakePet } from '../utils.js';
import { usersService, petsService } from '../services/index.js';

const mockingUsers = async (req, res) => {
	const quantity = parseInt(req.query.quantity) || 50;

	// Check if quantity is a positive number
	if (isNaN(quantity) || quantity <= 0) {
		req.logger.error(`Invalid quantity: ${req.query.quantity}`);
		return res.status(400).json({
			error: true,
			message: 'Invalid quantity parameter.',
			payload: null,
		});
	}

	try {
		const users = await Promise.all(
			Array.from({ length: quantity }, () => generateFakeUser())
		);
		req.logger.info(`Generated ${users.length} mock users`);
		res.status(200).json({ error: false, message: 'mocking users', payload: users });
	} catch (error) {
		req.logger.error(`Error in mockingUsers: ${error.message}`, { stack: error.stack });
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};

const mockingPets = (req, res) => {
	const quantity = parseInt(req.query.quantity) || 50;

	// Check if quantity is a positive number
	if (isNaN(quantity) || quantity <= 0) {
		req.logger.warning(`Invalid quantity: ${req.query.quantity}`);
		return res.status(400).json({
			error: true,
			message: 'Invalid quantity parameter.',
			payload: null,
		});
	}

	try {
		const pets = Array.from({ length: quantity }, () => generateFakePet());
		req.logger.info(`Generated ${pets.length} mock pets`);
		res.status(200).json({ error: false, message: 'mocking pets', payload: pets });
	} catch (error) {
		req.logger.error(`Error in mockingPets: ${error.message}`, { stack: error.stack });
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};

const generateData = async (req, res) => {
	try {
		const { users = 0, pets = 0 } = req.body;

		const usersToInsert = await Promise.all(
			Array.from({ length: users }, () => generateFakeUser())
		);

		const petsToInsert = Array.from({ length: pets }, () => generateFakePet());

		const insertedUsers = await usersService.createMany(usersToInsert);
		const insertedPets = await petsService.createMany(petsToInsert);

		req.logger.info(
			`Inserted ${insertedUsers.length} users and ${insertedPets.length} pets`
		);
		res.status(200).json({
			error: false,
			message: `Generated ${insertedUsers.length} users and ${insertedPets.length} pets`,
			payload: { insertedUsers, insertedPets },
		});
	} catch (error) {
		req.logger.error(`Error in generateData: ${error.message}`, { stack: error.stack });
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};

export default {
	mockingUsers,
	mockingPets,
	generateData,
};
