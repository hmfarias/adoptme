// controllers/mocks.controller.js
import { generateFakeUser, generateFakePet, errorHandler } from '../utils.js';
import { usersService, petsService } from '../services/index.js';

const mockingUsers = async (req, res) => {
	const { quantity = 50 } = req.params;

	// Check if quantity is a positive number
	if (!quantity || isNaN(quantity) || quantity <= 0) {
		return res.status(400).json({
			error: true,
			message: 'Invalid quantity parameter. Must be a positive number.',
		});
	}

	try {
		let users = [];
		for (let i = 0; i < quantity; i++) {
			users.push(await generateFakeUser());
		}
		res.status(200).json({ error: false, message: 'mocking users', payload: users });
	} catch (error) {
		errorHandler(error, res);
	}
};

const mockingPets = (req, res) => {
	const { quantity } = req.params;

	// Check if quantity is a positive number
	if (!quantity || isNaN(quantity) || quantity <= 0) {
		return res.status(400).json({
			error: true,
			message: 'Invalid quantity parameter. Must be a positive number.',
		});
	}

	try {
		let pets = [];

		for (let i = 0; i < quantity; i++) {
			pets.push(generateFakePet());
		}

		res.status(200).json({ error: false, message: 'mocking pets', payload: pets });
	} catch (error) {
		errorHandler(error, res);
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

		res.status(200).json({
			status: 'success',
			message: `Generated ${insertedUsers.length} users and ${insertedPets.length} pets`,
		});
	} catch (error) {
		errorHandler(error, res);
	}
};

export default {
	mockingUsers,
	mockingPets,
	generateData,
};
